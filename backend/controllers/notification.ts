import { Request, Response } from 'express';
import { Notification } from '../models/notification';

export class NotificationsController {
  // Get notifications for a user
  async getUserNotifications(req: Request, res: Response) {
    try {
      const notifications = await Notification.findAll({ where: { userId: req.params.userId } });
      res.json(notifications);
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }

  // Create a notification
  async createNotification(req: Request, res: Response) {
    try {
      const notification = await Notification.create(req.body);
      res.status(201).json(notification);
    } catch (error) {
      console.error('Create notification error:', error);
      res.status(400).json({ message: 'Error creating notification', error });
    }
  }

  // Mark notification as read
  async markAsRead(req: Request, res: Response) {
    try {
      const notification = await Notification.findByPk(req.params.id);
      if (!notification) return res.status(404).json({ message: 'Notification not found' });

      await notification.update({ isRead: true });
      res.json(notification);
    } catch (error) {
      console.error('Mark notification read error:', error);
      res.status(400).json({ message: 'Error updating notification', error });
    }
  }
}
