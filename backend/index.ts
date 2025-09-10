import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend folder
dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import sequelize from './config/db';

// Swagger (optional)
import { swaggerUi, swaggerSpec } from './swagger';

// Import model initializers
import { initUser } from './models/user';
import { initMessage } from './models/message';
import { initProject, Project } from './models/project';
import { initProposal, Proposal } from './models/proposal';
import { initReview } from './models/review';
import { initMilestone } from './models/milestone';
import { initNotification } from './models/notification';

// Import routes
import authRoutes from './routes/auth';
import messageRoutes from './routes/message';
import projectRoutes from './routes/project';
// import proposalRoutes from './routes/proposal';
import reviewRoutes from './routes/review';
import milestoneRoutes from './routes/milestone';
import notificationRoutes from './routes/notification';
import userRoutes from './routes/user';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5555',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5555', credentials: true }));

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/projects', projectRoutes);
// app.use('/api/projects/:projectId/proposals', proposalRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);

// Initialize all models
initUser(sequelize);
initMessage(sequelize);
initProject(sequelize);
initProposal(sequelize);
initReview(sequelize);
initMilestone(sequelize);
initNotification(sequelize);

// Setup associations
Project.associate();
Proposal.associate();

// Real-time messaging
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinProject', (projectId: string) => {
    socket.join(`project_${projectId}`);
    console.log(`Socket ${socket.id} joined project_${projectId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available in controllers
app.set('io', io);

const PORT = 5000;
server.listen(PORT, '127.0.0.1', async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log(`✅ MySQL connection established & models synchronized.`);
    console.log(`🚀 ProConnect backend running on port ${PORT}`);
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
});
