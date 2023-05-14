import {} from '../models/type';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRouter, historyRouter } from '../components/router';
import { Cors } from '../config/config';
import swaggerUi from 'swagger-ui-express';
import swagger from '../swagger/openapi';

const PORT = process.env.PORT || 8081;
const corsOptions = Cors;

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use('/auth', authRouter);
app.use('/history', historyRouter);
app.use('/greetings', (req, res) => {
    return res.json({ message: 'Everything work fine' });
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));

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
