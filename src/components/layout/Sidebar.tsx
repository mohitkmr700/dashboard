"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: ROUTES.DASHBOARD },
  { name: 'Profile', href: ROUTES.PROFILE },
  { name: 'Settings', href: ROUTES.SETTINGS },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800">
      <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold text-black dark:text-white">Dashboard</h1>
      </div>
      <nav className="mt-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-6 py-4 text-base font-medium transition-colors rounded',
                isActive
                  ? 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
              )}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 