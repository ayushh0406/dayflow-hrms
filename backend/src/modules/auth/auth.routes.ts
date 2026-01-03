import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticate } from '../../shared/middlewares';
import { upload } from '../../shared/middlewares/upload';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/signup', upload.single('companyLogo'), authController.signUp);
router.post('/signin', authController.signIn);

// Protected routes
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
