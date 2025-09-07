import { Request, Response } from 'express';
import { Milestone } from '../models/milestone';

export class MilestoneController {
  // Get milestone by ID
  async getMilestone(req: Request, res: Response) {
    try {
      const milestone = await Milestone.findByPk(req.params.id);
      if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
      res.json(milestone);
    } catch (error) {
      console.error('Get milestone error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }

  // Create a new milestone
  async createMilestone(req: Request, res: Response) {
    try {
      const milestone = await Milestone.create(req.body);
      res.status(201).json(milestone);
    } catch (error) {
      console.error('Create milestone error:', error);
      res.status(400).json({ message: 'Error creating milestone', error });
    }
  }

  // Update an existing milestone
  async updateMilestone(req: Request, res: Response) {
    try {
      const milestone = await Milestone.findByPk(req.params.id);
      if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

      await milestone.update(req.body);
      res.json(milestone);
    } catch (error) {
      console.error('Update milestone error:', error);
      res.status(400).json({ message: 'Error updating milestone', error });
    }
  }

  // Delete a milestone
  async deleteMilestone(req: Request, res: Response) {
    try {
      const milestone = await Milestone.findByPk(req.params.id);
      if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

      await milestone.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Delete milestone error:', error);
      res.status(500).json({ message: 'Error deleting milestone', error });
    }
  }
}
