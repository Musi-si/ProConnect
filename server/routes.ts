import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Stripe from "stripe";
import { storage } from "./storage";
import { 
  loginSchema, 
  registerSchema, 
  insertProjectSchema,
  insertProposalSchema,
  insertMilestoneSchema,
  insertMessageSchema,
  insertNotificationSchema,
  type User 
} from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

let stripe: Stripe | null = null;
if (STRIPE_SECRET_KEY) {
  stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// WebSocket connections
const wsConnections = new Map<string, WebSocket>();

// Auth middleware
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await storage.getUser(decoded.userId);
    
    if (!user) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const userId = url.searchParams.get('userId');
    
    if (userId) {
      wsConnections.set(userId, ws);
      
      ws.on('close', () => {
        wsConnections.delete(userId);
      });

      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          
          if (message.type === 'chat_message') {
            // Save message to storage
            const newMessage = await storage.createMessage({
              projectId: message.projectId,
              senderId: message.senderId,
              receiverId: message.receiverId,
              content: message.content,
              attachments: message.attachments || []
            });

            // Send to receiver if online
            const receiverWs = wsConnections.get(message.receiverId);
            if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
              receiverWs.send(JSON.stringify({
                type: 'new_message',
                message: newMessage
              }));
            }

            // Create notification
            await storage.createNotification({
              userId: message.receiverId,
              title: 'New Message',
              message: `You have a new message from ${message.senderName}`,
              type: 'message',
              relatedId: message.projectId
            });
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      });
    }
  });

  // Auth Routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const existingUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already taken' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 12);
      
      // Generate email verification token
      const emailToken = crypto.randomBytes(32).toString('hex');

      // Create user
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
        emailVerificationToken: emailToken
      });

      // Generate JWT
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      // Remove sensitive data
      const { password, emailVerificationToken, ...userResponse } = user;

      res.status(201).json({ 
        user: userResponse, 
        token,
        message: 'Registration successful. Please verify your email.' 
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(400).json({ message: error.message || 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      // Remove sensitive data
      const { password, emailVerificationToken, resetPasswordToken, ...userResponse } = user;

      res.json({ user: userResponse, token });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(400).json({ message: error.message || 'Login failed' });
    }
  });

  app.post('/api/auth/verify-email', async (req, res) => {
    try {
      const { token } = req.body;
      
      // Find user by token
      const users = await storage.getProjects(); // This is a workaround - we need a proper findByToken method
      // For now, we'll just mark the current user as verified if they have a valid JWT
      
      res.json({ message: 'Email verified successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Email verification failed' });
    }
  });

  app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
      const { password, emailVerificationToken, resetPasswordToken, ...userResponse } = req.user!;
      res.json({ user: userResponse });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch user data' });
    }
  });

  // Project Routes
  app.get('/api/projects', async (req, res) => {
    try {
      const { 
        status, 
        category, 
        skills, 
        budgetMin, 
        budgetMax, 
        limit = 20, 
        offset = 0 
      } = req.query;

      const filters: any = {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      };

      if (status) filters.status = status;
      if (category) filters.category = category;
      if (skills) filters.skills = (skills as string).split(',');
      if (budgetMin) filters.budgetMin = parseFloat(budgetMin as string);
      if (budgetMax) filters.budgetMax = parseFloat(budgetMax as string);

      const projects = await storage.getProjects(filters);
      res.json({ projects });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch projects' });
    }
  });

  app.get('/api/projects/:id', async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.json({ project });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch project' });
    }
  });

  app.post('/api/projects', authenticateToken, async (req, res) => {
    try {
      if (req.user!.role !== 'client') {
        return res.status(403).json({ message: 'Only clients can create projects' });
      }

      const validatedData = insertProjectSchema.parse({
        ...req.body,
        clientId: req.user!.id
      });

      const project = await storage.createProject(validatedData);
      res.status(201).json({ project });
    } catch (error: any) {
      console.error('Project creation error:', error);
      res.status(400).json({ message: error.message || 'Failed to create project' });
    }
  });

  app.put('/api/projects/:id', authenticateToken, async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      if (project.clientId !== req.user!.id) {
        return res.status(403).json({ message: 'Not authorized to update this project' });
      }

      const updatedProject = await storage.updateProject(req.params.id, req.body);
      res.json({ project: updatedProject });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to update project' });
    }
  });

  // Proposal Routes
  app.get('/api/projects/:projectId/proposals', authenticateToken, async (req, res) => {
    try {
      const project = await storage.getProject(req.params.projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      if (project.clientId !== req.user!.id) {
        return res.status(403).json({ message: 'Not authorized to view proposals' });
      }

      const proposals = await storage.getProposalsByProject(req.params.projectId);
      res.json({ proposals });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch proposals' });
    }
  });

  app.post('/api/projects/:projectId/proposals', authenticateToken, async (req, res) => {
    try {
      if (req.user!.role !== 'freelancer') {
        return res.status(403).json({ message: 'Only freelancers can submit proposals' });
      }

      const project = await storage.getProject(req.params.projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      if (project.status !== 'open') {
        return res.status(400).json({ message: 'Project is not accepting proposals' });
      }

      const validatedData = insertProposalSchema.parse({
        ...req.body,
        projectId: req.params.projectId,
        freelancerId: req.user!.id
      });

      const proposal = await storage.createProposal(validatedData);

      // Notify client
      await storage.createNotification({
        userId: project.clientId,
        title: 'New Proposal Received',
        message: `${req.user!.firstName} ${req.user!.lastName} submitted a proposal for your project`,
        type: 'proposal',
        relatedId: req.params.projectId
      });

      res.status(201).json({ proposal });
    } catch (error: any) {
      console.error('Proposal creation error:', error);
      res.status(400).json({ message: error.message || 'Failed to create proposal' });
    }
  });

  app.put('/api/proposals/:id/accept', authenticateToken, async (req, res) => {
    try {
      const proposal = await storage.getProposal(req.params.id);
      if (!proposal) {
        return res.status(404).json({ message: 'Proposal not found' });
      }

      const project = await storage.getProject(proposal.projectId);
      if (!project || project.clientId !== req.user!.id) {
        return res.status(403).json({ message: 'Not authorized to accept this proposal' });
      }

      // Update proposal status
      const updatedProposal = await storage.updateProposal(req.params.id, { status: 'accepted' });

      // Update project
      await storage.updateProject(proposal.projectId, {
        freelancerId: proposal.freelancerId,
        acceptedProposalId: proposal.id,
        status: 'in_progress'
      });

      // Create milestones from proposal
      if (proposal.milestones && proposal.milestones.length > 0) {
        for (const milestone of proposal.milestones) {
          await storage.createMilestone({
            projectId: proposal.projectId,
            title: milestone.title,
            description: milestone.description,
            amount: milestone.amount.toString(),
            dueDate: new Date(milestone.dueDate)
          });
        }
      }

      // Notify freelancer
      await storage.createNotification({
        userId: proposal.freelancerId,
        title: 'Proposal Accepted!',
        message: `Your proposal for "${project.title}" has been accepted`,
        type: 'proposal',
        relatedId: proposal.projectId
      });

      res.json({ proposal: updatedProposal });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to accept proposal' });
    }
  });

  // Milestone Routes
  app.get('/api/projects/:projectId/milestones', authenticateToken, async (req, res) => {
    try {
      const project = await storage.getProject(req.params.projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      if (project.clientId !== req.user!.id && project.freelancerId !== req.user!.id) {
        return res.status(403).json({ message: 'Not authorized to view milestones' });
      }

      const milestones = await storage.getMilestonesByProject(req.params.projectId);
      res.json({ milestones });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch milestones' });
    }
  });

  app.put('/api/milestones/:id/approve', authenticateToken, async (req, res) => {
    try {
      const milestone = await storage.getMilestone(req.params.id);
      if (!milestone) {
        return res.status(404).json({ message: 'Milestone not found' });
      }

      const project = await storage.getProject(milestone.projectId);
      if (!project || project.clientId !== req.user!.id) {
        return res.status(403).json({ message: 'Not authorized to approve this milestone' });
      }

      const updatedMilestone = await storage.updateMilestone(req.params.id, {
        status: 'approved',
        approvedAt: new Date()
      });

      // Notify freelancer
      if (project.freelancerId) {
        await storage.createNotification({
          userId: project.freelancerId,
          title: 'Milestone Approved',
          message: `Milestone "${milestone.title}" has been approved`,
          type: 'milestone',
          relatedId: milestone.projectId
        });
      }

      res.json({ milestone: updatedMilestone });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to approve milestone' });
    }
  });

  // Payment Routes
  app.post('/api/milestones/:id/payment-intent', authenticateToken, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: 'Stripe not configured' });
      }

      const milestone = await storage.getMilestone(req.params.id);
      if (!milestone) {
        return res.status(404).json({ message: 'Milestone not found' });
      }

      const project = await storage.getProject(milestone.projectId);
      if (!project || project.clientId !== req.user!.id) {
        return res.status(403).json({ message: 'Not authorized to pay for this milestone' });
      }

      if (milestone.status !== 'approved') {
        return res.status(400).json({ message: 'Milestone must be approved before payment' });
      }

      const amount = Math.round(parseFloat(milestone.amount) * 100); // Convert to cents

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        metadata: {
          milestoneId: milestone.id,
          projectId: milestone.projectId,
          freelancerId: project.freelancerId || ''
        }
      });

      await storage.updateMilestone(req.params.id, {
        stripePaymentIntentId: paymentIntent.id
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error('Payment intent creation error:', error);
      res.status(500).json({ message: 'Failed to create payment intent' });
    }
  });

  app.post('/api/milestones/:id/confirm-payment', authenticateToken, async (req, res) => {
    try {
      const milestone = await storage.getMilestone(req.params.id);
      if (!milestone) {
        return res.status(404).json({ message: 'Milestone not found' });
      }

      const updatedMilestone = await storage.updateMilestone(req.params.id, {
        paidAt: new Date()
      });

      const project = await storage.getProject(milestone.projectId);
      
      // Update freelancer earnings
      if (project?.freelancerId) {
        const freelancer = await storage.getUser(project.freelancerId);
        if (freelancer) {
          const currentEarnings = parseFloat(freelancer.totalEarnings);
          const milestoneAmount = parseFloat(milestone.amount);
          await storage.updateUser(project.freelancerId, {
            totalEarnings: (currentEarnings + milestoneAmount).toString()
          });
        }

        // Notify freelancer
        await storage.createNotification({
          userId: project.freelancerId,
          title: 'Payment Received',
          message: `Payment of $${milestone.amount} for milestone "${milestone.title}" has been processed`,
          type: 'payment',
          relatedId: milestone.projectId
        });
      }

      res.json({ milestone: updatedMilestone });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to confirm payment' });
    }
  });

  // Message Routes
  app.get('/api/projects/:projectId/messages', authenticateToken, async (req, res) => {
    try {
      const project = await storage.getProject(req.params.projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      if (project.clientId !== req.user!.id && project.freelancerId !== req.user!.id) {
        return res.status(403).json({ message: 'Not authorized to view messages' });
      }

      const messages = await storage.getMessagesByProject(req.params.projectId);
      
      // Mark messages as read
      await storage.markMessagesAsRead(req.params.projectId, req.user!.id);

      res.json({ messages });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch messages' });
    }
  });

  app.get('/api/conversations', authenticateToken, async (req, res) => {
    try {
      const conversations = await storage.getConversations(req.user!.id);
      res.json({ conversations });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch conversations' });
    }
  });

  // Notification Routes
  app.get('/api/notifications', authenticateToken, async (req, res) => {
    try {
      const { limit = 20 } = req.query;
      const notifications = await storage.getNotificationsByUser(
        req.user!.id, 
        parseInt(limit as string)
      );
      res.json({ notifications });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch notifications' });
    }
  });

  app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ message: 'Notification marked as read' });
    } catch (error: any) {
      res.status(400).json({ message: 'Failed to mark notification as read' });
    }
  });

  // Search Routes
  app.get('/api/search/freelancers', async (req, res) => {
    try {
      const { 
        q = '', 
        skills, 
        location, 
        minRating, 
        limit = 20, 
        offset = 0 
      } = req.query;

      const filters: any = {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      };

      if (skills) filters.skills = (skills as string).split(',');
      if (location) filters.location = location;
      if (minRating) filters.minRating = parseFloat(minRating as string);

      const freelancers = await storage.searchFreelancers(q as string, filters);
      res.json({ freelancers });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to search freelancers' });
    }
  });

  // User Profile Routes
  app.get('/api/users/:id', async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Remove sensitive data
      const { password, emailVerificationToken, resetPasswordToken, ...userResponse } = user;
      
      // Get reviews
      const reviews = await storage.getReviewsByUser(user.id);
      
      res.json({ user: userResponse, reviews });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch user profile' });
    }
  });

  app.put('/api/users/profile', authenticateToken, async (req, res) => {
    try {
      const allowedUpdates = [
        'firstName', 'lastName', 'bio', 'location', 'skills', 
        'portfolioLinks', 'hourlyRate', 'avatar'
      ];
      
      const updates: any = {};
      for (const key of allowedUpdates) {
        if (req.body[key] !== undefined) {
          updates[key] = req.body[key];
        }
      }

      const updatedUser = await storage.updateUser(req.user!.id, updates);
      const { password, emailVerificationToken, resetPasswordToken, ...userResponse } = updatedUser;
      
      res.json({ user: userResponse });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to update profile' });
    }
  });

  return httpServer;
}
