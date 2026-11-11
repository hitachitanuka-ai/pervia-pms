import React from 'react';

interface PerviaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showText?: boolean;
  textColor?: string;
  variant?: 'primary' | 'white' | 'dark';
  compact?: boolean;
  subtitle?: string;
}

export const PerviaLogo: React.FC<PerviaLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textColor = 'text-[#292524]',
  variant = 'primary',
  compact = false,
  subtitle,
}) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7', icon: 'w-4 h-4', text: 'text-sm', sub: 'text-[7px]' },
    md: { box: 'w-9 h-9 sm:w-10 sm:h-10', icon: 'w-5 h-5 sm:w-6 sm:h-6', text: 'text-base sm:text-lg', sub: 'text-[8px] sm:text-[9px]' },
    lg: { box: 'w-12 h-12', icon: 'w-7 h-7', text: 'text-xl', sub: 'text-[9px]' },
    xl: { box: 'w-16 h-16', icon: 'w-9 h-9', text: 'text-2xl', sub: 'text-[10px]' },
    hero: { box: 'w-24 h-24 sm:w-28 sm:h-28', icon: 'w-14 h-14 sm:w-16 sm:h-16', text: 'text-3xl sm:text-4xl', sub: 'text-xs' },
  };

  const dim = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {/* Pervia Icon: Fluid golden-orange 'P' enveloping ascending chart bars */}
      <div
        className={`${dim.box} rounded-2xl bg-gradient-to-br from-[#FB923C] via-[#F97316] to-[#EA580C] p-0.5 shadow-md shadow-[#EA580C]/25 flex items-center justify-center shrink-0 relative overflow-hidden group`}
      >
        {/* Soft specular sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent pointer-events-none" />

        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${dim.icon} drop-shadow-sm`}
        >
          {/* Fluid 'P' Outer Ribbon that sweeps gracefully */}
          <path
            d="M10 39C10 39 12 23 19 14C24 7.5 34 6 39 11C44.5 16.5 43.5 27 34 31C27 34 16 33 10 39Z"
            fill="url(#perviaGradOuter)"
          />
          {/* Inner cutout creating the fluid 'P' loop */}
          <path
            d="M18 29C23 27.5 32 26 33.5 21C35 16 30 13 25 14C20 15 16 21 18 29Z"
            fill="#FFF7ED"
          />
          {/* Rising Chart Bar 1 (Shorter) with slanted top */}
          <path
            d="M22 28V20.5L25 19.5V28H22Z"
            fill="url(#perviaGradBar)"
            rx="1"
          />
          {/* Rising Chart Bar 2 (Taller) with slanted top */}
          <path
            d="M27.5 28V16.5L30.5 15.5V28H27.5Z"
            fill="url(#perviaGradBar)"
            rx="1"
          />

          <defs>
            <linearGradient id="perviaGradOuter" x1="10" y1="10" x2="42" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFF7ED" />
              <stop offset="0.5" stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#FFF1E6" />
            </linearGradient>
            <linearGradient id="perviaGradBar" x1="22" y1="15" x2="31" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F97316" />
              <stop offset="1" stopColor="#EA580C" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`${dim.text} font-black tracking-tight ${textColor} font-sans leading-none`}>
              Pervia
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] mt-0.5 animate-pulse shrink-0" />
            {compact && (
              <span className="text-[9px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-[#FFEDD5] text-[#EA580C] leading-none shrink-0 ml-0.5">
                PMS
              </span>
            )}
          </div>
          {!compact && (
            <span className={`${dim.sub} font-bold text-[#A8A29E] tracking-widest uppercase mt-1 leading-none`}>
              {subtitle || 'PERFORMANCE MANAGEMENT SYSTEM'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
