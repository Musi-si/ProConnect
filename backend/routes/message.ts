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
 * /api/messages/{id}:
 *   get:
 *     summary: Get a message by ID
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 * /api/messages/project/{projectId}:
 *   get:
 *     summary: Get all messages by project
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
router.get('/project/:projectId', authMiddleware, messageController.getMessagesByProject.bind(messageController));

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Create a new message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectId
 *               - content
 *             properties:
 *               projectId:
 *                 type: string
 *                 example: 64f7e5b9c2a7f2e56d9f1c8d
 *               content:
 *                 type: string
 *                 example: "This is a project update message"
 *     responses:
 *       201:
 *         description: Message created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, messageController.createMessage.bind(messageController));

export default router;
