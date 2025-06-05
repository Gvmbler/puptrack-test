import express from 'express';
import authController from '../controllers/authController';
import { googleRegisterOrLogin } from '../Middleware/AuthMiddleware';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/pet', authController.pet);
router.post('/google-auth', googleRegisterOrLogin);

export default router;