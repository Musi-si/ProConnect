import { 
  type User, 
  type InsertUser, 
  type Project, 
  type InsertProject,
  type Proposal,
  type InsertProposal,
  type Milestone,
  type InsertMilestone,
  type Message,
  type InsertMessage,
  type Notification,
  type InsertNotification,
  type Review,
  type InsertReview
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  updateUserEmailVerification(id: string, isVerified: boolean): Promise<User>;
  updateUserResetToken(id: string, token: string | null, expires?: Date): Promise<User>;
  
  // Projects
  getProject(id: string): Promise<Project | undefined>;
  getProjects(filters?: { 
    clientId?: string; 
    freelancerId?: string; 
    status?: string; 
    category?: string;
    skills?: string[];
    budgetMin?: number;
    budgetMax?: number;
    limit?: number;
    offset?: number;
  }): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<Project>): Promise<Project>;
  deleteProject(id: string): Promise<boolean>;
  
  // Proposals
  getProposal(id: string): Promise<Proposal | undefined>;
  getProposalsByProject(projectId: string): Promise<Proposal[]>;
  getProposalsByFreelancer(freelancerId: string): Promise<Proposal[]>;
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  updateProposal(id: string, updates: Partial<Proposal>): Promise<Proposal>;
  
  // Milestones
  getMilestone(id: string): Promise<Milestone | undefined>;
  getMilestonesByProject(projectId: string): Promise<Milestone[]>;
  createMilestone(milestone: InsertMilestone): Promise<Milestone>;
  updateMilestone(id: string, updates: Partial<Milestone>): Promise<Milestone>;
  
  // Messages
  getMessage(id: string): Promise<Message | undefined>;
  getMessagesByProject(projectId: string): Promise<Message[]>;
  getConversations(userId: string): Promise<Array<{ projectId: string; lastMessage: Message; unreadCount: number }>>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessagesAsRead(projectId: string, userId: string): Promise<void>;
  
  // Notifications
  getNotificationsByUser(userId: string, limit?: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<void>;
  markAllNotificationsAsRead(userId: string): Promise<void>;
  
  // Reviews
  getReviewsByUser(userId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Search
  searchFreelancers(query: string, filters?: { 
    skills?: string[]; 
    location?: string; 
    minRating?: number;
    limit?: number;
    offset?: number;
  }): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private projects: Map<string, Project> = new Map();
  private proposals: Map<string, Proposal> = new Map();
  private milestones: Map<string, Milestone> = new Map();
  private messages: Map<string, Message> = new Map();
  private notifications: Map<string, Notification> = new Map();
  private reviews: Map<string, Review> = new Map();

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now, 
      updatedAt: now,
      totalEarnings: "0",
      totalSpent: "0",
      rating: "0",
      reviewCount: 0,
      isEmailVerified: false,
      emailVerificationToken: null,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      stripeCustomerId: null,
      skills: insertUser.skills || [],
      portfolioLinks: insertUser.portfolioLinks || []
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserEmailVerification(id: string, isVerified: boolean): Promise<User> {
    return this.updateUser(id, { isEmailVerified: isVerified, emailVerificationToken: null });
  }

  async updateUserResetToken(id: string, token: string | null, expires?: Date): Promise<User> {
    return this.updateUser(id, { resetPasswordToken: token, resetPasswordExpires: expires || null });
  }

  // Projects
  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjects(filters?: any): Promise<Project[]> {
    let projects = Array.from(this.projects.values());
    
    if (filters?.clientId) {
      projects = projects.filter(p => p.clientId === filters.clientId);
    }
    if (filters?.freelancerId) {
      projects = projects.filter(p => p.freelancerId === filters.freelancerId);
    }
    if (filters?.status) {
      projects = projects.filter(p => p.status === filters.status);
    }
    if (filters?.category) {
      projects = projects.filter(p => p.category === filters.category);
    }
    if (filters?.skills?.length) {
      projects = projects.filter(p => 
        filters.skills.some((skill: string) => p.skills.includes(skill))
      );
    }
    if (filters?.budgetMin) {
      projects = projects.filter(p => parseFloat(p.budget) >= filters.budgetMin);
    }
    if (filters?.budgetMax) {
      projects = projects.filter(p => parseFloat(p.budget) <= filters.budgetMax);
    }

    // Sort by creation date (newest first)
    projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (filters?.offset) {
      projects = projects.slice(filters.offset);
    }
    if (filters?.limit) {
      projects = projects.slice(0, filters.limit);
    }

    return projects;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const now = new Date();
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: now, 
      updatedAt: now,
      freelancerId: null,
      acceptedProposalId: null,
      skills: insertProject.skills || [],
      attachments: insertProject.attachments || []
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const project = this.projects.get(id);
    if (!project) throw new Error("Project not found");
    
    const updatedProject = { ...project, ...updates, updatedAt: new Date() };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Proposals
  async getProposal(id: string): Promise<Proposal | undefined> {
    return this.proposals.get(id);
  }

  async getProposalsByProject(projectId: string): Promise<Proposal[]> {
    return Array.from(this.proposals.values())
      .filter(p => p.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getProposalsByFreelancer(freelancerId: string): Promise<Proposal[]> {
    return Array.from(this.proposals.values())
      .filter(p => p.freelancerId === freelancerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createProposal(insertProposal: InsertProposal): Promise<Proposal> {
    const id = randomUUID();
    const now = new Date();
    const proposal: Proposal = { 
      ...insertProposal, 
      id, 
      createdAt: now, 
      updatedAt: now,
      milestones: insertProposal.milestones || [],
      portfolioSamples: insertProposal.portfolioSamples || [],
      questions: insertProposal.questions || null
    };
    this.proposals.set(id, proposal);
    return proposal;
  }

  async updateProposal(id: string, updates: Partial<Proposal>): Promise<Proposal> {
    const proposal = this.proposals.get(id);
    if (!proposal) throw new Error("Proposal not found");
    
    const updatedProposal = { ...proposal, ...updates, updatedAt: new Date() };
    this.proposals.set(id, updatedProposal);
    return updatedProposal;
  }

  // Milestones
  async getMilestone(id: string): Promise<Milestone | undefined> {
    return this.milestones.get(id);
  }

  async getMilestonesByProject(projectId: string): Promise<Milestone[]> {
    return Array.from(this.milestones.values())
      .filter(m => m.projectId === projectId)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  async createMilestone(insertMilestone: InsertMilestone): Promise<Milestone> {
    const id = randomUUID();
    const now = new Date();
    const milestone: Milestone = { 
      ...insertMilestone, 
      id, 
      createdAt: now, 
      updatedAt: now,
      deliverables: insertMilestone.deliverables || [],
      feedback: null,
      approvedAt: null,
      paidAt: null,
      stripePaymentIntentId: null
    };
    this.milestones.set(id, milestone);
    return milestone;
  }

  async updateMilestone(id: string, updates: Partial<Milestone>): Promise<Milestone> {
    const milestone = this.milestones.get(id);
    if (!milestone) throw new Error("Milestone not found");
    
    const updatedMilestone = { ...milestone, ...updates, updatedAt: new Date() };
    this.milestones.set(id, updatedMilestone);
    return updatedMilestone;
  }

  // Messages
  async getMessage(id: string): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesByProject(projectId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(m => m.projectId === projectId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async getConversations(userId: string): Promise<Array<{ projectId: string; lastMessage: Message; unreadCount: number }>> {
    const messages = Array.from(this.messages.values())
      .filter(m => m.senderId === userId || m.receiverId === userId);

    const conversationMap = new Map<string, { lastMessage: Message; unreadCount: number }>();

    for (const message of messages) {
      const projectId = message.projectId;
      const existing = conversationMap.get(projectId);
      
      if (!existing || new Date(message.createdAt) > new Date(existing.lastMessage.createdAt)) {
        const unreadCount = messages.filter(m => 
          m.projectId === projectId && 
          m.receiverId === userId && 
          !m.isRead
        ).length;
        
        conversationMap.set(projectId, { lastMessage: message, unreadCount });
      }
    }

    return Array.from(conversationMap.entries()).map(([projectId, data]) => ({
      projectId,
      ...data
    }));
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = { 
      ...insertMessage, 
      id, 
      createdAt: new Date(),
      attachments: insertMessage.attachments || []
    };
    this.messages.set(id, message);
    return message;
  }

  async markMessagesAsRead(projectId: string, userId: string): Promise<void> {
    for (const [id, message] of this.messages.entries()) {
      if (message.projectId === projectId && message.receiverId === userId && !message.isRead) {
        this.messages.set(id, { ...message, isRead: true });
      }
    }
  }

  // Notifications
  async getNotificationsByUser(userId: string, limit = 50): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = { 
      ...insertNotification, 
      id, 
      createdAt: new Date()
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    const notification = this.notifications.get(id);
    if (notification) {
      this.notifications.set(id, { ...notification, isRead: true });
    }
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    for (const [id, notification] of this.notifications.entries()) {
      if (notification.userId === userId && !notification.isRead) {
        this.notifications.set(id, { ...notification, isRead: true });
      }
    }
  }

  // Reviews
  async getReviewsByUser(userId: string): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(r => r.revieweeId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = { ...insertReview, id, createdAt: new Date() };
    this.reviews.set(id, review);
    return review;
  }

  // Search
  async searchFreelancers(query: string, filters?: any): Promise<User[]> {
    let users = Array.from(this.users.values())
      .filter(u => u.role === "freelancer");

    if (query) {
      const searchTerm = query.toLowerCase();
      users = users.filter(u => 
        u.username.toLowerCase().includes(searchTerm) ||
        u.firstName?.toLowerCase().includes(searchTerm) ||
        u.lastName?.toLowerCase().includes(searchTerm) ||
        u.bio?.toLowerCase().includes(searchTerm) ||
        u.skills.some(skill => skill.toLowerCase().includes(searchTerm))
      );
    }

    if (filters?.skills?.length) {
      users = users.filter(u => 
        filters.skills.some((skill: string) => u.skills.includes(skill))
      );
    }
    if (filters?.location) {
      users = users.filter(u => u.location?.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters?.minRating) {
      users = users.filter(u => parseFloat(u.rating) >= filters.minRating);
    }

    // Sort by rating (highest first)
    users.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));

    if (filters?.offset) {
      users = users.slice(filters.offset);
    }
    if (filters?.limit) {
      users = users.slice(0, filters.limit);
    }

    return users;
  }
}

export const storage = new MemStorage();
