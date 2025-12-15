'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  User,
  Mail,
  Bell,
  Shield,
  LogOut,
  Save,
  Key,
  Smartphone,
  Globe,
  Moon,
  Sun,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { useAuthStore } from '@/stores/auth-store';
import { useWalletStore } from '@/stores/wallet-store';
import { useUIStore } from '@/stores/ui-store';

interface ProfileForm {
  name: string;
  email: string;
}

interface SecurityForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { disconnect } = useWalletStore();
  const { addToast } = useUIStore();
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    serverAlerts: true,
    billingAlerts: true,
    marketingEmails: false,
    weeklyReport: true,
  });

  const profileForm = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const securityForm = useForm<SecurityForm>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleProfileSave = async (data: ProfileForm) => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile has been updated successfully.',
    });
  };

  const handlePasswordChange = async (data: SecurityForm) => {
    if (data.newPassword !== data.confirmPassword) {
      addToast({
        type: 'error',
        title: 'Password Mismatch',
        message: 'New passwords do not match.',
      });
      return;
    }

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    securityForm.reset();
    addToast({
      type: 'success',
      title: 'Password Changed',
      message: 'Your password has been updated successfully.',
    });
  };

  const handleLogoutAll = () => {
    logout();
    disconnect();
    addToast({
      type: 'success',
      title: 'Logged Out',
      message: 'You have been logged out from all sessions.',
    });
    router.push('/');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-foreground-muted">Manage your account settings and preferences</p>
      </div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card padding="lg">
          <div className="flex items-center gap-4 mb-6">
            <User className="w-5 h-5 text-neon-blue" />
            <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
          </div>

          <form onSubmit={profileForm.handleSubmit(handleProfileSave)} className="space-y-4">
            <div className="flex items-center gap-6 mb-6">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=default`}
                alt="Profile"
                className="w-20 h-20 rounded-full bg-glass-bg"
              />
              <div>
                <Button variant="secondary" size="sm">
                  Change Avatar
                </Button>
                <p className="text-sm text-foreground-muted mt-2">
                  JPG, PNG or GIF. Max 2MB.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                {...profileForm.register('name', { required: true })}
                label="Full Name"
                placeholder="John Doe"
                leftIcon={<User className="w-5 h-5" />}
              />
              <Input
                {...profileForm.register('email', { required: true })}
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                leftIcon={<Mail className="w-5 h-5" />}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card padding="lg">
          <div className="flex items-center gap-4 mb-6">
            <Bell className="w-5 h-5 text-neon-purple" />
            <h2 className="text-lg font-semibold text-foreground">Email Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">Server Alerts</p>
                <p className="text-sm text-foreground-muted">Get notified about server status changes</p>
              </div>
              <Checkbox
                checked={notifications.serverAlerts}
                onChange={(e) => setNotifications({ ...notifications, serverAlerts: e.target.checked })}
              />
            </div>
            
            <div className="flex items-center justify-between py-2 border-t border-glass-border">
              <div>
                <p className="font-medium text-foreground">Billing Alerts</p>
                <p className="text-sm text-foreground-muted">Receive payment and invoice notifications</p>
              </div>
              <Checkbox
                checked={notifications.billingAlerts}
                onChange={(e) => setNotifications({ ...notifications, billingAlerts: e.target.checked })}
              />
            </div>
            
            <div className="flex items-center justify-between py-2 border-t border-glass-border">
              <div>
                <p className="font-medium text-foreground">Weekly Report</p>
                <p className="text-sm text-foreground-muted">Get a weekly summary of your usage</p>
              </div>
              <Checkbox
                checked={notifications.weeklyReport}
                onChange={(e) => setNotifications({ ...notifications, weeklyReport: e.target.checked })}
              />
            </div>
            
            <div className="flex items-center justify-between py-2 border-t border-glass-border">
              <div>
                <p className="font-medium text-foreground">Marketing Emails</p>
                <p className="text-sm text-foreground-muted">Receive product updates and offers</p>
              </div>
              <Checkbox
                checked={notifications.marketingEmails}
                onChange={(e) => setNotifications({ ...notifications, marketingEmails: e.target.checked })}
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card padding="lg">
          <div className="flex items-center gap-4 mb-6">
            <Shield className="w-5 h-5 text-neon-green" />
            <h2 className="text-lg font-semibold text-foreground">Security</h2>
          </div>

          <form onSubmit={securityForm.handleSubmit(handlePasswordChange)} className="space-y-4">
            <Input
              {...securityForm.register('currentPassword')}
              type="password"
              label="Current Password"
              placeholder="••••••••"
              leftIcon={<Key className="w-5 h-5" />}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                {...securityForm.register('newPassword')}
                type="password"
                label="New Password"
                placeholder="••••••••"
                leftIcon={<Key className="w-5 h-5" />}
              />
              <Input
                {...securityForm.register('confirmPassword')}
                type="password"
                label="Confirm New Password"
                placeholder="••••••••"
                leftIcon={<Key className="w-5 h-5" />}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="secondary" isLoading={isSaving}>
                Change Password
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-glass-border">
            <h3 className="font-semibold text-foreground mb-4">Two-Factor Authentication</h3>
            <div className="flex items-center justify-between glass rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-foreground-muted" />
                <div>
                  <p className="font-medium text-foreground">Authenticator App</p>
                  <p className="text-sm text-foreground-muted">Add an extra layer of security</p>
                </div>
              </div>
              <Badge variant="warning">Not Enabled</Badge>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Preferences Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card padding="lg">
          <div className="flex items-center gap-4 mb-6">
            <Globe className="w-5 h-5 text-neon-orange" />
            <h2 className="text-lg font-semibold text-foreground">Preferences</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-foreground-muted" />
                <div>
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-sm text-foreground-muted">Use dark theme across the app</p>
                </div>
              </div>
              <Badge variant="success">Enabled</Badge>
            </div>
            
            <div className="flex items-center justify-between py-2 border-t border-glass-border">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-foreground-muted" />
                <div>
                  <p className="font-medium text-foreground">Language</p>
                  <p className="text-sm text-foreground-muted">Select your preferred language</p>
                </div>
              </div>
              <Badge variant="blue">English</Badge>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card padding="lg" className="border-error/30">
          <div className="flex items-center gap-4 mb-6">
            <LogOut className="w-5 h-5 text-error" />
            <h2 className="text-lg font-semibold text-error">Danger Zone</h2>
          </div>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-error/10 hover:bg-error/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-error" />
              <div className="text-left">
                <p className="font-medium text-error">Logout from All Sessions</p>
                <p className="text-sm text-foreground-muted">Sign out from all devices and sessions</p>
              </div>
            </div>
          </button>
        </Card>
      </motion.div>

      {/* Logout Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Logout from All Sessions"
      >
        <div className="space-y-4">
          <p className="text-foreground-muted">
            Are you sure you want to logout from all sessions? You will need to sign in again on all devices.
          </p>
          <div className="flex gap-4">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleLogoutAll}
            >
              Logout All
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

