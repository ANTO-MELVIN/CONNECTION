const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

interface BookingPayload {
  scheduleId: string;
  seatsRequested: number;
}

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

export function userLogin(email: string, password: string) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function fetchBuses() {
  return request('/buses');
}

export function fetchBusSchedules(busId: string) {
  return request(`/buses/${busId}/schedules`);
}

export function createBooking(payload: BookingPayload, token: string) {
  return request('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  });
}

export function fetchUserBookings(token: string) {
  return request('/bookings', { token });
}
