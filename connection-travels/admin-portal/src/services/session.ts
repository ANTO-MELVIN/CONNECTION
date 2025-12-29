import { adminLogin } from './api';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? 'admin@connectiontravels.com';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'Admin@123';

interface AdminSession {
  token: string;
  user: any;
}

export async function ensureAdminSession(): Promise<AdminSession> {
  const cachedToken = localStorage.getItem('adminToken');
  const cachedUser = localStorage.getItem('adminUser');
  if (cachedToken && cachedUser) {
    return { token: cachedToken, user: JSON.parse(cachedUser) };
  }

  const result = await adminLogin(ADMIN_EMAIL, ADMIN_PASSWORD);
  const { accessToken, user } = result;
  localStorage.setItem('adminToken', accessToken);
  localStorage.setItem('adminUser', JSON.stringify(user));
  return { token: accessToken, user };
}
