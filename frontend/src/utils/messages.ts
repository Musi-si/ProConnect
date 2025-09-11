// src/utils/messages.ts
import { api } from './api';
import type { Message } from '../types';
import { use } from 'passport';

// Fetch all messages for a project
export const getMessagesByProject = async (projectId: string): Promise<Message[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    const res = await api.get(`/projects/${projectId}/messages/all`, {},
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return res.data; // backend returns array of messages
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch messages');
  }
};

// Fetch single message by ID (optional, if needed)
export const getMessageById = async (projectId: string, id: string): Promise<Message> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    const res = await api.get(`/projects/${projectId}/messages/${id}`, {},
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch message');
  }
};

// Send a new message for a project
export const sendMessage = async (projectId: string, content: string, receiverId?: string): Promise<Message> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const senderId = user?.id;

    if (!senderId) throw new Error("No sender ID found");

    const res = await api.post(`/projects/${projectId}/messages/add`, { senderId, content, receiverId },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to send message');
  }
};
