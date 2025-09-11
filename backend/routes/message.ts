// routes/message.ts
import { Router } from 'express';
import { MessageController } from '../controllers/message';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const messageController = new MessageController();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Messaging within projects
 */

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
 *         schema:
 *           type: string
 *         required: true
 *         description: The project ID
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The message ID
 *     responses:
 *       200:
 *         description: The requested message
 *       404:
 *         description: Message not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', authMiddleware, messageController.getMessage.bind(messageController));

/**
 * @swagger
 * /api/projects/{projectId}/messages:
 *   get:
 *     summary: Get all messages for a project
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: The project ID
 *     responses:
 *       200:
 *         description: List of messages for the project
 *       404:
 *         description: Project not found or no messages
 *       401:
 *         description: Unauthorized
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
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: The project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "This is a project update message"
 *               receiverId:
 *                 type: string
 *                 example: "3"
 *     responses:
 *       201:
 *         description: Message created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/add', authMiddleware, messageController.createMessage.bind(messageController));

export default router;
