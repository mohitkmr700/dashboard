import { cookies } from 'next/headers';
import LoginClient from './LoginClient';

export default async function LoginPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token');
  
  return <LoginClient initialAuthState={!!accessToken} />;
} 