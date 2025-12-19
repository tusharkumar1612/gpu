'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Wallet, Eye, EyeOff, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthStore } from '@/stores/auth-store';
import { useWalletStore } from '@/stores/wallet-store';
import { useUIStore } from '@/stores/ui-store';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, loginWithWallet, isLoading } = useAuthStore();
  const { connect, isConnecting } = useWalletStore();
  const { addToast } = useUIStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isWalletRegister, setIsWalletRegister] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    if (!data.acceptTerms) {
      addToast({
        type: 'error',
        title: 'Terms required',
        message: 'Please accept the terms and conditions.',
      });
      return;
    }

    try {
      await registerUser(data.name, data.email, data.password);
      addToast({
        type: 'success',
        title: 'Account created!',
        message: 'Welcome to NeuralCloud.',
      });
      router.push('/dashboard');
    } catch {
      addToast({
        type: 'error',
        title: 'Registration failed',
        message: 'Something went wrong. Please try again.',
      });
    }
  };

  const handleWalletRegister = async () => {
    setIsWalletRegister(true);
    try {
      await connect();
      const walletAddress = useWalletStore.getState().address;
      if (walletAddress) {
        await loginWithWallet(walletAddress);
        addToast({
          type: 'success',
          title: 'Wallet connected!',
          message: 'Your account has been created with your wallet.',
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
    setIsWalletRegister(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-neon-purple/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon-blue/20 rounded-full blur-[150px]" />

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
            <h1 className="text-2xl font-bold text-foreground mb-2">Create an account</h1>
            <p className="text-foreground-muted">Start deploying decentralized servers</p>
          </div>

          {/* Wallet Register Button */}
          <Button
            variant="secondary"
            className="w-full mb-6"
            onClick={handleWalletRegister}
            isLoading={isWalletRegister || isConnecting}
            leftIcon={<Wallet className="w-5 h-5" />}
          >
            Register with Wallet
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
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
              type="text"
              label="Full Name"
              placeholder="John Doe"
              leftIcon={<User className="w-5 h-5" />}
              error={errors.name?.message}
            />

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
                  value: 8,
                  message: 'Password must be at least 8 characters',
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

            <Input
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm Password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
              error={errors.confirmPassword?.message}
            />

            <Checkbox
              {...register('acceptTerms')}
              label={
                <span>
                  I agree to the{' '}
                  <Link href="#terms" className="text-neon-blue hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#privacy" className="text-neon-blue hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              }
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-foreground-muted mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-neon-blue hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}


