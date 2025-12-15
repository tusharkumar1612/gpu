'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Wifi,
  Wallet,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';

// Dynamically import WalletButton to avoid SSR issues with wagmi
const WalletButton = dynamic(
  () => import('@/components/web3/wallet-button').then(mod => ({ default: mod.WalletButton })),
  { 
    ssr: false,
    loading: () => (
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass animate-pulse">
        <Wallet className="w-4 h-4 text-foreground-muted" />
        <span className="text-sm text-foreground-muted">Loading...</span>
      </button>
    )
  }
);

const notifications = [
  { id: 1, title: 'Server deployed', message: 'GPU-01 is now running', time: '2m ago', unread: true },
  { id: 2, title: 'Payment received', message: '0.5 ETH added to balance', time: '1h ago', unread: true },
  { id: 3, title: 'Maintenance scheduled', message: 'US-East region update', time: '3h ago', unread: false },
];

export function Topbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { addToast, isSidebarOpen } = useUIStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = () => {
    logout();
    addToast({
      type: 'success',
      title: 'Logged out',
      message: 'You have been logged out successfully.',
    });
    router.push('/');
  };

  const sidebarWidth = isLargeScreen ? (isSidebarOpen ? 256 : 80) : 0;

  return (
    <header 
      className="fixed top-0 right-0 z-30 h-16 glass border-b border-glass-border transition-all duration-300"
      style={{ left: sidebarWidth }}
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left - Network Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-foreground-muted" />
            <span className="text-sm text-foreground-muted hidden sm:inline">
              NeuralCloud
            </span>
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Wallet Connect Button - Client only */}
          {mounted && <WalletButton />}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg glass hover:bg-glass-hover transition-colors"
            >
              <Bell className="w-5 h-5 text-foreground-muted" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-neon-blue" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-80 glass rounded-xl overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-glass-border">
                      <h3 className="font-semibold text-foreground">Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b border-glass-border hover:bg-glass-hover transition-colors cursor-pointer ${
                            notification.unread ? 'bg-neon-blue/5' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {notification.unread && (
                              <span className="w-2 h-2 rounded-full bg-neon-blue mt-1.5 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-foreground">{notification.title}</p>
                              <p className="text-sm text-foreground-muted truncate">{notification.message}</p>
                              <p className="text-xs text-foreground-muted mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3">
                      <button className="text-sm text-neon-blue hover:underline w-full text-center">
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-2 rounded-lg glass hover:bg-glass-hover transition-colors"
            >
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=default`}
                alt="Profile"
                className="w-8 h-8 rounded-full bg-glass-bg"
              />
              <ChevronDown className="w-4 h-4 text-foreground-muted hidden sm:block" />
            </button>

            <AnimatePresence>
              {showProfile && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfile(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-56 glass rounded-xl overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-glass-border">
                      <p className="font-semibold text-foreground">{user?.name || 'Guest User'}</p>
                      <p className="text-sm text-foreground-muted truncate">{user?.email || 'guest@example.com'}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setShowProfile(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-glass-hover transition-colors text-foreground-muted hover:text-foreground"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm">Profile</span>
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setShowProfile(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-glass-hover transition-colors text-foreground-muted hover:text-foreground"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-error/10 transition-colors text-foreground-muted hover:text-error w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
