const PROD_API = 'https://connection-production-23a8.up.railway.app/api';

const API_URL = import.meta.env.VITE_API_URL ?? PROD_API;

type RequestOptions = RequestInit & { token?: string };

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      method: options.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        ...options.headers,
      },
      credentials: 'include',
      body: options.body,
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Unable to connect to the owner API. Please ensure the backend server is running.');
    }
    throw error;
  }

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

export function updateExpectedPrice(ownerId: string, busId: string, payload: { expectedPrice: number | string; note?: string | null }, token: string) {
  return request(`/owners/${ownerId}/buses/${busId}/price`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    token,
  });
}

export function fetchOwnerBookings(ownerId: string, token: string) {
  return request(`/owners/${ownerId}/bookings`, { token });
}
