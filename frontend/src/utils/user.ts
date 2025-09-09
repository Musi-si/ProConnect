// src/services/users.ts
import { api } from './api'
import { User } from '../types'

// Fetch all users
export const getUsers = async (): Promise<User[]> => {
  try {
    const res = await api.get('/users/all')
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users')
  }
}

// Fetch single user by ID
export const getUserById = async (id: string): Promise<User> => {
  try {
    const res = await api.get(`/users/${id}`)
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user')
  }
}

// Update user profile
export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  try {
    const res = await api.put(`/users/update/${id}`, updates)
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update user')
  }
}


// Update the logged-in user's profile
export const updateProfile = async (
  updates: Partial<User>
): Promise<User> => {
  try {
    const res = await api.put('/users/profile', updates)
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update profile')
  }
}

// Delete user
export const deleteUser = async (id: string): Promise<{ message: string }> => {
  try {
    const res = await api.delete(`/users/delete/${id}`)
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete user')
  }
}
