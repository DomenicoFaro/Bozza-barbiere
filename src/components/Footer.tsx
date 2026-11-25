import React from 'react';
import { PageView } from '../types';
import { BrandLogo } from './BrandLogo';
import { BUSINESS_INFO } from '../data/initialData';
import { StorageService } from '../services/storage';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Phone, Clock, ExternalLink, Calendar, Scissors, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const businessHours = StorageService.getBusinessHours();
  const { isAdmin } = useAuth();

  return (
    <footer className="bg-[#17171A] text-white border-t border-[#4A4A51]">
      {/* Top Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3.5">
              <BrandLogo mode="full" className="h-16" />
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Parrucchiere per uomo a Galermo, Catania. Taglio, barba e rasoio: vieni, siediti e lascia fare a Giuseppe.
            </p>
            <div className="pt-2 flex items-center space-x-2">
              <button
                onClick={() => onNavigate('booking')}
                className="inline-flex items-center px-4 py-2 border border-[#C8102E] bg-[#C8102E] text-white hover:bg-transparent hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all rounded-none"
              >
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Prenota online
              </button>
              {isAdmin && (
                <button
                  onClick={() => onNavigate('admin')}
                  className="hidden md:inline-flex items-center px-3 py-2 bg-transparent text-white/70 hover:text-white text-[10px] font-semibold uppercase tracking-widest border border-white/20 hover:border-white transition-all rounded-none"
                >
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Admin
                </button>
              )}
            </div>
          </div>

          {/* Col 2: Orari di Apertura */}
          <div className="space-y-4">
            <div className="border-b border-white/20 pb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold block mb-1">Orari Salone</span>
              <h4 className="font-display uppercase tracking-wide text-lg font-light text-white flex items-center gap-2">
                <Clock className="w-4 h-4 opacity-70" />
                Orari di Apertura
              </h4>
            </div>
            <div className="space-y-2 text-xs">
              {businessHours.map((h) => {
                const isToday = new Date().getDay() === h.day_of_week;
                return (
                  <div
                    key={h.id}
                    className={`flex justify-between items-center py-1 border-b border-white/10 ${
                      isToday ? 'text-white font-bold' : 'text-white/70'
                    }`}
                  >
                    <span className="tracking-wide">{h.day_name}</span>
                    <span className="font-mono text-[11px]">
                      {h.is_closed ? (
                        <span className="text-white/40 italic font-sans">Chiuso</span>
                      ) : (
                        `${h.open_time} – ${h.close_time}`
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Col 3: Contatti & Posizione */}
          <div className="space-y-4">
            <div className="border-b border-white/20 pb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold block mb-1">Posizione</span>
              <h4 className="font-display uppercase tracking-wide text-lg font-light text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 opacity-70" />
                Dove Siamo
              </h4>
            </div>
            <div className="space-y-3 text-xs text-white/80">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-white/60 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">{BUSINESS_INFO.address}</p>
                  <p className="text-white/60 text-[11px] mt-0.5">Quartiere Galermo, Catania</p>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-white/60 shrink-0" />
                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  className="hover:text-white transition-colors font-semibold text-xs tracking-wider"
                >
                  {BUSINESS_INFO.phone}
                </a>
              </div>

              <div className="pt-2">
                <a
                  href={BUSINESS_INFO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-[11px] uppercase tracking-wider text-white/80 hover:text-white underline underline-offset-4"
                >
                  <span>Apri in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Navigazione Rapida */}
          <div className="space-y-4">
            <div className="border-b border-white/20 pb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold block mb-1">Indice</span>
              <h4 className="font-display uppercase tracking-wide text-lg font-light text-white flex items-center gap-2">
                <Scissors className="w-4 h-4 opacity-70" />
                Esplora
              </h4>
            </div>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors uppercase tracking-wider text-[11px]"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('booking')}
                  className="hover:text-white transition-colors uppercase tracking-wider text-[11px]"
                >
                  Prenota online
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors uppercase tracking-wider text-[11px]"
                >
                  Listino prezzi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-white transition-colors uppercase tracking-wider text-[11px]"
                >
                  Galleria
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('my-appointments')}
                  className="hover:text-white transition-colors uppercase tracking-wider text-[11px]"
                >
                  I Miei Appuntamenti
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contacts')}
                  className="hover:text-white transition-colors uppercase tracking-wider text-[11px]"
                >
                  Contatti e orari
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6 text-xs text-white/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Parrucchiere Uomo da Giuseppe — Tutti i diritti riservati.</p>
          <p className="flex items-center gap-1 uppercase tracking-widest text-[10px]">
            <span>Galermo · Catania</span>
            <Heart className="w-3 h-3 text-white/70 ml-1" />
          </p>
        </div>
      </div>
    </footer>
  );
};
