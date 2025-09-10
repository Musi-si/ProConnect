// routes/proposal.ts
import { Router } from "express";
import { ProposalsController } from "../controllers/proposal";
import { authMiddleware } from "../middlewares/auth";

const router = Router({ mergeParams: true }); // allows :projectId from parent router
const proposalsController = new ProposalsController();

/**
 * @swagger
 * tags:
 *   name: Proposals
 *   description: Manage proposals within a project
 */

/**
 * @swagger
 * /api/projects/{projectId}/proposals/all:
 *   get:
 *     summary: Get all proposals for a project
 *     tags: [Proposals]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     responses:
 *       200:
 *         description: List of proposals
 */
router.get("/all", proposalsController.getProposalsByProject.bind(proposalsController));

/**
 * @swagger
 * /api/projects/{projectId}/proposals/add:
 *   post:
 *     summary: Submit a proposal for a project
 *     tags: [Proposals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProposalInput'
 *     responses:
 *       201:
 *         description: Proposal created successfully
 */
router.post("/add", authMiddleware, proposalsController.createProposal.bind(proposalsController));

/**
 * @swagger
 * /api/projects/{projectId}/proposals/{proposalId}:
 *   get:
 *     summary: Get a proposal by ID
 *     tags: [Proposals]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: proposalId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proposal details
 *       404:
 *         description: Proposal not found
 */
router.get("/:proposalId", proposalsController.getProposal.bind(proposalsController));

/**
 * @swagger
 * /api/projects/{projectId}/proposals/{proposalId}:
 *   put:
 *     summary: Update a proposal
 *     tags: [Proposals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: proposalId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProposalInput'
 *     responses:
 *       200:
 *         description: Proposal updated successfully
 *       404:
 *         description: Proposal not found
 */
router.put("/:proposalId", authMiddleware, proposalsController.updateProposal.bind(proposalsController));

/**
 * @swagger
 * /api/projects/{projectId}/proposals/{proposalId}:
 *   delete:
 *     summary: Delete a proposal
 *     tags: [Proposals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: proposalId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Proposal deleted successfully
 *       404:
 *         description: Proposal not found
 */
router.delete("/:proposalId", authMiddleware, proposalsController.deleteProposal.bind(proposalsController));

/**
 * @swagger
 * /api/projects/{projectId}/proposals/{proposalId}/accept:
 *   put:
 *     summary: Accept a proposal (client only)
 *     tags: [Proposals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: proposalId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proposal accepted successfully
 */
router.put("/:proposalId/accept", authMiddleware, proposalsController.acceptProposal.bind(proposalsController));

export default router;
