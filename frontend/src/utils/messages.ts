// src/utils/messages.ts
import { api } from './api';
import type { Message } from '../types';

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
    // Assuming backend returns an array directly, not nested in `data`
    return res; 
  } catch (error: any) {
    console.error("Failed to fetch messages API:", error); // Added debug log
    throw new Error(error.message || 'Failed to fetch messages');
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
    return res;
  } catch (error: any) {
    console.error("Failed to fetch message by ID API:", error); // Added debug log
    throw new Error(error.message || 'Failed to fetch message');
  }
};

export const sendMessage = async (projectId: string, content: string, receiverId?: string): Promise<Message> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    const res = await api.post(`/projects/${projectId}/messages/add`, { content, receiverId },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log('API sendMessage response: ', res);

    // Assuming backend returns the created message object directly
    return res; 
    
  } catch (error: any) {
    console.error("Failed to send message API:", error); // Added debug log
    // The actual error message from the server should be in error.message
    throw new Error(error.message || 'Failed to send message');
  }
};