import React, { useState, useEffect } from 'react';
import { PageView } from '../types';
import { DRLogo } from './DRLogo';
import { BUSINESS_INFO } from '../data/initialData';
import { StorageService } from '../services/storage';
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
  ChevronRight
} from 'lucide-react';

interface HeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView, extraParams?: { serviceId?: string }) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shopStatus, setShopStatus] = useState({ isOpen: false, text: '' });

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
    <header className="sticky top-0 z-50 bg-[#FDFCFB]/95 backdrop-blur-md border-b border-[#1A1A1A] transition-all">
      {/* Top Banner: Status & Contact bar */}
      <div className="hidden md:flex items-center justify-between px-8 py-2 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-[0.2em]">
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
          <a
            href={`tel:${BUSINESS_INFO.phoneRaw}`}
            className="flex items-center space-x-1.5 text-white/90 hover:text-white transition-colors tracking-[0.15em]"
          >
            <Phone className="w-3 h-3 text-white/70" />
            <span className="font-medium">{BUSINESS_INFO.phone}</span>
          </a>
          <span className="opacity-30">/</span>
          <button
            onClick={() => onNavigate('admin')}
            className={`flex items-center space-x-1 px-2 py-0.5 border text-[9px] uppercase tracking-widest transition-colors ${
              currentPage === 'admin'
                ? 'bg-white text-[#1A1A1A] border-white font-bold'
                : 'text-white/70 border-white/30 hover:border-white hover:text-white'
            }`}
            title="Area Riservata Titolare"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Name */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-3.5 cursor-pointer group"
          >
            <DRLogo size="md" variant="light" />
            <div>
              <div className="font-serif italic text-2xl font-light tracking-tight text-[#1A1A1A] group-hover:opacity-75 transition-opacity">
                Dario Riolo
              </div>
              <div className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#1A1A1A]/60">
                Barber Shop · Catania
              </div>
            </div>
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
                      ? 'border border-[#1A1A1A] bg-[#1A1A1A] text-white'
                      : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#EFEDE9] border border-transparent'
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
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-none bg-[#1A1A1A] hover:bg-black text-white font-bold text-[11px] uppercase tracking-wider transition-all border border-[#1A1A1A] group"
            >
              <span>Prenota Appuntamento</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5 opacity-70" />
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center space-x-2 lg:hidden">
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="p-2 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
              title="Chiama il salone"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => onNavigate('booking')}
              className="px-3 py-1.5 border border-[#1A1A1A] bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-wider"
            >
              Prenota
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#EFEDE9] transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1A1A1A] bg-[#FDFCFB] px-4 pt-3 pb-6 space-y-2 shadow-sm animate-in slide-in-from-top-2">
          {/* Status badge in mobile */}
          <div className="flex items-center justify-between px-3 py-2 bg-white border border-[#1A1A1A] text-xs mb-3">
            <div className="flex items-center space-x-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  shopStatus.isOpen ? 'bg-emerald-600' : 'bg-amber-600'
                }`}
              />
              <span className="font-semibold text-[#1A1A1A] text-[11px] uppercase tracking-wider">{shopStatus.text}</span>
            </div>
            <span className="text-[#1A1A1A]/60 text-[10px] uppercase tracking-wider">Via G. Leopardi 138</span>
          </div>

          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all border ${
                  isActive
                    ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                    : 'border-transparent text-[#1A1A1A]/80 hover:bg-[#EFEDE9]'
                }`}
              >
                <span className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.label}</span>
                </span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            );
          })}

          <div className="pt-2 border-t border-[#1A1A1A]/20">
            <button
              onClick={() => {
                onNavigate('admin');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-[#1A1A1A] border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white font-semibold uppercase tracking-wider transition-colors"
            >
              <span className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Pannello Amministrazione</span>
              </span>
              <span className="text-[10px] bg-[#1A1A1A] text-white px-2 py-0.5">Titolare</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
