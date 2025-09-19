import { Router } from 'express';
import { MessageController } from '../controllers/message';
import { authMiddleware } from '../middlewares/auth';

const router = Router({ mergeParams: true });
const messageController = new MessageController();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Messaging within projects
 */

/**
 * @swagger
 * /api/projects/{projectId}/messages/all:
 *   get:
 *     summary: Get all messages for a project
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project
 *     responses:
 *       200:
 *         description: List of messages for this project
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 */
router.get('/all', authMiddleware, messageController.getMessagesByProject.bind(messageController));

/**
 * @swagger
 * /api/projects/{projectId}/messages/add:
 *   post:
 *     summary: Create a new message for a project
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Message content
 *     responses:
 *       201:
 *         description: Message created
 *       401:
 *         description: Unauthorized
 */
router.post('/add', authMiddleware, messageController.createMessage.bind(messageController));

/**
 * @swagger
 * /api/projects/{projectId}/messages/{id}:
 *   get:
 *     summary: Get a single message by ID within a project
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the message
 *     responses:
 *       200:
 *         description: Message details
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', authMiddleware, messageController.getMessage.bind(messageController));

export default router;