import { Request, Response } from 'express';
import { Project } from '../models/project';
import { User } from '../models/user'; // or User depending on your setup
import { AuthRequest } from 'middlewares/auth';
import { Op } from "sequelize";

export class ProjectsController {
  // Get all projects with optional filters
  async getAllProjects(req: Request, res: Response) {
    try {
      const {
        q,
        category,
        skills,
        budgetMin,
        budgetMax,
        timeline,
        status,
        limit,
        offset,
      } = req.query;

      const where: any = {};

      if (q) {
        where.title = { [Op.iLike]: `%${q}%` }; // case-insensitive search
      }

      if (category) {
        where.category = category;
      }

      if (skills) {
        // assuming skills is stored as array in DB (JSON/ARRAY column)
        where.skills = {
          [Op.contains]: Array.isArray(skills) ? skills : [skills],
        };
      }

      if (budgetMin || budgetMax) {
        where.budget = {};
        if (budgetMin) where.budget[Op.gte] = Number(budgetMin);
        if (budgetMax) where.budget[Op.lte] = Number(budgetMax);
      }

      if (timeline) {
        where.timeline = timeline;
      }

      if (status) {
        where.status = status;
      }

      const projects = await Project.findAll({
        where,
        limit: limit ? Number(limit) : 20,
        offset: offset ? Number(offset) : 0,
        order: [["createdAt", "DESC"]],
      });

      // Parse skills field so frontend always gets an array
      const parsedProjects = projects.map(project => ({
        ...project.toJSON(),
        skills: typeof project.skills === "string" ? JSON.parse(project.skills || "[]") : project.skills,
        attachments: typeof project.attachments === "string" ? JSON.parse(project.attachments || "[]") : project.attachments,
        milestones: typeof project.milestones === "string" ? JSON.parse(project.milestones || "[]") : project.milestones,
      }));

      res.json(parsedProjects);
    } catch (error) {
      console.error("Get projects error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Get project by ID
  async getProjectById(req: Request, res: Response) {
    try {
      const project = await Project.findByPk(req.params.id);
      if (!project) return res.status(404).json({ message: 'Project not found' });
      res.json(project);
    } catch (error) {
      console.error('Get project error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }

  // Create a new project
  async createProject(req: AuthRequest, res: Response) {
    try {
      // Extract clientId from the authenticated user
      const clientId = req.user?.id; // `id` comes from decoded JWT
      if (!clientId) {
        return res.status(401).json({ message: 'Unauthorized: no user info found' });
      }

      // Merge clientId into project data
      const projectData = { ...req.body, clientId };

      // Create project
      const project = await Project.create(projectData);

      // Add $25 to client's totalSpent
      await User.increment(
        { totalSpent: 25 },
        { where: { id: clientId } }
      );

      res.status(201).json(project);
    } catch (error) {
      console.error('Create project error:', error);
      res.status(400).json({ message: 'Error creating project', error });
    }
  }

  // Update a project
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

  // Delete a project
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
