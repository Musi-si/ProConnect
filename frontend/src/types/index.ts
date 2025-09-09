export interface WebSocketMessage {
  type: 'chat_message' | 'new_message' | 'user_online' | 'user_offline';
  projectId?: string;
  senderId?: string;
  receiverId?: string;
  senderName?: string;
  content?: string;
  attachments?: string[];
  message?: Message;
}

export interface SearchFilters {
  category?: string;
  skills?: string[];
  budgetMin?: number;
  budgetMax?: number;
  timeline?: string;
  location?: string;
  minRating?: number;
  limit?: number;
  offset?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// --- Core Entities ---

export interface User {
  _id: string;
  username: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  profilePicture?: string;
  role: 'client' | 'freelancer';
  location?: string;
  totalEarnings?: string;
  totalSpent?: string;
  rating?: string;
  reviewCount?: number;
  isEmailVerified: boolean;
  emailVerificationToken?: string | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: string | null;
  stripeCustomerId?: string | null;
  skills: string[];
  portfolioLinks: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  clientId: string;
  freelancerId?: string | null;
  budget: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  category?: string;
  timeline?: string;
  coverImage?: string;
  clientName?: string;
  clientAvatar?: string;
  clientRating?: string;
  clientReviewCount?: number;
  skills: string[];
  createdAt: string;
  updatedAt: string;
  attachments: string[];
  acceptedProposalId?: string | null;
  milestones?: Milestone[];
}

export interface Milestone {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Proposal {
  _id: string;
  freelancerId: string;
  projectId: string;
  budget: number;
  description: string;
  milestones: Milestone[];
  coverLetter?: string;
  proposedBudget?: number;
  proposedTimeline?: string;
  status?: 'pending' | 'accepted' | 'rejected';
  portfolioSamples?: string[];
  questions?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  projectId: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  attachments?: string[];
}

export interface Notification {
  _id: string;
  userId: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Review {
  _id: string;
  reviewerId: string;
  revieweeId: string;
  projectId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
