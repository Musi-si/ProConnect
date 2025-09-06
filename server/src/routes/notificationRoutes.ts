import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const notificationController = new NotificationController();

router.get('/user/:userId', authMiddleware, notificationController.getNotificationsByUser);
router.post('/', authMiddleware, notificationController.createNotification);
router.put('/:id/read', authMiddleware, notificationController.markNotificationAsRead);

export default router;