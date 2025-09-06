import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();
const authController = new AuthController();

// User registration route
router.post('/register', authController.register);

// User login route
router.post('/login', authController.login);

// Token verification route (optional)
router.get('/verify-token', authController.verifyToken);

export default router;