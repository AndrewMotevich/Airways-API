import { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import { RegisterFormDataType, UserHistoryDataType } from './type';
import bcryptjs from 'bcryptjs';
import { validationResult } from 'express-validator/src/validation-result';

const cloudURI =
    'mongodb+srv://vercel-admin-user:MCm8xsb6HBmZkcGP@cluster0.b23op1h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const client = new MongoClient(cloudURI);

class authController {
    // registration
    async registration(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Registration error', errors });
            }
            const { email, password } = req.body as RegisterFormDataType;
            const candidate = await findUserByEmail(email);
            if (candidate) {
                return res.status(400).json({ message: 'This user exist' });
            }
            const hashPass = bcryptjs.hashSync(password, 5);
            const newUser = req.body as RegisterFormDataType;
            newUser.password = hashPass;
            await addUserToDataBase(newUser);
            return res.json({ message: `User ${newUser.firstName} successfully registered` });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'Registration error' });
        }
    }
    // login and get JWT tokens
    async login(req: Request, res: Response) {
        try {
            res.json('login works');
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'login error' });
        }
    }
    // log out
    async logout(req: Request, res: Response) {
        try {
            res.json('login works');
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'login error' });
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
            res.end();
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'getHistory error' });
        }
    }
}
export const controller = new authController();

async function findUserByEmail(email: string) {
    return await client
        .db('Airways')
        .collection('airwaysUsers')
        .findOne({ email: `${email}` });
}
async function findHistoryByEmail(email: string) {
    return await client
        .db('Airways')
        .collection('airwaysUsers')
        .findOne({ email: `${email}` });
}
async function addUserToDataBase(user: RegisterFormDataType) {
    return await client.db('Airways').collection('airwaysUsers').insertOne(user);
}
async function addHistoryTemplateToDataBase(historyTemplate: { email: string; history: UserHistoryDataType[] }) {
    return await client.db('Airways').collection('airwaysHistory').insertOne(historyTemplate);
}
async function addHistoryItemToDataBase(user: RegisterFormDataType) {
    return await client.db('Airways').collection('airwaysHistory').insertOne(user);
}
async function getHistoryFromDataBase() {
    return await client.db('Airways').collection('airwaysHistory');
}
