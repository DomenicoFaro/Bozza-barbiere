import React from 'react';

interface DRLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  className?: string;
}

export const DRLogo: React.FC<DRLogoProps> = ({ size = 'md', variant = 'light', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  const bgClasses = variant === 'light'
    ? 'bg-[#1A1A1A] text-white border border-[#1A1A1A]'
    : 'bg-[#FDFCFB] text-[#1A1A1A] border border-[#1A1A1A]';

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-none font-serif italic font-light tracking-tight select-none transition-colors ${sizeClasses[size]} ${bgClasses} ${className}`}
      title="Dario Riolo Barber Shop"
    >
      <span className="relative z-10 flex items-center justify-center space-x-[1px]">
        <span className="font-light">D</span>
        <span className="font-normal opacity-70">R</span>
      </span>
      {/* Fine inner border detail */}
      <div className="absolute inset-[3px] border border-current opacity-20 pointer-events-none" />
    </div>
  );
};
