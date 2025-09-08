// routes/proposal.ts
import { Router } from 'express';
import { ProposalsController } from '../controllers/proposal';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const proposalsController = new ProposalsController();

/**
 * @swagger
 * tags:
 *   name: Proposals
 *   description: Manage project proposals
 */

/**
 * @swagger
 * /api/proposals/{id}:
 *   get:
 *     summary: Get a proposal by ID
 *     tags: [Proposals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The proposal ID
 *     responses:
 *       200:
 *         description: Proposal data
 *       404:
 *         description: Proposal not found
 */
router.get('/:id', proposalsController.getProposal.bind(proposalsController));

/**
 * @swagger
 * /api/proposals/project/{projectId}:
 *   get:
 *     summary: Get proposals by project ID
 *     tags: [Proposals]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: The project ID
 *     responses:
 *       200:
 *         description: List of proposals for the project
 *       404:
 *         description: No proposals found for this project
 */
router.get('/project/:projectId', proposalsController.getProposalsByProject.bind(proposalsController));

/**
 * @swagger
 * /api/proposals/freelancer/{freelancerId}:
 *   get:
 *     summary: Get proposals by freelancer ID
 *     tags: [Proposals]
 *     parameters:
 *       - in: path
 *         name: freelancerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The freelancer ID
 *     responses:
 *       200:
 *         description: List of proposals by the freelancer
 *       404:
 *         description: No proposals found for this freelancer
 */
router.get('/freelancer/:freelancerId', proposalsController.getProposalsByFreelancer.bind(proposalsController));

/**
 * @swagger
 * /proposals:
 *   post:
 *     summary: Create a new proposal
 *     tags: [Proposals]
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
 *               - freelancerId
 *               - content
 *             properties:
 *               projectId:
 *                 type: string
 *                 example: 64f7e5b9c2a7f2e56d9f1c8d
 *               freelancerId:
 *                 type: string
 *                 example: 64f7e5b9c2a7f2e56d9f1c9e
 *               content:
 *                 type: string
 *                 example: "I would love to work on this project. I have experience in similar tasks."
 *     responses:
 *       201:
 *         description: Proposal created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, proposalsController.createProposal.bind(proposalsController));

/**
 * @swagger
 * /api/proposals/{id}:
 *   put:
 *     summary: Update a proposal
 *     tags: [Proposals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The proposal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Updated proposal content"
 *     responses:
 *       200:
 *         description: Proposal updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Proposal not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', authMiddleware, proposalsController.updateProposal.bind(proposalsController));

/**
 * @swagger
 * /api/proposals/{id}:
 *   delete:
 *     summary: Delete a proposal
 *     tags: [Proposals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The proposal ID
 *     responses:
 *       200:
 *         description: Proposal deleted successfully
 *       404:
 *         description: Proposal not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authMiddleware, proposalsController.deleteProposal.bind(proposalsController));

export default router;
