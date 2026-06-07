import { supabase } from './supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function getAuthHeaders(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ success: true; data: T } | { success: false; error: { code: string; message: string; details?: unknown } }> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers ?? {}) },
  });

  const json = await res.json();
  return json;
}

export const apiClient = {
  auth: {
    me: () => request<{ id: string; email: string; name: string | null; planTier: string }>('/auth/me'),
    logout: () => request<{ message: string }>('/auth/logout', { method: 'POST' }),
  },
  users: {
    getProfile: () =>
      request<{ id: string; email: string; name: string | null; planTier: string }>('/users/profile'),
    updateProfile: (body: { name?: string; email?: string }) =>
      request<{ id: string; email: string; name: string | null; planTier: string }>('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
  },
};
