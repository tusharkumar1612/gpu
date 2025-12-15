'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  showValue?: boolean;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ label, showValue = true, unit = '', min = 0, max = 100, step = 1, value, className = '', ...props }, ref) => {
    const percentage = ((Number(value) - min) / (max - min)) * 100;

    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          {label && (
            <label className="text-sm font-medium text-foreground">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-mono text-neon-blue">
              {value}{unit}
            </span>
          )}
        </div>
        <div className="relative">
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            className={`
              w-full h-2 rounded-full appearance-none cursor-pointer
              bg-glass-border
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-neon-blue
              [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,212,255,0.5)]
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-moz-range-thumb]:w-5
              [&::-moz-range-thumb]:h-5
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-neon-blue
              [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:shadow-[0_0_10px_rgba(0,212,255,0.5)]
              [&::-moz-range-thumb]:cursor-pointer
              ${className}
            `}
            style={{
              background: `linear-gradient(to right, #00d4ff ${percentage}%, rgba(255,255,255,0.1) ${percentage}%)`,
            }}
            {...props}
          />
        </div>
      </div>
    );
  }
);

Slider.displayName = 'Slider';

