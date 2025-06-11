import { redirect } from 'next/navigation';
import { isAuthenticatedServer, hasRoleServer } from '@/lib/auth-server';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardContent from './DashboardContent';

export default async function DashboardPage() {
  const isAuth = await isAuthenticatedServer();
  
  if (!isAuth) {
    console.log('Not authenticated, redirecting to login...');
    redirect('/login');
  }

  // Check if user has punisher role
  const isPunisher = await hasRoleServer('punisher');
  console.log('Is punisher:', isPunisher);

  if (!isPunisher) {
    console.log('Not a punisher, redirecting to unauthorized...');
    redirect('/unauthorized');
  }

  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
} 