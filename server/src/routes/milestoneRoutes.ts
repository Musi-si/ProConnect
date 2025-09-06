import { Router } from 'express';
import { MilestoneController } from '../controllers/milestoneController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const milestoneController = new MilestoneController();

router.post('/', authMiddleware, milestoneController.createMilestone);
router.get('/:id', milestoneController.getMilestone);
router.put('/:id', authMiddleware, milestoneController.updateMilestone);
router.delete('/:id', authMiddleware, milestoneController.deleteMilestone);

export default router;