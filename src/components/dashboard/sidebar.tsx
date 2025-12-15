'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Server,
  PlusCircle,
  CreditCard,
  Wallet,
  Settings,
  LogOut,
  Cpu,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Server, label: 'My Servers', href: '/dashboard/servers' },
  { icon: PlusCircle, label: 'Create Server', href: '/dashboard/create-server' },
  { icon: CreditCard, label: 'Billing', href: '/dashboard/billing' },
  { icon: Wallet, label: 'Wallet', href: '/dashboard/wallet' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const { logout } = useAuthStore();
  const { addToast } = useUIStore();

  const handleLogout = () => {
    logout();
    addToast({
      type: 'success',
      title: 'Logged out',
      message: 'You have been logged out successfully.',
    });
    router.push('/');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 256 : 80 }}
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 glass border-r border-glass-border"
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-glass-border">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center flex-shrink-0">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-xl font-bold gradient-text whitespace-nowrap overflow-hidden"
                >
                  NeuralCloud
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-glass-hover transition-colors"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="w-5 h-5 text-foreground-muted" />
            ) : (
              <ChevronRight className="w-5 h-5 text-foreground-muted" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-neon-blue/20 text-neon-blue' 
                    : 'text-foreground-muted hover:text-foreground hover:bg-glass-hover'
                  }
                `}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-glass-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground-muted hover:text-error hover:bg-error/10 transition-all duration-200 w-full"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-glass-border">
        <div className="flex items-center justify-around py-2">
          {menuItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center gap-1 p-2 rounded-lg
                  ${isActive ? 'text-neon-blue' : 'text-foreground-muted'}
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

