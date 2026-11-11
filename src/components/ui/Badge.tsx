import React, { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'outline'
    | 'navy'
    | 'orange'
    | 'terracotta'
    | 'pill-orange'
    | 'pill-gray'
    | 'pill-blue';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-[#F5EBE1] text-[#78716C] border-transparent',
    navy: 'bg-[#292524] text-white border-transparent',
    orange: 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white border-transparent',
    terracotta: 'bg-[#EA580C] text-white border-transparent',
    info: 'bg-[#FFEDD5] text-[#C2410C] border-[#FDBA74]',
    success: 'bg-[#EBF7F0] text-[#16A36A] border-[#B7EBCA]',
    warning: 'bg-[#FEF9E7] text-[#B45309] border-[#FDE68A]',
    danger: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
    outline: 'bg-transparent text-[#78716C] border-[#E7D7C8]',
    'pill-orange': 'bg-[#FFEDD5] text-[#C2410C] font-semibold border-transparent',
    'pill-gray': 'bg-[#F5EBE1] text-[#78716C] font-medium border-transparent',
    'pill-blue': 'bg-[#E0F2FE] text-[#0369A1] font-semibold border-transparent',
  };

  const sizes = {
    sm: 'text-[11px] px-2.5 py-0.5 font-medium rounded-full',
    md: 'text-xs px-3 py-1 font-medium rounded-full',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 border font-medium whitespace-nowrap transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
