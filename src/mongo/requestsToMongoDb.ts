import { AddToSetOperators, MongoClient } from 'mongodb';
import { RegisterFormDataType, UserHistoryDataType } from '../models/type';

const cloudURI =
    'mongodb+srv://vercel-admin-user:MCm8xsb6HBmZkcGP@cluster0.b23op1h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const client = new MongoClient(cloudURI);

class mongoRequests {
    async findUserByEmail(email: string) {
        return await client
            .db('Airways')
            .collection('airwaysUsers')
            .findOne({ email: `${email}` });
    }

    async findHistoryByEmail(email: string) {
        return await client
            .db('Airways')
            .collection('airwaysHistory')
            .findOne({ email: `${email}` });
    }

    async addUserToDataBase(user: RegisterFormDataType) {
        return await client.db('Airways').collection('airwaysUsers').insertOne(user);
    }

    async addHistoryTemplateToDataBase(historyTemplate: { email: string; history: UserHistoryDataType[] }) {
        return await client.db('Airways').collection('airwaysHistory').insertOne(historyTemplate);
    }

    async addHistoryItemToDataBase(email: string, historyItem: UserHistoryDataType) {
        return await client.db('Airways').collection('airwaysHistory').updateMany({ email: `${email}` }, {
          $addToSet: { ['history']: historyItem },
      } as AddToSetOperators<Document>);
    }
}

export const mongodbRequests = new mongoRequests();
