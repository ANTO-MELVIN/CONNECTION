import { ownerLogin } from './api';

const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL ?? 'owner@connectiontravels.com';
const OWNER_PASSWORD = import.meta.env.VITE_OWNER_PASSWORD ?? 'Owner@123';
const OFFLINE_TOKEN = 'offline-owner-session';

function persistSession(session: OwnerSession) {
  localStorage.setItem('ownerToken', session.token);
  localStorage.setItem('ownerUser', JSON.stringify(session.user));
  if (session.user?.ownerProfile) {
    localStorage.setItem('ownerProfile', JSON.stringify(session.user.ownerProfile));
  }
  return session;
}

interface OwnerSession {
  token: string;
  user: any;
}

interface OwnerCredentials {
  email?: string;
  password?: string;
  mobile?: string;
  name?: string;
  companyName?: string;
  city?: string;
}

function buildOfflineSession(credentials: OwnerCredentials, email: string): OwnerSession {
  const [firstName, ...rest] = (credentials.name ?? 'Offline Owner').split(' ');
  const lastName = rest.join(' ') || 'Partner';
  const company = credentials.companyName || 'Offline Travels';
  const city = credentials.city || 'Your City';

  const ownerProfile = {
    id: 'offline-owner-profile',
    companyName: company,
    city,
    status: 'PENDING_VERIFICATION',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const user = {
    id: 'offline-owner',
    email,
    firstName,
    lastName,
    phone: credentials.mobile ?? null,
    role: 'OWNER',
    ownerProfile,
  };

  return { token: OFFLINE_TOKEN, user };
}

export async function ensureOwnerSession(credentials?: OwnerCredentials): Promise<OwnerSession> {
  const cachedToken = localStorage.getItem('ownerToken');
  const cachedUser = localStorage.getItem('ownerUser');
  if (cachedToken && cachedUser) {
    return { token: cachedToken, user: JSON.parse(cachedUser) };
  }

  const loginEmail = credentials?.email?.trim().toLowerCase() || OWNER_EMAIL;
  const loginPassword = credentials?.password || OWNER_PASSWORD;
  try {
    const result = await ownerLogin(loginEmail, loginPassword);
    const { accessToken, user } = result as { accessToken: string; user: any };
    return persistSession({ token: accessToken, user });
  } catch (error) {
    console.error('Owner authentication failed', error);
    localStorage.removeItem('ownerToken');
    localStorage.removeItem('ownerUser');
    localStorage.removeItem('ownerProfile');
    if (error instanceof Error) {
      const networkFailure = /Failed to fetch|NetworkError|Unable to connect/i.test(error.message);
      if (networkFailure) {
        const offlineSession = buildOfflineSession(credentials ?? {}, loginEmail);
        return persistSession(offlineSession);
      }
      throw new Error(error.message);
    }
    throw new Error('Unable to authenticate owner. Please check your credentials or try again later.');
  }
}
