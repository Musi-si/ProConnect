import { Request, Response } from 'express';
import Notification from '../models/notificationModel';

export class NotificationController {
  async getNotificationsByUser(req: Request, res: Response) {
    try {
      const notifications = await Notification.find({ userId: req.params.userId });
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  async createNotification(req: Request, res: Response) {
    try {
      const notification = new Notification(req.body);
      await notification.save();
      res.status(201).json(notification);
    } catch (error) {
      res.status(400).json({ message: 'Error creating notification', error });
    }
  }

  async markNotificationAsRead(req: Request, res: Response) {
    try {
      const notification = await Notification.findByIdAndUpdate(
        req.params.id,
        { isRead: true },
        { new: true }
      );
      if (!notification) return res.status(404).json({ message: 'Notification not found' });
      res.json(notification);
    } catch (error) {
      res.status(400).json({ message: 'Error updating notification', error });
    }
  }
}