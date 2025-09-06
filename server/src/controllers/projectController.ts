import { Request, Response } from 'express';
import Project from '../models/projectModel';
import Milestone from '../models/milestoneModel';

export class ProjectController {
  // Get all projects (with optional filters)
  async getProjects(req: Request, res: Response) {
    try {
      const projects = await Project.find().populate('milestones');
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  // Get a single project by ID
  async getProject(req: Request, res: Response) {
    try {
      const project = await Project.findById(req.params.id).populate('milestones');
      if (!project) return res.status(404).json({ message: 'Project not found' });
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  // Create a new project
  async createProject(req: Request, res: Response) {
    try {
      const project = new Project(req.body);
      await project.save();
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: 'Error creating project', error });
    }
  }

  // Update a project
  async updateProject(req: Request, res: Response) {
    try {
      const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!project) return res.status(404).json({ message: 'Project not found' });
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: 'Error updating project', error });
    }
  }

  // Delete a project
  async deleteProject(req: Request, res: Response) {
    try {
      const project = await Project.findByIdAndDelete(req.params.id);
      if (!project) return res.status(404).json({ message: 'Project not found' });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting project', error });
    }
  }
}