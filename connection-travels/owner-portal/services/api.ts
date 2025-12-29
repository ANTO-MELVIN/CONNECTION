const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

type RequestOptions = RequestInit & { token?: string };

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers,
    },
    credentials: 'include',
    body: options.body,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }

  return response.json() as Promise<T>;
}

export function ownerLogin(email: string, password: string) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function registerOwner(payload: Record<string, unknown>) {
  return request('/auth/register/owner', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchOwnerBuses(ownerId: string, token: string) {
  return request(`/owners/${ownerId}/buses`, { token });
}

export function createOwnerBus(ownerId: string, payload: unknown, token: string) {
  return request(`/owners/${ownerId}/buses`, {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  });
}

export function updateOwnerBus(ownerId: string, busId: string, payload: unknown, token: string) {
  return request(`/owners/${ownerId}/buses/${busId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    token,
  });
}

export function upsertSchedule(ownerId: string, busId: string, payload: unknown, token: string) {
  return request(`/owners/${ownerId}/buses/${busId}/schedules`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    token,
  });
}

export function fetchOwnerBookings(ownerId: string, token: string) {
  return request(`/owners/${ownerId}/bookings`, { token });
}
