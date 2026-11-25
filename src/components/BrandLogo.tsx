import React from 'react';
import { BUSINESS_INFO } from '../data/initialData';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  variant?: 'light' | 'dark' | 'transparent';
  mode?: 'full' | 'icon';
  className?: string;
  showText?: boolean;
}

const heightClasses = {
  xs: 'h-8',
  sm: 'h-10',
  md: 'h-12',
  lg: 'h-16',
  xl: 'h-20',
  hero: 'h-28 sm:h-36',
};

const iconSizes = {
  xs: 'w-8 h-8',
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
  hero: 'w-28 h-28',
};

/**
 * Logo testuale del salone: monogramma "G" in un cerchio + scritta
 * "Parrucchiere Uomo da Giuseppe". Usa currentColor, quindi si adatta
 * allo sfondo chiaro o scuro in cui viene inserito.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  mode = 'full',
  className = '',
  showText = true,
}) => {
  const monogram = (
    <span
      className="inline-flex items-center justify-center aspect-square h-full rounded-full border-2 border-current font-serif italic font-semibold leading-none shrink-0"
      style={{ fontSize: '1.4em' }}
      aria-hidden="true"
    >
      {BUSINESS_INFO.monogram}
    </span>
  );

  if (mode === 'icon') {
    return (
      <div
        className={`inline-flex items-center justify-center select-none ${iconSizes[size]} ${className}`}
        title={BUSINESS_INFO.name}
        aria-label={BUSINESS_INFO.name}
      >
        {monogram}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-3 select-none ${heightClasses[size]} ${className}`}
      title={`${BUSINESS_INFO.name} · ${BUSINESS_INFO.city}`}
      aria-label={BUSINESS_INFO.name}
    >
      {monogram}
      {showText && (
        <span className="flex flex-col leading-tight">
          <span className="text-[9px] uppercase tracking-[0.25em] font-bold opacity-70">
            Parrucchiere Uomo
          </span>
          <span className="font-serif italic text-xl font-medium">da Giuseppe</span>
        </span>
      )}
    </div>
  );
};
