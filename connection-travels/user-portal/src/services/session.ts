import { userLogin } from './api';

const USER_EMAIL = import.meta.env.VITE_USER_EMAIL ?? 'user@connectiontravels.com';
const USER_PASSWORD = import.meta.env.VITE_USER_PASSWORD ?? 'User@123';

interface UserSession {
  token: string;
  user: any;
}

export async function ensureUserSession(): Promise<UserSession> {
  const cachedToken = localStorage.getItem('userToken');
  const cachedUser = localStorage.getItem('userAccount');
  if (cachedToken && cachedUser) {
    return { token: cachedToken, user: JSON.parse(cachedUser) };
  }

  const result = await userLogin(USER_EMAIL, USER_PASSWORD);
  const { accessToken, user } = result as { accessToken: string; user: any };
  localStorage.setItem('userToken', accessToken);
  localStorage.setItem('userAccount', JSON.stringify(user));
  return { token: accessToken, user };
}
