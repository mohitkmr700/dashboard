import { redirect } from 'next/navigation';
import { isAuthenticatedServer } from '@/lib/auth-server';

export default async function Home() {
  const authenticated = await isAuthenticatedServer();

  if (!authenticated) {
    redirect('/login');
  }

  redirect('/dashboard');
}
