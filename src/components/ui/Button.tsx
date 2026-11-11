import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'soft' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer rounded-full';

    const variants = {
      primary:
        'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white hover:from-[#EA580C] hover:to-[#C2410C] shadow-sm shadow-[#EA580C]/20 focus-visible:ring-[#EA580C]',
      secondary: 'bg-[#292524] text-white hover:bg-[#1C1917] focus-visible:ring-[#292524]',
      outline:
        'border border-[#E7D7C8] bg-white text-[#292524] hover:bg-[#FDF9F5] hover:border-[#D5C0AD] focus-visible:ring-[#EA580C]',
      ghost: 'text-[#78716C] hover:text-[#292524] hover:bg-[#FFEDD5]/60 focus-visible:ring-[#EA580C]',
      soft: 'bg-[#FFEDD5] text-[#C2410C] hover:bg-[#FED7AA] font-semibold focus-visible:ring-[#EA580C]',
      danger: 'bg-[#DC2626] text-white hover:bg-[#B91C1C] focus-visible:ring-[#DC2626]',
      success: 'bg-[#16A36A] text-white hover:bg-[#118153] focus-visible:ring-[#16A36A]',
    };

    const sizes = {
      sm: 'h-8 px-3.5 text-xs gap-1.5',
      md: 'h-9 px-4.5 text-sm gap-2',
      lg: 'h-11 px-6 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="inline-flex">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
