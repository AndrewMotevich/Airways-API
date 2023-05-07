import {} from '../models/type';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from '../components/router';
import { Cors } from '../config/config';

const PORT = process.env.PORT || 8081;
const corsOptions = Cors;

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
