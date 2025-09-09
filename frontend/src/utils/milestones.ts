// src/services/milestones.ts
import {api} from './api'
import { Milestone } from '../types'

// Fetch milestones for a project
export const getMilestones = async (projectId: string): Promise<Milestone[]> => {
  try {
    const res = await api.get(`/milestones/project/${projectId}`)
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch milestones')
  }
}

// Add milestone
export const addMilestone = async (
  milestone: Partial<Milestone>
): Promise<Milestone> => {
  try {
    const res = await api.post('/milestones/add', milestone)
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to add milestone')
  }
}

// Update milestone
export const updateMilestone = async (
  id: string,
  updates: Partial<Milestone>
): Promise<Milestone> => {
  try {
    const res = await api.put(`/milestones/update/${id}`, updates)
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update milestone')
  }
}

// Delete milestone
export const deleteMilestone = async (id: string): Promise<{ message: string }> => {
  try {
    const res = await api.delete(`/milestones/delete/${id}`)
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete milestone')
  }
}
