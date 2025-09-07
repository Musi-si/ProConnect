import { Router } from 'express';
import { ProposalsController } from '../controllers/proposal';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const proposalsController = new ProposalsController();

// Get proposal by ID
router.get('/:id', proposalsController.getProposal.bind(proposalsController));

// Get proposals by project
router.get('/project/:projectId', proposalsController.getProposalsByProject.bind(proposalsController));

// Get proposals by freelancer
router.get('/freelancer/:freelancerId', proposalsController.getProposalsByFreelancer.bind(proposalsController));

// Create a new proposal (requires authentication)
router.post('/', authMiddleware, proposalsController.createProposal.bind(proposalsController));

// Update a proposal (requires authentication)
router.put('/:id', authMiddleware, proposalsController.updateProposal.bind(proposalsController));

// Delete a proposal (requires authentication)
router.delete('/:id', authMiddleware, proposalsController.deleteProposal.bind(proposalsController));

export default router;
