import React from 'react';
import { PageView } from '../types';
import { DRLogo } from '../components/DRLogo';
import { BUSINESS_INFO, GALLERY_ITEMS } from '../data/initialData';
import { StorageService } from '../services/storage';
import { 
  Scissors, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Star,
  Users,
  Compass
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageView, extraParams?: { serviceId?: string }) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const services = StorageService.getServices().filter(s => s.active);
  const popularServices = services.filter(s => s.popular).slice(0, 4);
  const operators = StorageService.getOperators().filter(o => o.active);
  const shopStatus = StorageService.getShopCurrentStatus();

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headline & Intent */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center space-x-2.5 px-3 py-1 border border-[#1A1A1A] bg-white text-[10px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>Via Giacomo Leopardi 138 · Catania</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 mb-2">
                  <DRLogo size="lg" variant="light" />
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#1A1A1A]/60">
                    Atelier di Barbieria Contemporanea
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif italic font-light text-[#1A1A1A] tracking-tight leading-[1.12]">
                  La cura sartoriale per i tuoi capelli e la tua barba.
                </h1>
              </div>

              <p className="text-base text-[#1A1A1A]/70 max-w-2xl leading-relaxed">
                Nel cuore di Catania, un ambiente raffinato dove la grande tradizione della barbieria all'italiana si fonde con tecniche di taglio all'avanguardia e trattamenti di puro benessere.
              </p>

              {/* Status pill & opening info */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-[#1A1A1A]">
                  <Clock className="w-3.5 h-3.5 opacity-60" />
                  <span className="font-bold text-[11px] uppercase tracking-wider text-[#1A1A1A]">{shopStatus.text}</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-[#1A1A1A]">
                  <Phone className="w-3.5 h-3.5 opacity-60" />
                  <a href={`tel:${BUSINESS_INFO.phoneRaw}`} className="font-semibold text-[11px] tracking-wider text-[#1A1A1A] hover:underline">
                    {BUSINESS_INFO.phone}
                  </a>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:items-center">
                <button
                  onClick={() => onNavigate('booking')}
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-none bg-[#1A1A1A] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider transition-all border border-[#1A1A1A] group"
                >
                  <Calendar className="w-4 h-4 mr-2 opacity-80" />
                  <span>Prenota appuntamento</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform group-hover:translate-x-1 opacity-70" />
                </button>
                <button
                  onClick={() => onNavigate('services')}
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-none bg-transparent hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] text-[11px] font-bold uppercase tracking-wider border border-[#1A1A1A] transition-all"
                >
                  <span>Consulta il listino servizi</span>
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-6 border-t border-[#1A1A1A]/20 grid grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A]">0 Sovrapposizioni</div>
                  <div className="text-[#1A1A1A]/60 text-[11px]">Slot riservati e puntuali</div>
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A]">Rituale Panno Caldo</div>
                  <div className="text-[#1A1A1A]/60 text-[11px]">Relax all'italiana</div>
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A]">3 Specialisti</div>
                  <div className="text-[#1A1A1A]/60 text-[11px]">Scegli il tuo barbiere</div>
                </div>
              </div>
            </div>

            {/* Right Column: High Quality Image & Fast Booking Box */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative overflow-hidden border border-[#1A1A1A] aspect-[4/3] group bg-[#EFEDE9]">
                <img
                  src="/src/assets/images/salon_interior_1788436756013.jpg"
                  alt="Dario Riolo Barber Shop Catania"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/30 to-transparent flex items-end p-6">
                  <div className="text-white space-y-1">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold bg-white text-[#1A1A1A] px-2 py-0.5 inline-block mb-1">
                      Spazio Atelier · Catania
                    </span>
                    <p className="font-serif italic text-xl font-light">
                      Poltrone in pelle, legno rovere e luce naturale
                    </p>
                  </div>
                </div>
              </div>

              {/* Fast Booking Preview Card */}
              <div className="bg-white border border-[#1A1A1A] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 opacity-70" />
                    <h3 className="font-serif italic text-lg font-normal text-[#1A1A1A]">
                      Prenotazione in 4 Fasi
                    </h3>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5">
                    Disponibilità Live
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-[#FDFCFB] border border-[#1A1A1A]/30">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-[#1A1A1A] block mb-0.5">1. Servizio</span>
                    <span className="text-[#1A1A1A]/70 text-[11px]">Taglio, Barba, Relax</span>
                  </div>
                  <div className="p-3 bg-[#FDFCFB] border border-[#1A1A1A]/30">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-[#1A1A1A] block mb-0.5">2. Barbiere</span>
                    <span className="text-[#1A1A1A]/70 text-[11px]">Dario, Marco o Luca</span>
                  </div>
                  <div className="p-3 bg-[#FDFCFB] border border-[#1A1A1A]/30">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-[#1A1A1A] block mb-0.5">3. Orario</span>
                    <span className="text-[#1A1A1A]/70 text-[11px]">Slot orario dedicato</span>
                  </div>
                  <div className="p-3 bg-[#FDFCFB] border border-[#1A1A1A]/30">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-[#1A1A1A] block mb-0.5">4. Conferma</span>
                    <span className="text-[#1A1A1A]/70 text-[11px]">Codice & file .ics</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('booking')}
                  className="w-full py-3 border border-[#1A1A1A] bg-[#1A1A1A] hover:bg-black text-white font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
                >
                  <span>Inizia la prenotazione ora</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SERVIZI IN EVIDENZA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#1A1A1A] pb-6">
          <div>
            <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/60 mb-2">
              <Scissors className="w-3.5 h-3.5" />
              <span>Listino Selezionato</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif italic font-light text-[#1A1A1A]">
              I Servizi più Richiesti
            </h2>
            <p className="text-xs text-[#1A1A1A]/70 mt-2 max-w-xl">
              Ogni trattamento include prodotti professionali dedicati e styling finale rifinito nei minimi dettagli.
            </p>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="mt-4 md:mt-0 inline-flex items-center text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] hover:opacity-75 transition-opacity"
          >
            <span>Tutti i 9 trattamenti</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularServices.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-[#1A1A1A] p-6 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-4 border-b border-[#1A1A1A]/10 pb-3">
                  <span className="text-3xl font-serif italic font-light text-[#1A1A1A]">
                    €{service.price}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold border border-[#1A1A1A] bg-[#FDFCFB] text-[#1A1A1A]">
                    <Clock className="w-3 h-3 mr-1 opacity-60" />
                    {service.duration_minutes} min
                  </span>
                </div>

                <h3 className="font-serif italic text-xl font-normal text-[#1A1A1A] mb-2">
                  {service.name}
                </h3>
                <p className="text-xs text-[#1A1A1A]/70 leading-relaxed line-clamp-3 mb-6">
                  {service.description}
                </p>
              </div>

              <button
                onClick={() => onNavigate('booking', { serviceId: service.id })}
                className="w-full py-2.5 bg-transparent group-hover:bg-[#1A1A1A] text-[#1A1A1A] group-hover:text-white text-[10px] font-bold uppercase tracking-wider border border-[#1A1A1A] transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Prenota questo servizio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* L'ATMOSFERA DEL SALONE (GALLERY PREVIEW) */}
      <section className="bg-[#EFEDE9] text-[#1A1A1A] py-16 -mx-4 px-4 sm:px-6 lg:px-8 border-y border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/60">
                <Compass className="w-3.5 h-3.5" />
                <span>Spazio & Design</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif italic font-light leading-tight text-[#1A1A1A]">
                Non solo un taglio: un momento per te stesso.
              </h2>
              <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                Abbiamo progettato il salone di Via Giacomo Leopardi 138 per farti sentire a tuo agio dal primo istante. Pavimenti in legno caldo, poltrone ergonomiche in morbida pelle nera, luce naturale diffusa e un caffè espresso o amaro siciliano offerto al tuo arrivo.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-[#1A1A1A] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#1A1A1A]/80">
                    <strong className="text-[#1A1A1A]">Igiene e sicurezza assolute:</strong> Lame monouso e sanificazione degli strumenti dopo ogni singolo cliente.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-[#1A1A1A] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#1A1A1A]/80">
                    <strong className="text-[#1A1A1A]">Zero code o attese:</strong> La gestione su appuntamento garantisce che la poltrona sia pronta per te all'orario stabilito.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-[#1A1A1A] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#1A1A1A]/80">
                    <strong className="text-[#1A1A1A]">Consulenza stilistica dedicata:</strong> Ascoltiamo le tue esigenze e valorizziamo i tuoi lineamenti.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onNavigate('gallery')}
                  className="px-6 py-3 border border-[#1A1A1A] bg-[#1A1A1A] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider transition-all flex items-center space-x-2"
                >
                  <span>Guarda la galleria fotografica</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="overflow-hidden border border-[#1A1A1A] aspect-square group bg-white">
                <img
                  src="/src/assets/images/salon_detail_1788436773878.jpg"
                  alt="Dettaglio salone Dario Riolo"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="overflow-hidden border border-[#1A1A1A] aspect-square group bg-white">
                <img
                  src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80"
                  alt="Rasatura con panno caldo"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="overflow-hidden border border-[#1A1A1A] aspect-square group bg-white">
                <img
                  src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80"
                  alt="Taglio sfumato e styling"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="overflow-hidden border border-[#1A1A1A] aspect-square group bg-white">
                <img
                  src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80"
                  alt="Cura della barba a Catania"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* I NOSTRI BARBIERI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 text-[10px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/60 mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Maestria & Professionalità</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif italic font-light text-[#1A1A1A]">
            Incontra il Nostro Team
          </h2>
          <p className="text-xs text-[#1A1A1A]/70 mt-2">
            Professionisti appassionati, costantemente aggiornati sui trend internazionali e fedeli alla tradizione siciliana.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {operators.map((op) => (
            <div
              key={op.id}
              className="bg-white border border-[#1A1A1A] flex flex-col group"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#EFEDE9] border-b border-[#1A1A1A]">
                <img
                  src={op.photo_url}
                  alt={op.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-[#1A1A1A] text-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">
                  Disponibile
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif italic text-2xl font-light text-[#1A1A1A]">
                    {op.name}
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/60 mb-2">
                    {op.role}
                  </p>
                  <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                    {op.bio}
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('booking')}
                  className="w-full py-2.5 bg-[#FDFCFB] hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white text-[10px] font-bold uppercase tracking-wider border border-[#1A1A1A] transition-all flex items-center justify-center space-x-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 opacity-70" />
                  <span>Prenota con {op.name.split(' ')[0]}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QUICK LOCATION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1A1A1A] text-white p-8 sm:p-12 border border-[#1A1A1A] relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] block">
              Atelier a Catania
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif italic font-light text-white">
              Vuoi rinnovare il tuo look o concederti un momento di relax?
            </h2>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              Scegli il tuo servizio preferito, seleziona l'orario più comodo e ricevi la conferma istantanea.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <button
                onClick={() => onNavigate('booking')}
                className="px-6 py-3 border border-white bg-white text-[#1A1A1A] hover:bg-transparent hover:text-white font-bold text-[11px] uppercase tracking-wider transition-all flex items-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Prenota ora in 1 minuto</span>
              </button>
              <a
                href={`tel:${BUSINESS_INFO.phoneRaw}`}
                className="px-5 py-3 bg-transparent hover:bg-white/10 text-white font-semibold text-[11px] uppercase tracking-wider border border-white/30 hover:border-white transition-all flex items-center space-x-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{BUSINESS_INFO.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
