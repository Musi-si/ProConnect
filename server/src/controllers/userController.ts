import { Request, Response } from 'express';
import User from '../models/userModel';

export class UserController {
  // Fetch user details by ID
  async getUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;
    try {
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  // Update user profile
  async updateUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;
    const updates = req.body;
    try {
      const user = await User.findByIdAndUpdate(userId, updates, { new: true });
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  // Delete user
  async deleteUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;
    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
}