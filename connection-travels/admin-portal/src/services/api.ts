import type { AppUser, DashboardSummary, OwnerProfile, AdminPendingBus } from '../types';

const PROD_API = 'https://connection-production-23a8.up.railway.app/api';

const API_URL = import.meta.env.VITE_API_URL ?? PROD_API;

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const raw = await response.text();
    try {
      const parsed = raw ? JSON.parse(raw) : {};
      const message = typeof parsed === 'string' ? parsed : parsed.message;
      throw new Error(message || 'Request failed');
    } catch (parseError) {
      if (parseError instanceof SyntaxError) {
        throw new Error(raw || 'Request failed');
      }
      throw parseError;
    }
  }

  return response.json() as Promise<T>;
}

export async function adminLogin(email: string, password: string) {
  return request<{ accessToken: string; refreshToken: string; user: AppUser & { ownerProfile?: OwnerProfile | null } }>(`${API_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchDashboardSummary(token: string) {
  return request<DashboardSummary>(`${API_URL}/admin/summary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function approveOwner(ownerId: string, token: string) {
  return request<OwnerProfile>(`${API_URL}/admin/owners/${ownerId}/approve`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function fetchPendingBuses(token: string) {
  return request<AdminPendingBus[]>(`${API_URL}/admin/buses/pending`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function approveBus(busId: string, token: string, note?: string) {
  return request<AdminPendingBus>(`${API_URL}/admin/buses/${busId}/approve`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(note ? { note } : {}),
  });
}

export async function rejectBus(busId: string, token: string, note?: string) {
  return request<AdminPendingBus>(`${API_URL}/admin/buses/${busId}/reject`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(note ? { note } : {}),
  });
}
