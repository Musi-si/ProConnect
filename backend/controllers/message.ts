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
      const messages = await Message.findAll({ where: { projectId: req.params.projectId } });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  // Create message and emit to project room
  async createMessage(req: Request, res: Response) {
    const io = req.app.get('io'); // Access Socket.IO instance

    try {
      const message = await Message.create(req.body);

      // Emit message to all clients in project room
      io.to(`project_${message.projectId}`).emit('newMessage', message);

      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: 'Error creating message', error });
    }
  }
}
