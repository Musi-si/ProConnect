import React, { createContext, useContext, useState } from 'react'
import { User } from '../types'
import { updateUser } from '../utils/user'

type UserContextType = {
  user: User | null
  isLoading: boolean
  error: string | null
  updateUserProfile: (data: Partial<User>) => Promise<void>
}

const UserContext = createContext<UserContextType | null>(null)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within UserProvider')
  return context
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpdateUser = async (data: Partial<User>) => {
    setIsLoading(true)
    try {
      const updatedUser = await updateUser(user!._id, data)
      setUser(updatedUser)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to update user')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <UserContext.Provider value={{ user, isLoading, error, updateUserProfile: handleUpdateUser }}>
      {children}
    </UserContext.Provider>
  )
}
