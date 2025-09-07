// routes/auth.ts
import { Router } from 'express';
import { AuthController } from '../controllers/authh';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const authController = new AuthController();

// User registration
router.post('/register', authController.register.bind(authController));

// User login
router.post('/login', authController.login.bind(authController));

// Get current user profile
router.get('/me', authMiddleware, authController.me.bind(authController));

// Email verification
router.get('/verify', authController.verify.bind(authController)); // <-- ADD THIS

export default router;
