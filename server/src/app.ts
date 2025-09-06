import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import messageRoutes from './routes/messageRoutes';
import milestoneRoutes from './routes/milestoneRoutes';
import notificationRoutes from './routes/notificationRoutes';
import proposalRoutes from './routes/proposalRoutes';
import reviewRoutes from './routes/reviewRoutes';
import userRoutes from './routes/userRoutes';
import projectRoutes from './routes/projectRoutes';
import errorHandler from './middleware/errorHandler';
import connectDB from './db/index';
import { not } from 'drizzle-orm';

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/notifcations', notificationRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/messages', messageRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;