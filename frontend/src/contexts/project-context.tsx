import React, { createContext, useContext, useState, useEffect } from 'react'
import { getProjects, addProject, updateProject, deleteProject } from '../utils/projects'
import { Project } from '../types'

type ProjectContextType = {
  projects: Project[]
  isLoading: boolean
  error: string | null
  addProject: (project: Omit<Project, '_id'>) => Promise<void>
  updateProject: (id: string, project: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
}

const ProjectContext = createContext<ProjectContextType | null>(null)

export const useProject = () => {
  const context = useContext(ProjectContext)
  if (!context) throw new Error('useProject must be used within ProjectProvider')
  return context
}

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true)
      try {
        const data = await getProjects()
        setProjects(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch projects')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const handleAddProject = async (project: Omit<Project, '_id'>) => {
    setIsLoading(true)
    try {
      const data = await addProject(project)
      setProjects(prev => [...prev, data])
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to add project')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProject = async (id: string, project: Partial<Project>) => {
    setIsLoading(true)
    try {
      const data = await updateProject(id, project)
      setProjects(prev => prev.map(p => p._id === id ? data : p))
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to update project')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProject = async (id: string) => {
    setIsLoading(true)
    try {
      await deleteProject(id)
      setProjects(prev => prev.filter(p => p._id !== id))
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to delete project')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProjectContext.Provider value={{ projects, isLoading, error, addProject: handleAddProject, updateProject: handleUpdateProject, deleteProject: handleDeleteProject }}>
      {children}
    </ProjectContext.Provider>
  )
}
