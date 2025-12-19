'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string | React.ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', checked, ...props }, ref) => {
    return (
      <label className={`flex items-start gap-3 cursor-pointer ${className}`}>
        <div className="relative flex-shrink-0">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            className="sr-only peer"
            {...props}
          />
          <div className={`
            w-5 h-5 rounded-md border-2 transition-all duration-200
            ${checked 
              ? 'bg-neon-blue border-neon-blue' 
              : 'bg-transparent border-glass-border hover:border-neon-blue/50'
            }
          `}>
            {checked && (
              <Check className="w-full h-full text-white p-0.5" />
            )}
          </div>
        </div>
        {label && (
          <span className="text-sm text-foreground-muted leading-tight">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';


