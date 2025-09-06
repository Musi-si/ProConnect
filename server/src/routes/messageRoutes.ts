import { Router } from 'express';
import { MessageController } from '../controllers/messageController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const messageController = new MessageController();

router.post('/', authMiddleware, messageController.createMessage);
router.get('/:id', authMiddleware, messageController.getMessage);
router.get('/project/:projectId', authMiddleware, messageController.getMessagesByProject);

export default router;