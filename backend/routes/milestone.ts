import { Router } from 'express';
import { MilestoneController } from '../controllers/milestone';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const milestoneController = new MilestoneController();

// Get milestone by ID
router.get('/:id', authMiddleware, milestoneController.getMilestone.bind(milestoneController));

// Create milestone
router.post('/', authMiddleware, milestoneController.createMilestone.bind(milestoneController));

// Update milestone
router.put('/:id', authMiddleware, milestoneController.updateMilestone.bind(milestoneController));

// Delete milestone
router.delete('/:id', authMiddleware, milestoneController.deleteMilestone.bind(milestoneController));

export default router;
