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
        check('firstName', "firstName shouldn't be empty").notEmpty(),
        check('lastName', "lastName shouldn't be empty").notEmpty(),
        check('bthDate', "bthDate shouldn't be empty").notEmpty(),
        check('gender', "email shouldn't be empty").notEmpty(),
        check('country', "country shouldn't be empty").notEmpty(),
        check('phoneNumber', "phoneNumber shouldn't be empty").notEmpty(),
        check('citizenship', "citizenship shouldn't be empty").notEmpty(),
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
authRouter.get('/logout', controller.logout);
authRouter.get('/refresh', controller.refresh);
historyRouter.get(
    '/trips',
    controller.getHistory
);
historyRouter.post(
    '/trips',
    [
        check('roundedTrip', "roundedTrip shouldn't be empty").notEmpty(),
        check('from', "from shouldn't be empty").notEmpty(),
        check('destination', "destination shouldn't be empty").notEmpty(),
    ],
    controller.addHistoryItem
);
export {authRouter, historyRouter};
