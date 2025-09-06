import { apiRequest } from "./queryClient";
import type { LoginData, RegisterData, User } from "@shared/schema";

export const authApi = {
  login: async (data: LoginData) => {
    const response = await apiRequest("POST", "/api/auth/login", data);
    return response.json();
  },

  register: async (data: RegisterData) => {
    const response = await apiRequest("POST", "/api/auth/register", data);
    return response.json();
  },

  verifyEmail: async (token: string) => {
    const response = await apiRequest("POST", "/api/auth/verify-email", { token });
    return response.json();
  },

  getCurrentUser: async () => {
    const response = await apiRequest("GET", "/api/auth/me");
    return response.json();
  },

  logout: () => {
    localStorage.removeItem("auth_token");
  }
};

export const getAuthToken = () => localStorage.getItem("auth_token");
export const setAuthToken = (token: string) => localStorage.setItem("auth_token", token);
export const removeAuthToken = () => localStorage.removeItem("auth_token");
