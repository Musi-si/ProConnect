// routes/notification.ts
import { Router } from 'express';
import { NotificationsController } from '../controllers/notification';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const notificationsController = new NotificationsController();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Manage user notifications
 */

/**
 * @swagger
 * /api/notifications/user/{userId}:
 *   get:
 *     summary: Get all notifications for a specific user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: List of notifications
 *       404:
 *         description: No notifications found for this user
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/user/:userId',
  authMiddleware,
  notificationsController.getUserNotifications.bind(notificationsController)
);

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - message
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 64f7e5b9c2a7f2e56d9f1c8d
 *               message:
 *                 type: string
 *                 example: "You have been assigned a new task"
 *     responses:
 *       201:
 *         description: Notification created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  authMiddleware,
  notificationsController.createNotification.bind(notificationsController)
);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/:id/read',
  authMiddleware,
  notificationsController.markAsRead.bind(notificationsController)
);

export default router;
