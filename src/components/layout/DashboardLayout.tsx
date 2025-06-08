"use client";
import { ReactNode, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { getStorageItem, setStorageItem } from '@/lib/utils/storage';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Get theme preference from storage or use system preference
    const savedTheme = getStorageItem('theme', null, false);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Initialize theme based on saved preference or system preference
    const initialTheme = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(initialTheme);
    
    // Apply the theme class
    if (initialTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    // Update storage without JSON stringification
    setStorageItem('theme', newTheme ? 'dark' : 'light', false);
    
    // Toggle dark class
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="flex h-screen bg-white dark:bg-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-end px-8 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? '🌞' : '🌑'}
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-white dark:bg-black">
          {children}
        </main>
      </div>
    </div>
  );
} 