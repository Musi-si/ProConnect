import { Request, Response } from 'express';
import { User } from '../models/userModel';
import { generateToken } from '../utils';
import bcrypt from 'bcrypt';

export class AuthController {
  async register(req: Request, res: Response) {
    const { email, password, username } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, username });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({ user, token });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({ user, token });
  }

  async logout(req: Request, res: Response) {
    // Handle logout logic (e.g., invalidate token)
    res.status(200).json({ message: 'Logged out successfully' });
  }
}