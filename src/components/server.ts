import {} from './type';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './router';

const PORT = process.env.PORT || 8081;
const corsOptions = {
    origin: [
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'http://127.0.0.1:5500',
        'https://podcast-deploy.vercel.app',
    ],
    methods: 'GET,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['X-admin-pass', 'X-hash-pass', 'Library', 'Content-Type', 'Authorization'],
    credentials: true,
};

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use('/airways', router);

const start = () => {
    try {
        app.listen(PORT, function () {
            console.log('Example app listening at http://localhost', PORT);
        });
    } catch (error) {
        console.log(error);
    }
};

export { start };
