import React from 'react';
import { PageView } from '../types';
import { BrandLogo } from '../components/BrandLogo';
import { BUSINESS_INFO } from '../data/initialData';
import { StorageService } from '../services/storage';
import {
  Scissors,
  Calendar,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  Star,
  ThumbsUp,
  Image as ImageIcon,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageView, extraParams?: { serviceId?: string; operatorId?: string }) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const services = StorageService.getServices().filter((s) => s.active);
  const popularServices = services.filter((s) => s.popular).slice(0, 3);
  const operator = StorageService.getOperators().filter((o) => o.active)[0];
  const shopStatus = StorageService.getShopCurrentStatus();
  const gallery = StorageService.getGalleryItems().filter((g) => !g.isVideo).slice(0, 5);
  const hours = StorageService.getBusinessHours();

  return (
    <div className="space-y-20 pb-20">
      {/* HERO */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#4A4A51]">
        <div className="absolute inset-0 pointer-events-none opacity-[0.07] bg-[radial-gradient(circle_at_80%_20%,#C8102E,transparent_55%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Testo */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="space-y-1">
                <span className="font-script text-4xl sm:text-5xl text-[#E3162F] block leading-none">
                  Giuseppe Distefano
                </span>
                <h1 className="font-display uppercase font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.02] text-[#F2EFEA]">
                  Capelli e barba <br />
                  <span className="text-[#C8102E]">fatti bene.</span>
                </h1>
              </div>

              <p className="text-base text-[#F2EFEA]/70 max-w-xl leading-relaxed">
                Parrucchiere per uomo in Via Galermo 288/E, a Catania. Dal taglio classico alla sfumatura, dalla barba
                al rasoio al look nuovo: scegli quando passare e prenota online in un minuto.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#2D2D32] border border-[#4A4A51]">
                  <span
                    className={`w-2 h-2 rounded-full ${shopStatus.isOpen ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  />
                  <span className="font-bold text-[11px] uppercase tracking-wider text-[#F2EFEA]">
                    {shopStatus.text}
                  </span>
                </div>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row gap-3 sm:items-center">
                <button
                  onClick={() => onNavigate('booking')}
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#C8102E] hover:bg-[#E3162F] text-white text-xs font-bold uppercase tracking-[0.15em] transition-all group"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Prenota ora</span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </button>
                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  className="inline-flex items-center justify-center px-6 py-4 border border-[#F2EFEA]/40 hover:border-[#F2EFEA] text-[#F2EFEA] text-xs font-bold uppercase tracking-[0.15em] transition-all"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{BUSINESS_INFO.phone}</span>
                </a>
              </div>

              <div className="pt-6 mt-2 border-t border-[#4A4A51] grid grid-cols-3 gap-4">
                <div>
                  <div className="font-display text-3xl font-bold text-[#C8102E] leading-none">96%</div>
                  <div className="text-[11px] text-[#F2EFEA]/60 mt-1">dei clienti ci consiglia</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-bold text-[#C8102E] leading-none">1 min</div>
                  <div className="text-[11px] text-[#F2EFEA]/60 mt-1">per prenotare online</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-bold text-[#C8102E] leading-none">0 code</div>
                  <div className="text-[11px] text-[#F2EFEA]/60 mt-1">si viene su appuntamento</div>
                </div>
              </div>
            </div>

            {/* Logo grande */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-3 border border-[#C8102E]/40 translate-x-3 translate-y-3" />
                <div className="relative bg-[#020607] border border-[#4A4A51] p-6 flex items-center justify-center">
                  <BrandLogo mode="emblem" className="h-72 sm:h-80 w-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* I NOSTRI LAVORI */}
      {gallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#4A4A51] pb-6 mb-8 gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-[0.25em] font-bold text-[#C8102E]">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Il nostro lavoro</span>
              </div>
              <h2 className="font-display uppercase font-bold text-4xl sm:text-5xl text-[#F2EFEA]">
                I tagli parlano da soli
              </h2>
            </div>
            <button
              onClick={() => onNavigate('gallery')}
              className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#F2EFEA] hover:text-[#E3162F]"
            >
              <span>Vedi tutta la galleria</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {gallery.slice(0, 5).map((g, i) => (
              <button
                key={g.id}
                onClick={() => onNavigate('gallery')}
                className={`relative overflow-hidden bg-[#2D2D32] border border-[#4A4A51] group aspect-square ${
                  i === 0 ? 'col-span-2 row-span-2' : ''
                }`}
              >
                <img
                  src={g.image}
                  alt={g.title || 'Taglio realizzato da Giuseppe'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* SERVIZI IN EVIDENZA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#4A4A51] pb-6 mb-10 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-[0.25em] font-bold text-[#C8102E]">
              <Scissors className="w-3.5 h-3.5" />
              <span>Listino</span>
            </div>
            <h2 className="font-display uppercase font-bold text-4xl sm:text-5xl text-[#F2EFEA]">
              Cosa possiamo fare per te
            </h2>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#F2EFEA] hover:text-[#E3162F]"
          >
            <span>Tutti i {services.length} servizi</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularServices.map((service) => (
            <div
              key={service.id}
              className="bg-[#2D2D32] border border-[#4A4A51] hover:border-[#C8102E] p-7 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-[#4A4A51]">
                  <h3 className="font-display uppercase font-semibold text-2xl text-[#F2EFEA]">{service.name}</h3>
                  <span className="font-display text-4xl font-bold text-[#C8102E] leading-none">
                    €{service.price}
                  </span>
                </div>
                <p className="text-sm text-[#F2EFEA]/65 leading-relaxed mb-5">{service.description}</p>
                <span className="inline-flex items-center text-[11px] uppercase tracking-wider text-[#F2EFEA]/50">
                  <Clock className="w-3.5 h-3.5 mr-1.5" />
                  {service.duration_minutes} minuti
                </span>
              </div>

              <button
                onClick={() => onNavigate('booking', { serviceId: service.id })}
                className="mt-6 w-full py-3 border border-[#F2EFEA]/30 group-hover:bg-[#C8102E] group-hover:border-[#C8102E] text-[#F2EFEA] text-[11px] font-bold uppercase tracking-[0.15em] transition-all flex items-center justify-center space-x-2"
              >
                <span>Prenota</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* GIUSEPPE + DOVE SIAMO */}
      <section className="bg-[#28282D] py-16 px-4 sm:px-6 lg:px-8 border-y border-[#4A4A51]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {operator && (
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="w-44 h-44 shrink-0 overflow-hidden border-2 border-[#C8102E] bg-[#17171A]">
                <img src={operator.photo_url} alt={operator.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-3 text-center sm:text-left">
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#C8102E]">
                  Chi ti taglia i capelli
                </span>
                <h2 className="font-display uppercase font-bold text-4xl text-[#F2EFEA] leading-none">
                  {operator.name}
                </h2>
                <p className="text-sm text-[#F2EFEA]/70 leading-relaxed">
                  Al lavoro nel suo salone di Galermo: ascolta quello che vuoi, ti consiglia quello che sta bene a te
                  e non ti lascia andare via finché non sei a posto.
                </p>
                <div className="inline-flex items-center space-x-2 text-xs text-[#F2EFEA]/70">
                  <ThumbsUp className="w-4 h-4 text-[#C8102E]" />
                  <span>Consigliato dal 96% dei clienti</span>
                </div>
                <div>
                  <button
                    onClick={() => onNavigate('booking', { operatorId: operator.id })}
                    className="mt-2 px-7 py-3 bg-[#C8102E] hover:bg-[#E3162F] text-white text-[11px] font-bold uppercase tracking-[0.15em] transition-all"
                  >
                    Prenota da Giuseppe
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-[#2D2D32] border border-[#4A4A51] p-7 space-y-5">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-[#C8102E] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display uppercase font-semibold text-xl text-[#F2EFEA]">Dove siamo</h3>
                <p className="text-sm text-[#F2EFEA]/70">{BUSINESS_INFO.address}</p>
                <a
                  href={BUSINESS_INFO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold uppercase tracking-wider text-[#E3162F] hover:underline"
                >
                  Apri su Google Maps
                </a>
              </div>
            </div>
            <div className="border-t border-[#4A4A51] pt-4 space-y-1.5 text-xs">
              {hours.map((h) => (
                <div key={h.id} className="flex justify-between text-[#F2EFEA]/70">
                  <span>{h.day_name}</span>
                  <span className="font-mono">{h.is_closed ? 'Chiuso' : `${h.open_time} – ${h.close_time}`}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINALE */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <div className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-[0.3em] font-bold text-[#C8102E]">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>Ti aspettiamo</span>
        </div>
        <h2 className="font-display uppercase font-bold text-4xl sm:text-6xl text-[#F2EFEA] leading-tight">
          Pronto per un taglio <span className="text-[#C8102E]">nuovo?</span>
        </h2>
        <p className="text-sm text-[#F2EFEA]/65 max-w-md mx-auto">
          Scegli il servizio, il giorno e l'orario. Niente telefonate, niente attese.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigate('booking')}
            className="px-9 py-4 bg-[#C8102E] hover:bg-[#E3162F] text-white text-xs font-bold uppercase tracking-[0.15em] transition-all"
          >
            Prenota il tuo posto
          </button>
          <button
            onClick={() => onNavigate('contacts')}
            className="px-9 py-4 border border-[#F2EFEA]/40 hover:border-[#F2EFEA] text-[#F2EFEA] text-xs font-bold uppercase tracking-[0.15em] transition-all"
          >
            Come arrivare
          </button>
        </div>
      </section>
    </div>
  );
};
