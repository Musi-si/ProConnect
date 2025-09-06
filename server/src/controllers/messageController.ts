import { Request, Response } from 'express';
import Message from '../models/messageModel';

export class MessageController {
  async getMessage(req: Request, res: Response) {
    try {
      const message = await Message.findById(req.params.id);
      if (!message) return res.status(404).json({ message: 'Message not found' });
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  async getMessagesByProject(req: Request, res: Response) {
    try {
      const messages = await Message.find({ projectId: req.params.projectId });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  async createMessage(req: Request, res: Response) {
    try {
      const message = new Message(req.body);
      await message.save();
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: 'Error creating message', error });
    }
  }
}