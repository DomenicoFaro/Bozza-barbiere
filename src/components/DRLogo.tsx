import React, { useState, useEffect } from 'react';
import { MediaStorageService } from '../services/mediaStorage';

interface DRLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  variant?: 'light' | 'dark' | 'transparent';
  mode?: 'full' | 'icon';
  className?: string;
  showText?: boolean;
}

const STORAGE_LOGO_KEY = 'dr_site_logo';

export const DRLogo: React.FC<DRLogoProps> = ({ 
  size = 'md', 
  variant = 'light',
  mode = 'full',
  className = '',
  showText = true
}) => {
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadLogo() {
      try {
        const blob = await MediaStorageService.getMedia(STORAGE_LOGO_KEY);
        if (blob && active) {
          setCustomLogoUrl(URL.createObjectURL(blob));
        }
      } catch (err) {
        console.error('Error loading custom logo:', err);
      }
    }
    loadLogo();
    return () => { active = false; };
  }, []);

  const logoSrc = customLogoUrl || '/assets/dario_riolo_logo.png';

  // Sizing definitions
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

  // If mode is "full", display the complete Dario Riolo Barber Shop logo badge
  if (mode === 'full') {
    return (
      <div 
        className={`relative inline-flex items-center overflow-hidden bg-black border border-[#1A1A1A] select-none transition-all shadow-sm ${heightClasses[size]} ${className}`}
        title="Dario Riolo Barber Shop Catania"
      >
        <img 
          src={logoSrc} 
          alt="Dario Riolo Barber Shop Logo" 
          className="h-full w-auto object-contain block max-w-[280px]"
          onError={(e) => {
            // Fallback to SVG if image fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* Subtle inner ambient ring */}
        <div className="absolute inset-0 border border-white/10 pointer-events-none" />
      </div>
    );
  }

  // If mode is "icon", display the stylized DR emblem
  return (
    <div 
      className={`relative inline-flex items-center justify-center overflow-hidden bg-black border border-[#1A1A1A] text-white select-none transition-all shadow-sm ${iconSizes[size]} ${className}`}
      title="Dario Riolo Barber Shop"
    >
      <img 
        src={logoSrc} 
        alt="DR Logo" 
        className="w-full h-full object-cover scale-150 object-center"
      />
      <div className="absolute inset-0 border border-white/10 pointer-events-none" />
    </div>
  );
};
