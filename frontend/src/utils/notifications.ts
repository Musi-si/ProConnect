// src/services/notifications.ts
import {api} from './api'
import { Notification } from '../types'

// Fetch user notifications
export const getNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const res = await api.get(`/notifications/user/${userId}`)
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch notifications')
  }
}

// Mark notification as read
export const markAsRead = async (id: string): Promise<Notification> => {
  try {
    const res = await api.put(`/notifications/read/${id}`)
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to mark as read')
  }
}
