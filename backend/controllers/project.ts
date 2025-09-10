import { Request, Response } from 'express';
import { Project } from '../models/project';
import { User } from '../models/user';
import { AuthRequest } from '../middlewares/auth';
import { Proposal } from '../models/proposal';
import { Op } from "sequelize";

export class ProjectsController {
  // Get all projects (include proposals)
  async getAllProjects(req: Request, res: Response) {
    try {
      const { q, category, skills, budgetMin, budgetMax, timeline, status, limit, offset } = req.query;
      const where: any = {};

      if (q) where.title = { [Op.iLike]: `%${q}%` };
      if (category) where.category = category;
      if (skills) where.skills = { [Op.contains]: Array.isArray(skills) ? skills : [skills] };
      if (budgetMin || budgetMax) {
        where.budget = {};
        if (budgetMin) where.budget[Op.gte] = Number(budgetMin);
        if (budgetMax) where.budget[Op.lte] = Number(budgetMax);
      }
      if (timeline) where.timeline = timeline;
      if (status) where.status = status;

      const projects = await Project.findAll({
        where,
        limit: limit ? Number(limit) : 20,
        offset: offset ? Number(offset) : 0,
        order: [["createdAt", "DESC"]],
        include: [{ model: Proposal, as: 'proposals' }], // include proposals
      });

      res.json(projects);
    } catch (error) {
      console.error("Get projects error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Get project by ID (include proposals)
  async getProjectById(req: Request, res: Response) {
    try {
      const project = await Project.findByPk(req.params.id, {
        include: [{ model: Proposal, as: 'proposals' }],
      });
      if (!project) return res.status(404).json({ message: 'Project not found' });
      res.json(project);
    } catch (error) {
      console.error('Get project error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }

  // Create project
  async createProject(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user?.id;
      if (!clientId) return res.status(401).json({ message: 'Unauthorized' });

      const projectData = { ...req.body, clientId };
      const project = await Project.create(projectData);

      await User.increment({ totalSpent: 25 }, { where: { id: clientId } });

      res.status(201).json(project);
    } catch (error) {
      console.error('Create project error:', error);
      res.status(400).json({ message: 'Error creating project', error });
    }
  }

  // Update project
  async updateProject(req: Request, res: Response) {
    try {
      const project = await Project.findByPk(req.params.id);
      if (!project) return res.status(404).json({ message: 'Project not found' });

      await project.update(req.body);
      res.json(project);
    } catch (error) {
      console.error('Update project error:', error);
      res.status(400).json({ message: 'Error updating project', error });
    }
  }

  // Delete project
  async deleteProject(req: Request, res: Response) {
    try {
      const project = await Project.findByPk(req.params.id);
      if (!project) return res.status(404).json({ message: 'Project not found' });

      await project.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Delete project error:', error);
      res.status(500).json({ message: 'Error deleting project', error });
    }
  }
}
