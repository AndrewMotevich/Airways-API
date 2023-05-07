import { Request, Response } from 'express';
import { RegisterFormDataType, LoginFormDataType } from '../models/type';
import bcryptjs from 'bcryptjs';
import { validationResult } from 'express-validator/src/validation-result';
import { mongodbRequests } from '../mongo/requestsToMongoDb';
import jwt, { JwtPayload } from 'jsonwebtoken';
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
                return res.status(400).json({ message: "This user don't exist", errors });
            }
            const validPassword = bcryptjs.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: 'Incorrect password', errors });
            }
            const token = generateRefreshToken(email, user.firstName, user.lastName);
            return res.json({ token });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'Login error' });
        }
    }
    // add history item to database
    async addHistoryItem(req: Request, res: Response) {
        try {
            res.end();
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
                res.status(400).json({ message: 'User is not login' });
            } else {
                jwt.verify(token, Secret.refreshSecret, async (error, decoded) => {
                    if (error) {
                        return res.status(400).json({ message: 'Unauthorized' });
                    } else if (decoded) {
                        const payload = decoded as LoginFormDataType;
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
    return jwt.sign(payload, Secret.accessSecret, { expiresIn: '1h' });
}
function generateRefreshToken(email: string, firstName: string, lastName: string) {
    const payload = {
        email,
        firstName,
        lastName,
    };
    return jwt.sign(payload, Secret.refreshSecret, { expiresIn: '24h' });
}
