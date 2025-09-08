// routes/milestone.ts
import { Router } from 'express';
import { MilestoneController } from '../controllers/milestone';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const milestoneController = new MilestoneController();

/**
 * @swagger
 * tags:
 *   name: Milestones
 *   description: Project milestone management
 */

/**
 * @swagger
 * /api/milestones/{id}:
 *   get:
 *     summary: Get a milestone by ID
 *     tags: [Milestones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The milestone ID
 *     responses:
 *       200:
 *         description: Milestone data
 *       404:
 *         description: Milestone not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', authMiddleware, milestoneController.getMilestone.bind(milestoneController));

/**
 * @swagger
 * /milestones:
 *   post:
 *     summary: Create a new milestone
 *     tags: [Milestones]
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
 *               - title
 *               - dueDate
 *             properties:
 *               projectId:
 *                 type: string
 *                 example: 64f7e5b9c2a7f2e56d9f1c8d
 *               title:
 *                 type: string
 *                 example: "Phase 1 Completion"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-30"
 *     responses:
 *       201:
 *         description: Milestone created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, milestoneController.createMilestone.bind(milestoneController));

/**
 * @swagger
 * /api/milestones/{id}:
 *   put:
 *     summary: Update a milestone
 *     tags: [Milestones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The milestone ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Phase 1 Updated"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-10-15"
 *     responses:
 *       200:
 *         description: Milestone updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Milestone not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', authMiddleware, milestoneController.updateMilestone.bind(milestoneController));

/**
 * @swagger
 * /api/milestones/{id}:
 *   delete:
 *     summary: Delete a milestone
 *     tags: [Milestones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The milestone ID
 *     responses:
 *       200:
 *         description: Milestone deleted successfully
 *       404:
 *         description: Milestone not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authMiddleware, milestoneController.deleteMilestone.bind(milestoneController));

export default router;
