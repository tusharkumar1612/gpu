'use client';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'blue';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  default: 'bg-glass-bg text-foreground border-glass-border',
  success: 'bg-success/20 text-success border-success/30',
  warning: 'bg-warning/20 text-warning border-warning/30',
  error: 'bg-error/20 text-error border-error/30',
  info: 'bg-info/20 text-info border-info/30',
  purple: 'bg-neon-purple/20 text-neon-purple border-neon-purple/30',
  blue: 'bg-neon-blue/20 text-neon-blue border-neon-blue/30',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export function Badge({ variant = 'default', size = 'sm', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

