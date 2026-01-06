const PROD_API = 'https://connection-production-23a8.up.railway.app/api';

const API_URL = import.meta.env.VITE_API_URL ?? PROD_API;

export interface QuotePayload {
  busId: string;
  pickupLocation: string;
  dropLocations?: string[];
  startDate: string;
  endDate?: string;
  numberOfDays?: number;
  passengers: number;
  packages?: Array<string | { name: string; included: boolean }>;
  eventType?: string;
  specialInstructions?: string;
  notes?: string;
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

export function userLogin(email: string, password: string) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function fetchBuses() {
  return request('/buses');
}

export function requestQuote(payload: QuotePayload, token: string) {
  return request('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  });
}

export function fetchUserBookings(token: string) {
  return request('/bookings', { token });
}

export function fetchBookingById(bookingId: string, token: string) {
  return request(`/bookings/${bookingId}`, { token });
}
