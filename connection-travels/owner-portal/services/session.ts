import { ownerLogin } from './api';

const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL ?? 'owner@connectiontravels.com';
const OWNER_PASSWORD = import.meta.env.VITE_OWNER_PASSWORD ?? 'Owner@123';

const DUMMY_TOKEN = 'dummy-owner-token';

function createDummyUser(email?: string, mobile?: string) {
  const safeEmail = email?.trim().toLowerCase() || 'owner-demo@connectiontravels.com';
  const safeMobile = mobile?.trim() || '9487868172';
  return {
    id: 'dummy-owner',
    email: safeEmail,
    firstName: 'Demo',
    lastName: 'Owner',
    role: 'OWNER',
    phone: safeMobile,
    ownerProfile: {
      id: 'dummy-owner-profile',
      userId: 'dummy-owner',
      companyName: 'Demo Travels',
      city: 'Bengaluru',
      verifiedByAdmin: true,
    },
  };
}

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
    const dummySession = { token: DUMMY_TOKEN, user: createDummyUser(loginEmail, mobile) };
    return persistSession(dummySession);
  }
}
