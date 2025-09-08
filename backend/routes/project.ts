// routes/project.ts
import { Router } from 'express';
import { ProjectsController } from '../controllers/project';
import { authMiddleware, authorizeRoles } from '../middlewares/auth';

const router = Router();
const projectsController = new ProjectsController();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Manage projects
 */

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of all projects
 */
router.get('/', projectsController.getAllProjects.bind(projectsController));

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The project ID
 *     responses:
 *       200:
 *         description: Project data
 *       404:
 *         description: Project not found
 */
router.get('/:id', projectsController.getProjectById.bind(projectsController));

/**
 * @swagger
 * /api/projects/add:
 *   post:
 *     summary: Create a new project (client only)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Website Project"
 *               description:
 *                 type: string
 *                 example: "A project to build a company website"
 *               budget:
 *                 type: number
 *                 example: 7500
 *               clientId:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (only clients can create projects)
 */
router.post(
  '/add',
  authMiddleware,
  authorizeRoles('client'),
  projectsController.createProject.bind(projectsController)
);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Project Name"
 *               description:
 *                 type: string
 *                 example: "Updated project details"
 *               deadline:
 *                 type: string
 *                 format: date
 *                 example: "2026-01-15"
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Project not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', authMiddleware, projectsController.updateProject.bind(projectsController));

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authMiddleware, projectsController.deleteProject.bind(projectsController));

export default router;
