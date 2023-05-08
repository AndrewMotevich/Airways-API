import { Router } from 'express';
import { controller } from './controller';
import { check } from 'express-validator';

const authRouter = Router();
const historyRouter = Router();

authRouter.post(
    '/registration',
    [
        check('email', "email shouldn't be empty").notEmpty(),
        check('password', 'password should be min 8 symbols').isLength({ min: 8 }),
    ],
    controller.registration
);
authRouter.post(
    '/login',
    [
        check('email', "email shouldn't be empty").notEmpty(),
        check('password', 'password should be min 8 symbols').isLength({ min: 8 }),
    ],
    controller.login
);
authRouter.get('/refresh', controller.refresh);
historyRouter.post(
    '/saveHistory',
    [
        check('roundedTrip', "roundedTrip shouldn't be empty").notEmpty(),
        check('from', "from shouldn't be empty").notEmpty(),
        check('destination', "destination shouldn't be empty").notEmpty(),
    ],
    controller.addHistoryItem
);
historyRouter.get('/getHistory', controller.getHistory);

export {authRouter, historyRouter};
