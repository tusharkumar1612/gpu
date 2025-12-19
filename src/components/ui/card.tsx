'use client';

import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'interactive' | 'bordered' | 'glow';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles = {
  default: 'glass',
  interactive: 'glass glass-hover cursor-pointer',
  bordered: 'glass border-2 border-neon-blue/30',
  glow: 'glass glow-blue',
};

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  variant = 'default',
  padding = 'md',
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        rounded-2xl
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <h3 className={`text-xl font-semibold text-foreground ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <p className={`text-sm text-foreground-muted mt-1 ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function CardFooter({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`mt-4 pt-4 border-t border-glass-border ${className}`}>
      {children}
    </div>
  );
}


