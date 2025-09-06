export interface WebSocketMessage {
  type: 'chat_message' | 'new_message' | 'user_online' | 'user_offline';
  projectId?: string;
  senderId?: string;
  receiverId?: string;
  senderName?: string;
  content?: string;
  attachments?: string[];
  message?: any;
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
