import { Router } from 'express';
import { ProjectsController } from '../controllers/project';
import { authMiddleware, authorizeRoles } from '../middlewares/auth';

const router = Router();
const projectsController = new ProjectsController();

// Get all projects
router.get('/', projectsController.getAllProjects.bind(projectsController));

// Get project by ID
router.get('/:id', projectsController.getProjectById.bind(projectsController));

// Create a new project
router.post('/', authMiddleware, authorizeRoles('client'), projectsController.createProject.bind(projectsController));

// Update a project
router.put('/:id', authMiddleware, projectsController.updateProject.bind(projectsController));

// Delete a project
router.delete('/:id', authMiddleware, projectsController.deleteProject.bind(projectsController));

export default router;
