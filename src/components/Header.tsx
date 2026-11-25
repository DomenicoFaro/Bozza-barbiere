import React, { useState, useEffect } from 'react';
import { PageView } from '../types';
import { BrandLogo } from './BrandLogo';
import { BUSINESS_INFO } from '../data/initialData';
import { StorageService } from '../services/storage';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';
import {
  Calendar,
  Scissors,
  Image as ImageIcon,
  Clock,
  Phone,
  MapPin,
  ShieldCheck,
  Menu,
  X,
  BookmarkCheck,
  ChevronRight,
  User,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView, extraParams?: { serviceId?: string }) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shopStatus, setShopStatus] = useState({ isOpen: false, text: '' });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, profile, isAdmin, signOut } = useAuth();

  useEffect(() => {
    setShopStatus(StorageService.getShopCurrentStatus());
    const interval = setInterval(() => {
      setShopStatus(StorageService.getShopCurrentStatus());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { page: PageView; label: string; icon: React.ReactNode }[] = [
    { page: 'home', label: 'Home', icon: null },
    { page: 'booking', label: 'Prenota', icon: <Calendar className="w-4 h-4" /> },
    { page: 'services', label: 'Servizi', icon: <Scissors className="w-4 h-4" /> },
    { page: 'gallery', label: 'Galleria', icon: <ImageIcon className="w-4 h-4" /> },
    { page: 'my-appointments', label: 'I miei appuntamenti', icon: <BookmarkCheck className="w-4 h-4" /> },
    { page: 'contacts', label: 'Contatti', icon: <MapPin className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#222226]/95 backdrop-blur-md border-b border-[#4A4A51] transition-all">
      {/* Top Banner: Status & Contact bar */}
      <div className="hidden md:flex items-center justify-between px-8 py-2 bg-[#17171A] text-white text-[10px] uppercase tracking-[0.2em]">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                shopStatus.isOpen ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            <span className="font-semibold tracking-[0.2em]">{shopStatus.text}</span>
          </div>
          <span className="opacity-30">/</span>
          <span className="opacity-80 flex items-center gap-1 tracking-[0.15em]">
            <MapPin className="w-3 h-3 text-white/70" />
            {BUSINESS_INFO.address}
          </span>
        </div>

        <div className="flex items-center space-x-5">
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-white/90 tracking-[0.15em] flex items-center space-x-1.5">
                <User className="w-3 h-3 text-white/70" />
                <span>Ciao, {profile?.first_name || 'Cliente'}</span>
              </span>
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-1 text-white/70 hover:text-white transition-colors"
                title="Esci dal tuo account"
              >
                <LogOut className="w-3 h-3" />
                <span>Esci</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="relative flex items-center space-x-1.5 px-2.5 py-0.5 bg-[#C8102E] text-white hover:bg-[#E3162F] font-bold text-[9px] uppercase tracking-widest transition-colors"
            >
              <span className="absolute -top-1 -right-1 w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" />
                <span className="absolute inset-0 rounded-full bg-emerald-500" />
              </span>
              <User className="w-3 h-3" />
              <span>Accedi</span>
            </button>
          )}
          {isAdmin && (
            <>
              <span className="opacity-30">/</span>
              <button
                onClick={() => onNavigate('admin')}
                className={`flex items-center space-x-1 px-2 py-0.5 border text-[9px] uppercase tracking-widest transition-colors ${
                  currentPage === 'admin'
                    ? 'bg-[#C8102E] text-white border-[#C8102E] font-bold'
                    : 'text-white/70 border-white/30 hover:border-white hover:text-white'
                }`}
                title="Area Riservata Titolare"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Admin</span>
              </button>
            </>
          )}
        </div>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo & Brand Name */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-3.5 cursor-pointer group py-1"
          >
            <BrandLogo mode="full" className="h-12 lg:h-14" />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => onNavigate(item.page)}
                  className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold transition-all rounded-none ${
                    isActive
                      ? 'border border-[#C8102E] bg-[#C8102E] text-white'
                      : 'text-[#F2EFEA]/70 hover:text-[#F2EFEA] hover:bg-[#424249] border border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={() => onNavigate('booking')}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-none bg-[#C8102E] hover:bg-[#E3162F] text-white font-bold text-[11px] uppercase tracking-wider transition-all border border-[#C8102E] group"
            >
              <span>Prenota ora</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5 opacity-70" />
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center space-x-2 lg:hidden">
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="p-2.5 border border-[#C8102E] text-[#F2EFEA] hover:bg-[#C8102E] hover:text-white transition-colors"
              title="Chiama Giuseppe"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
