import { API_BASE_URL } from "@/utils/api";
import { LoginData, RegisterData } from "@shared/schema";

export const authApi = {
  login: async (data: LoginData) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json(); // { user, token }
  },

  register: async (data: RegisterData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json(); // { user, token }
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return null;
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return res.json(); // { user }
  },

  verifyEmail: async (token: String) => {
    const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  getAuthToken: async() => {
    return localStorage.getItem("auth_token");
  },

  setAuthToken: async(token: string) => {
    localStorage.setItem("auth_token", token);
  },

  removeAuthToken: async() => {
    localStorage.removeItem("auth_token");
  },

  logout: () => {
    localStorage.removeItem("auth_token");
  }
};
