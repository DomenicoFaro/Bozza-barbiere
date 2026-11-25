import React from 'react';
import { BUSINESS_INFO } from '../data/initialData';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  variant?: 'light' | 'dark' | 'transparent';
  mode?: 'full' | 'icon' | 'emblem';
  className?: string;
  showText?: boolean;
}

export const LOGO_SRC = '/assets/giuseppe_logo_crop.png';

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
 * Logo del salone (teschio con rasoi incrociati) + scritta.
 * - full: logo + "Parrucchiere uomo / Da Giuseppe" (header, footer)
 * - emblem: solo il logo grande
 * - icon: logo quadrato piccolo
 * Il nero dell'immagine si fonde con lo sfondo scuro grazie al blend "lighten".
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  mode = 'full',
  className = '',
  showText = true,
}) => {
  const img = (
    <img
      src={LOGO_SRC}
      alt={`Logo ${BUSINESS_INFO.name}`}
      className="h-full w-auto object-contain mix-blend-lighten"
      draggable={false}
    />
  );

  if (mode === 'icon') {
    return (
      <div
        className={`inline-flex items-center justify-center overflow-hidden select-none ${iconSizes[size]} ${className}`}
        title={BUSINESS_INFO.name}
      >
        <img src={LOGO_SRC} alt="Logo" className="w-full h-full object-cover mix-blend-lighten" />
      </div>
    );
  }

  if (mode === 'emblem') {
    return (
      <div className={`inline-flex select-none ${heightClasses[size]} ${className}`} title={BUSINESS_INFO.name}>
        {img}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-3 select-none ${heightClasses[size]} ${className}`}
      title={`${BUSINESS_INFO.name} · ${BUSINESS_INFO.city}`}
      aria-label={BUSINESS_INFO.name}
    >
      {img}
      {showText && (
        <span className="flex flex-col leading-none whitespace-nowrap">
          <span className="text-[9px] uppercase tracking-[0.3em] font-semibold text-white/60">
            Parrucchiere uomo
          </span>
          <span className="font-script text-[28px] leading-[1.1] text-[#F2EFEA]">
            da <span className="text-[#E3162F]">G</span>iuseppe
          </span>
        </span>
      )}
    </div>
  );
};
