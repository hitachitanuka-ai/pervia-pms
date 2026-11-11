import React, { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  pill?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, pill = false, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-[#0F172A] tracking-normal"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#94A3B8]">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs text-[#172B4D] placeholder:text-[#94A3B8]',
              pill ? 'rounded-full px-4' : 'rounded-xl',
              'focus:border-[#315E91] focus:outline-none focus:ring-3 focus:ring-[#EAF1F8] transition-all',
              'disabled:bg-[#F8FAFC] disabled:cursor-not-allowed',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-[#DC4545] focus:border-[#DC4545] focus:ring-[#FDF2F2]',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-[#94A3B8]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-[#EF4444] font-medium">{error}</p>}
        {!error && helperText && <p className="text-xs text-[#64748B]">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
