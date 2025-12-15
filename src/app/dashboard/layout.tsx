'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Topbar } from '@/components/dashboard/topbar';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { isSidebarOpen } = useUIStore();
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // For demo purposes, we allow access without login
  // In production, you'd redirect to login if not authenticated

  const sidebarWidth = isLargeScreen ? (isSidebarOpen ? 256 : 80) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Topbar />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-16 pb-20 lg:pb-0 transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <div className="p-4 lg:p-6 min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
