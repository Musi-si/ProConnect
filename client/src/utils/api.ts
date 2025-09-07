export const API_BASE_URL = "http://localhost:5000/api";

export async function apiRequest(method: string, url: string, data?: any) {
  return fetch(`${API_BASE_URL}${url}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });
}