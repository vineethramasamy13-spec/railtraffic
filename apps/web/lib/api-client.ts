import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

// ============================================================
// API CLIENT — Real-Time Data Abstraction Layer
// Connects to NestJS backend (provider adapter pattern).
// In demo mode, backend uses DemoDataAdapter (historical replay).
// In production, configure NTESAdapter or CRISAdapter.
// ============================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const AI_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';

// ─── Token Storage ─────────────────────────────────────────

let accessToken: string | null = null;
let refreshToken: string | null = null;
let isRefreshing = false;
let failedQueue: Array<{ resolve: (val: string) => void; reject: (err: unknown) => void }> = [];

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  if (typeof window !== 'undefined') {
    localStorage.setItem('rail_access_token', access);
    localStorage.setItem('rail_refresh_token', refresh);
  }
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('rail_access_token');
    localStorage.removeItem('rail_refresh_token');
  }
}

export function loadTokensFromStorage() {
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('rail_access_token');
    refreshToken = localStorage.getItem('rail_refresh_token');
  }
}

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
}

// ─── Main API Client ────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${token}`,
          };
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
          refreshToken,
        });
        const { accessToken: newAccess, refreshToken: newRefresh } = response.data.data;
        setTokens(newAccess, newRefresh);
        processQueue(null, newAccess);
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccess}`,
        };
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Transform to typed AppError
    const appError = {
      message: (error.response?.data as { message?: string })?.message || error.message,
      status: error.response?.status || 500,
      code: (error.response?.data as { code?: string })?.code || 'UNKNOWN_ERROR',
    };
    return Promise.reject(appError);
  },
);

// ─── AI Service Client ──────────────────────────────────────

export const aiClient: AxiosInstance = axios.create({
  baseURL: `${AI_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

aiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ─── Streaming helper ───────────────────────────────────────

export async function* streamChat(
  messages: Array<{ role: string; content: string }>,
  pageContext: Record<string, unknown>,
  sessionId: string,
): AsyncGenerator<string> {
  const response = await fetch(`${AI_URL}/api/v1/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ messages, page_context: pageContext, session_id: sessionId, stream: true }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`AI service error: ${response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter((line) => line.startsWith('data: '));
      for (const line of lines) {
        const data = line.replace('data: ', '').trim();
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data);
          if (parsed.content) yield parsed.content;
        } catch {
          // Skip malformed chunks
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export default apiClient;
