import { Router } from 'express';
import { MessageController } from '../controllers/message';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const messageController = new MessageController();

// Get a message by ID
router.get('/:id', authMiddleware, messageController.getMessage.bind(messageController));

// Get messages by project
router.get('/project/:projectId', authMiddleware, messageController.getMessagesByProject.bind(messageController));

// Create a new message
router.post('/', authMiddleware, messageController.createMessage.bind(messageController));

export default router;
