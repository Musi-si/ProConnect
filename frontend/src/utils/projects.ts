// src/utils/projects.ts
import {api} from './api'
import { Project } from '../types'

// Fetch all projects
export const getProjects = async (): Promise<Project[]> => {
  try {
    const data = await api.get('/projects/all'); // no headers / params
    return data; // api.get already returns JSON
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch projects');
  }
};

// Fetch single project
export const getProjectById = async (id: string): Promise<Project> => {
  try {
    const res = await api.get(`/projects/${id}`)
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch project')
  }
}

// Add new project
export const addProject = async (project: Partial<Project>): Promise<Project> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    const res = await api.post('/projects/add', project, {
      Authorization: `Bearer ${token}`,
    });

    return res;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to add project');
  }
};

// Update project
export const updateProject = async (id: string, updates: Partial<Project>): Promise<Project> => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.put(`/projects/update/${id}`, updates, {
      Authorization: `Bearer ${token}`,
    });
    return res;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update project');
  }
};

// Delete project
export const deleteProject = async (id: string): Promise<{ message: string }> => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.delete(`/projects/delete/${id}`, {
      Authorization: `Bearer ${token}`,
    });
    return res;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete project');
  }
};
