import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticate } from '../../shared/middlewares';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);

// Protected routes
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
