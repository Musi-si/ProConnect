export const API_BASE_URL = "http://localhost:5000/api";

function buildQuery(params?: Record<string, any>): string {
  if (!params) return "";
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => query.append(key, String(v)));
    } else if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });
  return `?${query.toString()}`;
}

async function request(
  method: string,
  url: string,
  data?: any,
  headers?: Record<string, string>
) {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: data && method !== "GET" ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: (url: string, params?: Record<string, any>, headers?: Record<string, string>) =>
    request("GET", `${url}${buildQuery(params)}`, undefined, headers),
  post: (url: string, data?: any, headers?: Record<string, string>) =>
    request("POST", url, data, headers),
  put: (url: string, data?: any, headers?: Record<string, string>) =>
    request("PUT", url, data, headers),
  delete: (url: string, headers?: Record<string, string>) =>
    request("DELETE", url, undefined, headers),
};
