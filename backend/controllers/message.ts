import { Request, Response } from 'express';
import { Socket } from 'socket.io';
// import { UserRequest } from '../middleware/middlewares';
import { Message } from '../models/message';
import { Sequelize } from 'sequelize';

export class MessageController {
  // Get single message
  async getMessage(req: Request, res: Response) {
    try {
      const message = await Message.findByPk(req.params.id);
      if (!message) return res.status(404).json({ message: 'Message not found' });
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  // Get messages by project
  async getMessagesByProject(req: Request, res: Response) {
    try {
      console.log("Full URL:", req.originalUrl);
      console.log('req.params:', req.params);
      const projectId = parseInt(req.params.projectId);
      console.log(projectId);
      if (isNaN(projectId)) {
        return res.status(400).json({ message: 'Invalid projectId' });
      }
      const messages = await Message.findAll({ where: { projectId } });
      res.json(messages);
    } catch (error) {
      console.error('Error in getMessagesByProject:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Create message and emit to project room
  async createMessage(req: Request, res: Response) {
    const io = req.app.get('io');
    try {
      const { content, receiverId } = req.body;
      const { projectId } = req.params;
      const senderId = req.user?.id; // Ensure req.user exists

      if (!content || !receiverId || !projectId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (isNaN(parseInt(projectId))) {
        return res.status(400).json({ message: 'Invalid projectId' });
      }

      // Optionally: Verify project exists and user has access
      const message = await Message.create({
        content,
        projectId: parseInt(projectId),
        senderId,
        receiverId,
        isRead: false,
      });

      console.log(message);


      io.to(`project_${message.projectId}`).emit('newMessage', message);

      res.status(201).json(message);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error creating message', error });
    }
  }
}