// controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import transporter from '../utils/email';
import { AuthRequest, JwtPayload } from '../middlewares/auth';

export class AuthController {
  // Register with email verification
  async register(req: AuthRequest, res: Response) {
    const { username, firstName, lastName, email, password, role } = req.body;

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const SECRET = process.env.JWT_SECRET as string;

      // JWT token for email verification (15 minutes)
      const token = jwt.sign(
        { username, firstName, lastName, email, password: hashedPassword, role },
        SECRET,
        { expiresIn: '15m' }
      );

      const url = `http://localhost:5000/api/auth/verify?token=${token}`;

      // Engaging HTML email
        const htmlEmail = `
        <div style="font-family: Arial, sans-serif; text-align: center; color: #333; padding: 20px;">
            <h2 style="color: #b76212;">Welcome to ProConnect!</h2>
            <p>Hi <strong>${username}</strong>,</p>
            <p>Thank you for joining <strong>ProConnect</strong> – the platform connecting freelancers and hirers worldwide.</p>
            <p>To start exploring projects and talent, please verify your email address by clicking the button below:</p>
            <a href="${url}" style="
            display: inline-block;
            margin: 20px 0;
            padding: 14px 28px;
            font-size: 16px;
            color: #fff;
            background-color: #b76212;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            ">Verify Email</a>
            <p style="font-size: 14px; color: #777;">This link will expire in 15 minutes.</p>
            <hr style="margin: 30px 0;">
            <p style="font-size: 12px; color: #999;">
            If you did not register for ProConnect, please ignore this email.
            </p>
        </div>
        `;


      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your email for ProConnect!',
        html: htmlEmail,
      });

      res.status(201).json({ message: 'Verification email sent successfully.' });
    } catch (err) {
      console.error('Signup error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Login
  async login(req: AuthRequest, res: Response) {
    const { email, password } = req.body;

    // Debug: show what frontend sent
    console.log('Login request body:', req.body);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      // Fetch user by email (fetch all columns, no hardcoded attributes)
      const user = await User.findOne({ where: { email } });

      if (!user) {
        console.log(`User with email ${email} not found`);
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Debug: show fetched user credentials
      console.log('Fetched user credentials:', { email: user.email, password: user.password });

      // Check password
      const isMatch = await bcrypt.compare(password, user.password!);
      console.log('Password match:', isMatch);

      if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

      // Check email verification
      if (!user.isEmailVerified) return res.status(401).json({ message: 'Email not verified' });

      const SECRET = process.env.JWT_SECRET as string;

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          username: user.username,
        },
        SECRET,
        { expiresIn: '1h' }
      );

      // Exclude password from response
      const { password: _, ...userData } = user.toJSON();

      res.json({ token, user: userData });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Email verification
  async verify(req: AuthRequest, res: Response) {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ message: 'Token is required' });
    }

    try {
      const SECRET = process.env.JWT_SECRET as string;
      const { username, firstName, lastName, email, password, role } = jwt.verify(token, SECRET) as any;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      await User.create({ username, firstName, lastName, email, password, role, isEmailVerified: true });

      // Redirect to frontend login page on port 5555
      res.redirect('http://localhost:5555/login');
    } catch (err) {
      console.error('Verification error:', err);
      res.status(400).json({ message: 'Invalid or expired token' });
    }
  }

  // Get profile
  async me(req: AuthRequest, res: Response) {
    if (!req.user) return res.status(401).json({ message: 'No token provided' });

    // Fetch user from DB using req.user.id
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  }
}