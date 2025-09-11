// src/utils/freelancers.ts
import { api } from "./api";
import { User } from "../types";

// Fetch all freelancers
export const fetchFreelancers = async (): Promise<User[]> => {
  try {
    const res = await api.get("/users/freelancers"); 
    return res; // api.get already returns JSON
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch freelancers");
  }
};

// Fetch a single freelancer by ID
export const fetchFreelancerById = async (id: string): Promise<User> => {
  try {
    const res = await api.get(`/users/freelancers/${id}`);
    return res;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch freelancer");
  }
};
