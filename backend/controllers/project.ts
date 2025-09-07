import { Request, Response } from 'express';
import { Project } from '../models/project';

export class ProjectsController {
  // Get all projects
  async getAllProjects(req: Request, res: Response) {
    try {
      const projects = await Project.findAll();
      res.json(projects);
    } catch (error) {
      console.error('Get projects error:', error);
      res.status(500).json({ message: 'Server error', error });
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
  async createProject(req: Request, res: Response) {
    try {
      const project = await Project.create(req.body);
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
