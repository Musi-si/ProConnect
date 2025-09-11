// src/context/freelancer-context.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { fetchFreelancers } from "../utils/freelancers"; // create this util

type FreelancerContextType = {
  freelancers: User[];
  isLoading: boolean;
  error: string | null;
};

const FreelancerContext = createContext<FreelancerContextType | null>(null);

export const useFreelancers = () => {
  const context = useContext(FreelancerContext);
  if (!context) throw new Error("useFreelancers must be used within FreelancerProvider");
  return context;
};

export const FreelancerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [freelancers, setFreelancers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFreelancers = async () => {
      setIsLoading(true);
      try {
        const data = await fetchFreelancers();
        setFreelancers(data);
      } catch (err: any) {
        setError(err.message || "Failed to load freelancers");
      } finally {
        setIsLoading(false);
      }
    };

    loadFreelancers();
  }, []);

  return (
    <FreelancerContext.Provider value={{ freelancers, isLoading, error }}>
      {children}
    </FreelancerContext.Provider>
  );
};
