import { Request, Response } from 'express';
import { RegisterFormDataType, LoginFormDataType, TokenPayloadType, UserHistoryDataType, RefreshTokenFromDataBaseType } from '../models/type';
import bcryptjs from 'bcryptjs';
import { validationResult } from 'express-validator/src/validation-result';
import { mongodbRequests } from '../mongo/requestsToMongoDb';
import jwt from 'jsonwebtoken';
import { Secret } from '../config/config';

class authController {
    // registration
    async registration(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Registration error', errors });
            }
            const { email, password } = req.body as RegisterFormDataType;
            const candidate = await mongodbRequests.findUserByEmail(email);
            if (candidate) {
                return res.status(400).json({ message: 'This user exist' });
            }
            const hashPass = bcryptjs.hashSync(password, 5);
            const newUser = req.body as RegisterFormDataType;
            newUser.password = hashPass;
            await mongodbRequests.addUserToDataBase(newUser);
            await mongodbRequests.addHistoryTemplateToDataBase({ email: email, history: [] });
            await mongodbRequests.addRefreshTokenTemplateToDataBase(email);
            return res.json({ message: `User ${newUser.firstName} successfully registered` });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'Registration error' });
        }
    }
    // login and get JWT tokens
    async login(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Login error', errors });
            }
            const { email, password } = req.body as LoginFormDataType;
            const user = await mongodbRequests.findUserByEmail(email);
            if (!user) {
                return res.status(400).json({ message: "This user don't exist"});
            }
            const validPassword = bcryptjs.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: 'Incorrect password'});
            }
            const refreshToken = generateRefreshToken(email, user.firstName, user.lastName);
            const accessToken = generateAccessToken(email, user.firstName, user.lastName);
            await mongodbRequests.addRefreshTokenToDataBase(email, refreshToken);
            res.cookie('refresh', refreshToken, {httpOnly: true ,sameSite:'none', secure: true, maxAge: Date.now() + 2000 });
            return res.json({ accessToken });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'Login error' });
        }
    }
    async logout(req: Request, res: Response) {
        try {
                await res.cookie('refresh', 'logout', {httpOnly: true, sameSite:'none', secure: true,  maxAge: Date.now() + 2000});
                return res.json({ message: 'You are logout' });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'Logout error' });
        }
    }
    // refresh refresh token
    async refresh(req: Request, res: Response) {
        try {
            const oldRefreshToken: string = req.cookies['refresh'];
            if (!oldRefreshToken) {
                return res.status(400).json({ message: 'User is not login' });
            }
            jwt.verify(oldRefreshToken, Secret.refreshSecret, async (error, decoded) => {
                if (error) {
                    return res.status(400).json({ message: 'Unauthorized' });
                }
                else if (decoded) {
                    const payload = decoded as TokenPayloadType;
                    // check refresh token from data base
                    await mongodbRequests.findRefreshTokenByEmail(payload.email)
                    .then(async refreshTokenFromDataBase => {
                        if (oldRefreshToken === (refreshTokenFromDataBase as unknown as RefreshTokenFromDataBaseType).refreshToken){
                            const refreshToken = generateRefreshToken(payload.email, payload.firstName, payload.lastName);
                            const accessToken = generateAccessToken(payload.email, payload.firstName, payload.lastName);
                            await mongodbRequests.addRefreshTokenToDataBase(payload.email, refreshToken);
                            res.cookie('refresh', refreshToken, {httpOnly: true, sameSite:'none', secure: true, maxAge: Date.now() + 2000 });
                            return res.json({ accessToken });
                        }
                        else {
                            return res.status(400).json({message: "This token invalid or old. You cant take two valid tokens."});
                        }
                    });
                }
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'Refresh error' });
        }
    }
    // add history item to database
    async addHistoryItem(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'addHistoryItem error', errors });
            }
            const token = req.headers.authorization?.split(' ')[1];
            const historyItem = req.body as UserHistoryDataType;
            if (!token) {
                res.status(400).json({ message: 'User is not login' });
            } else {
                jwt.verify(token, Secret.accessSecret, async (error, decoded) => {
                    if (error) {
                        return res.status(400).json({ message: 'Unauthorized' });
                    } else if (decoded) {
                        const payload = decoded as TokenPayloadType;
                        await mongodbRequests.addHistoryItemToDataBase(payload.email, historyItem);
                        return res.json({ message: 'History item was successfully add' });
                    }
                });
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'addHistoryItem error' });
        }
    }
    // get history from database
    async getHistory(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(400).json({ message: 'User is not login' });
            } else {
                jwt.verify(token, Secret.accessSecret, async (error, decoded) => {
                    if (error) {
                        return res.status(400).json({ message: 'Unauthorized' });
                    } else if (decoded) {
                        const payload = decoded as TokenPayloadType;
                        const history = await mongodbRequests.findHistoryByEmail(payload.email);
                        return res.json({ history });
                    }
                });
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'getHistory error' });
        }
    }
}
export const controller = new authController();

function generateAccessToken(email: string, firstName: string, lastName: string) {
    const payload = {
        email,
        firstName,
        lastName,
    };
    return jwt.sign(payload, Secret.accessSecret, { expiresIn: '10m' });
}
function generateRefreshToken(email: string, firstName: string, lastName: string) {
    const payload = {
        email,
        firstName,
        lastName,
    };
    return jwt.sign(payload, Secret.refreshSecret, { expiresIn: '24h' });
}
