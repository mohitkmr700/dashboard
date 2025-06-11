import { redirect } from 'next/navigation';
import { isAuthenticatedServer } from '@/lib/auth-server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAuthenticatedServer();
  
  if (!authenticated) {
    redirect('/login');
  }

  return <>{children}</>;
} 