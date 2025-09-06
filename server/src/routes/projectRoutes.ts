import { Router } from 'express';
import { ProjectController } from '../controllers/projectController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const projectController = new ProjectController();

// Project routes
router.post('/', authMiddleware, projectController.createProject);
router.get('/:id', projectController.getProject);
router.get('/', projectController.getProjects);
router.put('/:id', authMiddleware, projectController.updateProject);
router.delete('/:id', authMiddleware, projectController.deleteProject);

export default router;