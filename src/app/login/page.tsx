'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Wallet, Eye, EyeOff, Cpu, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthStore } from '@/stores/auth-store';
import { useWalletStore } from '@/stores/wallet-store';
import { useUIStore } from '@/stores/ui-store';

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithWallet, isLoading } = useAuthStore();
  const { connect, isConnecting, address } = useWalletStore();
  const { addToast } = useUIStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isWalletLogin, setIsWalletLogin] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      addToast({
        type: 'success',
        title: 'Welcome back!',
        message: 'You have been logged in successfully.',
      });
      router.push('/dashboard');
    } catch {
      addToast({
        type: 'error',
        title: 'Login failed',
        message: 'Invalid email or password.',
      });
    }
  };

  const handleWalletLogin = async () => {
    setIsWalletLogin(true);
    try {
      await connect();
      const walletAddress = useWalletStore.getState().address;
      if (walletAddress) {
        await loginWithWallet(walletAddress);
        addToast({
          type: 'success',
          title: 'Wallet connected!',
          message: 'You have been logged in with your wallet.',
        });
        router.push('/dashboard');
      }
    } catch {
      addToast({
        type: 'error',
        title: 'Connection failed',
        message: 'Failed to connect wallet. Please try again.',
      });
    }
    setIsWalletLogin(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-neon-blue/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-neon-purple/20 rounded-full blur-[150px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
            <Cpu className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">NeuralCloud</span>
        </Link>

        {/* Card */}
        <div className="glass rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome back</h1>
            <p className="text-foreground-muted">Sign in to access your dashboard</p>
          </div>

          {/* Wallet Login Button */}
          <Button
            variant="secondary"
            className="w-full mb-6"
            onClick={handleWalletLogin}
            isLoading={isWalletLogin || isConnecting}
            leftIcon={<Wallet className="w-5 h-5" />}
          >
            Login with Wallet
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-glass-border" />
            <span className="text-sm text-foreground-muted">or continue with email</span>
            <div className="flex-1 h-px bg-glass-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              type="email"
              label="Email"
              placeholder="you@example.com"
              leftIcon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
            />

            <Input
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
              error={errors.password?.message}
            />

            <div className="flex items-center justify-between">
              <Checkbox
                {...register('rememberMe')}
                label="Remember me"
              />
              <Link
                href="/forgot-password"
                className="text-sm text-neon-blue hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          {/* Register Link */}
          <p className="text-center text-foreground-muted mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-neon-blue hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}


