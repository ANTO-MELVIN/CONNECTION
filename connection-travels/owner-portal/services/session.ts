import { ownerLogin } from './api';

const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL ?? 'owner@connectiontravels.com';
const OWNER_PASSWORD = import.meta.env.VITE_OWNER_PASSWORD ?? 'Owner@123';

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
}

export async function ensureOwnerSession(credentials?: OwnerCredentials): Promise<OwnerSession> {
  const cachedToken = localStorage.getItem('ownerToken');
  const cachedUser = localStorage.getItem('ownerUser');
  if (cachedToken && cachedUser) {
    return { token: cachedToken, user: JSON.parse(cachedUser) };
  }

  const loginEmail = credentials?.email?.trim().toLowerCase() || OWNER_EMAIL;
  const loginPassword = credentials?.password || OWNER_PASSWORD;
  const mobile = credentials?.mobile;

  try {
    const result = await ownerLogin(loginEmail, loginPassword);
    const { accessToken, user } = result as { accessToken: string; user: any };
    return persistSession({ token: accessToken, user });
  } catch (error) {
    console.error('Owner authentication failed', error);
    localStorage.removeItem('ownerToken');
    localStorage.removeItem('ownerUser');
    localStorage.removeItem('ownerProfile');
    throw new Error('Unable to authenticate owner. Please check your credentials or try again later.');
  }
}
