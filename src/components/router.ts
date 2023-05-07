import { Router } from 'express';
import { controller } from './controller';
import { check } from 'express-validator';

const router = Router();

router.post(
    '/registration',
    [
        check('email', "email shouldn't be empty").notEmpty(),
        check('password', 'password should be min 8 symbols').isLength({ min: 8 }),
    ],
    controller.registration
);
router.post(
    '/login',
    [
        check('email', "email shouldn't be empty").notEmpty(),
        check('password', 'password should be min 8 symbols').isLength({ min: 8 }),
    ],
    controller.login
);
router.post('/logout', controller.logout);
router.post('/saveHistory', controller.addHistoryItem);
router.get('/history', controller.getHistory);

export default router;
