import { Request, Response } from 'express';
import Milestone from '../models/milestoneModel';

export class MilestoneController {
  async getMilestone(req: Request, res: Response) {
    try {
      const milestone = await Milestone.findById(req.params.id);
      if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
      res.json(milestone);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  async createMilestone(req: Request, res: Response) {
    try {
      const milestone = new Milestone(req.body);
      await milestone.save();
      res.status(201).json(milestone);
    } catch (error) {
      res.status(400).json({ message: 'Error creating milestone', error });
    }
  }

  async updateMilestone(req: Request, res: Response) {
    try {
      const milestone = await Milestone.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
      res.json(milestone);
    } catch (error) {
      res.status(400).json({ message: 'Error updating milestone', error });
    }
  }

  async deleteMilestone(req: Request, res: Response) {
    try {
      const milestone = await Milestone.findByIdAndDelete(req.params.id);
      if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting milestone', error });
    }
  }
}