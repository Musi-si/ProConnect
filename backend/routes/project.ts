import { Router } from 'express';
import { ProjectsController } from '../controllers/project';
import { authMiddleware, authorizeRoles } from '../middlewares/auth';
import proposalRoutes from './proposal';
import messageRoutes from './message';

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
 * /api/projects/all:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of all projects
 */
router.get('/all', projectsController.getAllProjects.bind(projectsController));

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
 *               - title
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
 *               category:
 *                 type: string
 *                 example: "Web Development"
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["React", "NodeJS"]
 *               timeline:
 *                 type: string
 *                 example: "2 weeks"
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
router.post('/add', authMiddleware, authorizeRoles('client'),
  projectsController.createProject.bind(projectsController));

/**
 * @swagger
 * tags:
 *   name: Proposals
 *   description: Manage proposals for a project
 *
 * /api/projects/{projectId}/proposals:
 *   get:
 *     summary: Get all proposals for a project
 *     tags: [Proposals]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of proposals for this project
 */
router.use('/:projectId/proposals', proposalRoutes);

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Messaging within projects
 *
 * /api/projects/{projectId}/messages/all:
 *   get:
 *     summary: Get all messages for a project
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of messages for this project
 *
 * /api/projects/{projectId}/messages/add:
 *   post:
 *     summary: Add a new message to a project
 *     tags: [Messages]
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
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Hello from client"
 *               receiverId:
 *                 type: string
 *                 example: "3"
 *     responses:
 *       201:
 *         description: Message created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.use('/:projectId/messages', messageRoutes);

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
