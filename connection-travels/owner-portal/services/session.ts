import { ownerLogin } from './api';

const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL ?? 'owner@connectiontravels.com';
const OWNER_PASSWORD = import.meta.env.VITE_OWNER_PASSWORD ?? 'Owner@123';

interface OwnerSession {
  token: string;
  user: any;
}

export async function ensureOwnerSession(): Promise<OwnerSession> {
  const cachedToken = localStorage.getItem('ownerToken');
  const cachedUser = localStorage.getItem('ownerUser');
  if (cachedToken && cachedUser) {
    return { token: cachedToken, user: JSON.parse(cachedUser) };
  }

  const result = await ownerLogin(OWNER_EMAIL, OWNER_PASSWORD);
  const { accessToken, user } = result as { accessToken: string; user: any };
  localStorage.setItem('ownerToken', accessToken);
  localStorage.setItem('ownerUser', JSON.stringify(user));
  if (user?.ownerProfile) {
    localStorage.setItem('ownerProfile', JSON.stringify(user.ownerProfile));
  }
  return { token: accessToken, user };
}
