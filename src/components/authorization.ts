import { user, address } from './type';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { MongoClient } from 'mongodb';

const cloudURI =
    'mongodb+srv://vercel-admin-user:MCm8xsb6HBmZkcGP@cluster0.b23op1h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const client = new MongoClient(cloudURI);
const app = express();
const hash = (string: string) => {
    let result = 0;
    for (let i = 0; i < string.length; i++) {
        result += string.charCodeAt(i) + 7;
    }
    return result.toString();
};

function authorization() {
    const corsOptions = {
        origin: ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://127.0.0.1:5500', 'https://podcast-deploy.vercel.app'],
        methods: 'GET,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: ['X-admin-pass', 'X-hash-pass', 'Library', 'Content-Type'],
        credentials: true,
        maxAge: 86400,
    };
    const findOneByUserName = async (email: string) => {
        return await client
            .db('myDatabase')
            .collection('users')
            .findOne({ email: `${email}` });
    };

    app.use(express.json());
    app.use(cors(corsOptions));
    app.use(cookieParser());
    app.get('/listUsers', async function (req, res) {
        if (req.headers['x-admin-pass'] === 'root') {
            const usersArray = await client.db('myDatabase').collection('users').find().toArray();
            res.end(JSON.stringify(usersArray));
        } else {
            res.status(500);
            res.end('!!!Get out intruder!!!');
        }
    });

    app.post('/addUser', async function (req, res) {
        if (req.cookies['is-logged-in'] === 'false' || req.cookies['is-logged-in'] === undefined) {
            const reqData = req.body as user;
            const libraryTemplate = {
                email: `${reqData.email}`,
                likedPodcasts: [],
                subscribedPodcasts: [],
            };
            //check email
            await findOneByUserName(reqData.email).then(async (data) => {
                if (data === null && Object.keys(reqData).length === 4) {
                    await client.db('myDatabase').collection('users').insertOne(reqData);
                    //add library template
                    await client.db('podcastLibrary').collection('library').insertOne(libraryTemplate);
                    res.end(JSON.stringify(reqData));
                } else {
                    res.status(500);
                    res.end('This user exist');
                }
            });
        } else {
            res.status(500);
            res.end('You are logged in, please, sign out');
        }
    });

    app.get('/signIn/:email', async function (req, res) {
        try {
            const user = await client
                .db('myDatabase')
                .collection('users')
                .findOne({ email: `${req.params.email}` });
            if (user === null) {
                res.status(404);
                res.end('This user do not exist or incorrect email');
            } else {
                if (
                    req.cookies['email'] != undefined &&
                    req.cookies['email'] === hash(req.params.email) &&
                    req.cookies['is-logged-in'] === 'true'
                ) {
                    res.end(JSON.stringify(user));
                } else {
                    const userHashPassword = hash(user.userPassword);
                    if (req.headers['x-hash-pass'] === userHashPassword) {
                        res.cookie('email', `${hash(req.params.email)}`, {sameSite:'none', secure: true, expires:new Date(Date.now() + 3600*8*365)});
                        res.cookie('is-logged-in', 'true', {sameSite:'none', secure: true, expires:new Date(Date.now() + 3600*8*365)});
                        res.end(JSON.stringify(user));
                    } else {
                        console.log(req.cookies);
                        res.status(500);
                        res.end('Incorrect password');
                    }
                }
            }
        } catch (err) {
            res.status(500);
            res.end(err);
        }
    });

    app.get('/signOut/:email', async function (req, res) {
        if (
            req.cookies['email'] != undefined &&
            req.cookies['is-logged-in'] === 'true' &&
            req.cookies['email'] === hash(req.params.email)
        ) {
            res.clearCookie('email', {sameSite:'none', secure: true});
            res.clearCookie('is-logged-in', {sameSite:'none', secure: true});
            res.end('You are signOut');
        } else {
            res.end('Incorrect email or you are not sign in');
            res.status(500);
        }
    });

    app.delete('/deleteUser/:email', async function (req, res) {
        if (
            req.cookies['is-logged-in'] === 'true' &&
            req.cookies['email'] === hash(req.params.email) &&
            req.cookies['email'] === hash(req.params.email)
        ) {
            try {
                const user = await client
                    .db('myDatabase')
                    .collection('users')
                    .findOne({ email: `${req.params.email}` });
                if (user === null) {
                    res.status(404);
                    res.end('This user do not exist');
                } else {
                    await client
                        .db('myDatabase')
                        .collection('users')
                        .deleteOne({ email: `${req.params.email}` });
                    // delete user library
                    await client
                        .db('podcastLibrary')
                        .collection('library')
                        .deleteOne({ email: `${req.params.email}` });
                    res.clearCookie('email', {sameSite:'none', secure: true});
                    res.clearCookie('is-logged-in', {sameSite:'none', secure: true});
                    res.end('This user deleted');
                }
            } catch (err) {
                res.status(500);
                res.end(err);
            }
        } else {
            res.status(500);
            res.end('You are not logged in or incorrect email');
        }
    });

    app.patch('/updateUser/:email', async function (req, res) {
        const reqData = req.body as user;
        if (req.cookies['is-logged-in'] === 'true' && req.cookies['email'] === hash(req.params.email)) {
            try {
                const user = await client
                    .db('myDatabase')
                    .collection('users')
                    .findOne({ email: `${req.params.email}` });
                if (user === null) {
                    res.status(404);
                    res.end('This user do not exist');
                } else {
                    await client
                        .db('myDatabase')
                        .collection('users')
                        .updateOne({ email: `${req.params.email}` }, { $set: reqData });
                    res.end(JSON.stringify(reqData));
                }
            } catch (err) {
                res.status(500);
                res.end(err);
            }
        } else {
            res.status(500);
            res.end('You are not logged in or incorrect logged in user(you cant update other users)');
        }
    });

    const server = app.listen(8081, function () {
        const host = (server.address() as address).address;
        const port = (server.address() as address).port;
        console.log('Example app listening at http://%s:%s', host, port);
    });
}

export { authorization, app, client, hash };
