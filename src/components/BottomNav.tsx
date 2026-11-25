import React, { useState } from 'react';
import { PageView } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { BUSINESS_INFO } from '../data/initialData';
import { StorageService } from '../services/storage';
import {
  Home,
  Scissors,
  Calendar,
  User,
  Menu,
  X,
  Image as ImageIcon,
  MapPin,
  BookmarkCheck,
  Phone,
  LogOut,
  ChevronRight,
} from 'lucide-react';

interface BottomNavProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

/**
 * Barra di navigazione fissa in basso (telefono e tablet):
 * Home · Servizi · [Prenota] · Accedi · Menu
 */
export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user, profile, signOut } = useAuth();
  const status = StorageService.getShopCurrentStatus();

  const itemClass = (active: boolean) =>
    `flex flex-col items-center justify-center gap-1 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
      active ? 'text-[#E3162F]' : 'text-[#F2EFEA]/70'
    }`;

  const go = (page: PageView) => {
    setMenuOpen(false);
    onNavigate(page);
  };

  const menuLinks: { page: PageView; label: string; icon: React.ReactNode }[] = [
    { page: 'gallery', label: 'Galleria', icon: <ImageIcon className="w-5 h-5" /> },
    { page: 'contacts', label: 'Contatti e orari', icon: <MapPin className="w-5 h-5" /> },
    { page: 'my-appointments', label: 'I miei appuntamenti', icon: <BookmarkCheck className="w-5 h-5" /> },
  ];

  return (
    <>
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-[#17171A]/95 backdrop-blur-md border-t border-[#4A4A51]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Navigazione principale"
      >
        <div className="grid grid-cols-5 items-end max-w-xl mx-auto">
          <button onClick={() => go('home')} className={itemClass(currentPage === 'home')}>
            <Home className="w-6 h-6" />
            <span>Home</span>
          </button>

          <button onClick={() => go('services')} className={itemClass(currentPage === 'services')}>
            <Scissors className="w-6 h-6" />
            <span>Servizi</span>
          </button>

          {/* Prenota: pulsante centrale in rilievo */}
          <button
            onClick={() => go('booking')}
            className="flex flex-col items-center justify-end gap-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA]"
            aria-label="Prenota"
          >
            <span
              className={`-mt-7 w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg shadow-black/50 ring-4 ring-[#17171A] transition-colors ${
                currentPage === 'booking' ? 'bg-[#E3162F]' : 'bg-[#C8102E]'
              }`}
            >
              <Calendar className="w-7 h-7" />
            </span>
            <span className={currentPage === 'booking' ? 'text-[#E3162F]' : ''}>Prenota</span>
          </button>

          {user ? (
            <button
              onClick={() => go('my-appointments')}
              className={itemClass(currentPage === 'my-appointments')}
            >
              <User className="w-6 h-6" />
              <span>I miei</span>
            </button>
          ) : (
            <button onClick={() => setShowAuth(true)} className={itemClass(false)}>
              <User className="w-6 h-6" />
              <span>Accedi</span>
            </button>
          )}

          <button onClick={() => setMenuOpen(true)} className={itemClass(menuOpen)}>
            <Menu className="w-6 h-6" />
            <span>Menu</span>
          </button>
        </div>
      </nav>

      {/* Menu a scomparsa dal basso */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]" role="dialog" aria-modal="true">
          <button
            className="absolute inset-0 bg-black/70"
            onClick={() => setMenuOpen(false)}
            aria-label="Chiudi menu"
          />
          <div
            className="absolute bottom-0 inset-x-0 bg-[#2D2D32] border-t-2 border-[#C8102E] max-h-[85vh] overflow-y-auto"
            style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#4A4A51]">
              <div>
                <div className="font-display uppercase font-semibold text-xl text-[#F2EFEA] leading-none">
                  Menu
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#F2EFEA]/70">
                  <span className={`w-2 h-2 rounded-full ${status.isOpen ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span>{status.text}</span>
                </div>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 border border-[#4A4A51] text-[#F2EFEA]"
                aria-label="Chiudi"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 space-y-1">
              {menuLinks.map((l) => (
                <button
                  key={l.page}
                  onClick={() => go(l.page)}
                  className={`w-full flex items-center justify-between px-4 py-4 text-sm font-semibold uppercase tracking-wider border ${
                    currentPage === l.page
                      ? 'border-[#C8102E] text-[#E3162F]'
                      : 'border-transparent text-[#F2EFEA] active:bg-[#38383E]'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {l.icon}
                    <span>{l.label}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              ))}

              <a
                href={`tel:${BUSINESS_INFO.phoneRaw}`}
                className="w-full flex items-center justify-between px-4 py-4 text-sm font-semibold uppercase tracking-wider text-[#F2EFEA] active:bg-[#38383E]"
              >
                <span className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span>Chiama {BUSINESS_INFO.phone}</span>
                </span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </a>

              {user ? (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center justify-between px-4 py-4 text-sm font-semibold uppercase tracking-wider text-[#F2EFEA]/80 border-t border-[#4A4A51] mt-2"
                >
                  <span className="flex items-center gap-3">
                    <LogOut className="w-5 h-5" />
                    <span>Esci ({profile?.first_name || 'Cliente'})</span>
                  </span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
};
