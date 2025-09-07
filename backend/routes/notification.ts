import { Router } from 'express';
import { NotificationsController } from '../controllers/notification';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const notificationsController = new NotificationsController();

// Get all notifications for a specific user
router.get('/user/:userId', authMiddleware, notificationsController.getUserNotifications.bind(notificationsController));

// Create a new notification
router.post('/', authMiddleware, notificationsController.createNotification.bind(notificationsController));

// Mark a notification as read
router.put('/:id/read', authMiddleware, notificationsController.markAsRead.bind(notificationsController));

export default router;