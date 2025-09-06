import { Router } from 'express';
import { ProposalController } from '../controllers/proposalController';

const router = Router();
const proposalController = new ProposalController();

router.post('/', proposalController.createProposal);
router.get('/:id', proposalController.getProposal);
// router.get('/project/:projectId', proposalController.getProposalsByProject);
// router.get('/freelancer/:freelancerId', proposalController.getProposalsByFreelancer);
router.put('/:id', proposalController.updateProposal);
router.delete('/:id', proposalController.deleteProposal);

export default router;