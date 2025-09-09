import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { updateProfile } from "../utils/user";
import { useAuth } from "./auth-context"; // your auth context

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: authUser, isLoading: authLoading } = useAuth(); // get user from auth context
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep user in sync with AuthContext
  useEffect(() => {
    setUser(authUser);
    setIsLoading(authLoading);
  }, [authUser, authLoading]);

  const handleUpdateUser = async (data: Partial<User>) => {
    if (!user) {
      setError("No user logged in");
      return;
    }
    setIsLoading(true);
    try {
      const updatedUser = await updateProfile(data);
      setUser(updatedUser);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to update user");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoading, error, updateUserProfile: handleUpdateUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
