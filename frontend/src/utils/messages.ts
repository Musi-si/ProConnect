// src/services/messages.ts
import {api} from './api'
import { Message } from '../types'

// Fetch messages for a project
export const getMessages = async (projectId: string): Promise<Message[]> => {
  try {
    const res = await api.get(`/messages/project/${projectId}`)
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch messages')
  }
}

// Send message
export const sendMessage = async (
  message: Partial<Message>
): Promise<Message> => {
  try {
    const res = await api.post('/messages/send', message)
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to send message')
  }
}
