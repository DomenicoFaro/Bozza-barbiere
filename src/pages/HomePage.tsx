import React, { useState, useEffect, useRef } from 'react';
import { PageView } from '../types';
import { DRLogo } from '../components/DRLogo';
import { BUSINESS_INFO, GALLERY_ITEMS } from '../data/initialData';
import { StorageService } from '../services/storage';
import { MediaStorageService } from '../services/mediaStorage';
import { AtelierVideoPlayer } from '../components/AtelierVideoPlayer';
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
  Compass,
  Play,
  Image as ImageIcon
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageView, extraParams?: { serviceId?: string; operatorId?: string }) => void;
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
                  <DRLogo size="md" mode="full" className="h-12 w-auto max-w-[200px]" />
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

            {/* Right Column: Interactive Video & Fast Booking Box */}
            <div className="lg:col-span-5 space-y-6">
              <div className="border border-[#1A1A1A] bg-[#1A1A1A] overflow-hidden shadow-lg">
                <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-[#1A1A1A]">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#1A1A1A]">
                      Atelier Live Reel · Dario Riolo
                    </span>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-[#1A1A1A]/60 font-mono">
                    Video Silenzioso
                  </span>
                </div>
                <AtelierVideoPlayer onNavigate={onNavigate} showDetails={false} className="border-0" />
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

      {/* DEDICATED VIDEO REEL SHOWCASE: DARIO RIOLO ALL'OPERA */}
      <section className="bg-[#111111] text-white py-16 -mx-4 px-4 sm:px-6 lg:px-8 border-y border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left / Craft Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 border border-white/20 bg-white/5 text-[10px] uppercase tracking-[0.2em] font-bold text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span>Video Reel Live · Via Giacomo Leopardi 138</span>
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase font-mono tracking-widest text-white/50 block">
                  @darioriolo_barber
                </span>
                <h2 className="text-3xl sm:text-5xl font-serif italic font-light leading-tight text-white">
                  Guarda Dario Riolo all'opera.
                </h2>
              </div>

              <p className="text-sm text-white/70 leading-relaxed max-w-xl">
                Nessun filtro o artificio: il video mostra la reale precisione a forbice su pettine, le sfumature millimetriche a lama e la modellatura della texture realizzate ogni giorno nel nostro salone a Catania.
              </p>

              {/* 3 Step Craft Details */}
              <div className="space-y-4 pt-3 border-t border-white/10">
                <div className="flex items-start space-x-4">
                  <span className="font-mono text-xs text-white/40 pt-0.5 font-bold">01.</span>
                  <div>
                    <h4 className="text-xs font-bold tracking-wider text-white uppercase">Consulenza Morfologica & Studio del Profilo</h4>
                    <p className="text-xs text-white/60 mt-0.5">Analizziamo proporzioni, attaccature e direzioni naturali di crescita per esaltare i tuoi lineamenti.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="font-mono text-xs text-white/40 pt-0.5 font-bold">02.</span>
                  <div>
                    <h4 className="text-xs font-bold tracking-wider text-white uppercase">Sfumatura Taper Fade & Rifinitura a Lama</h4>
                    <p className="text-xs text-white/60 mt-0.5">Passaggi graduali senza scalini, basette pulite e contorni a rasoio a mano libera con lama sterile.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="font-mono text-xs text-white/40 pt-0.5 font-bold">03.</span>
                  <div>
                    <h4 className="text-xs font-bold tracking-wider text-white uppercase">Texture Disconnessa & Styling Opaco</h4>
                    <p className="text-xs text-white/60 mt-0.5">Lavoro di forbice per donare movimento, volume leggero e definizione flessibile per l'intera giornata.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onNavigate('booking', { serviceId: 'srv-taglio-uomo', operatorId: 'op-dario' })}
                  className="px-7 py-3.5 bg-white hover:bg-neutral-200 text-[#1A1A1A] text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
                >
                  <Scissors className="w-4 h-4" />
                  <span>Prenota questo taglio con Dario</span>
                </button>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="px-6 py-3.5 bg-transparent hover:bg-white/10 text-white text-[11px] font-bold uppercase tracking-wider border border-white/30 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Guarda la galleria fotografica</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                </button>
              </div>
            </div>

            {/* Right / Video Player Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm">
                <AtelierVideoPlayer onNavigate={onNavigate} showDetails={true} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SERVIZI IN EVIDENZA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#1A1A1A] pb-6 mb-10 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/60">
              <Scissors className="w-3.5 h-3.5" />
              <span>Listino Esclusivo</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif italic font-light text-[#1A1A1A]">
              Servizi in Evidenza
            </h2>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#1A1A1A] hover:underline"
          >
            <span>Vedi tutti i {services.length} trattamenti</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
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
                  <span>Guarda tutti gli scatti della galleria</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                </button>
              </div>
            </div>

            {/* Atelier Brand Identity & Video Presentation */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Official Atelier Logo & Identity */}
              <div className="border border-[#1A1A1A] bg-white p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-[#1A1A1A] text-white text-[9px] font-bold uppercase tracking-widest">
                    <span>Identità Ufficiale</span>
                  </div>
                  <div className="py-4 flex items-center justify-center bg-[#EFEDE9] border border-[#1A1A1A]/20 p-4">
                    <DRLogo size="lg" mode="full" className="max-h-24 w-auto object-contain" />
                  </div>
                  <div>
                    <h3 className="font-serif italic text-xl font-light text-[#1A1A1A]">
                      Dario Riolo Barber Shop
                    </h3>
                    <p className="text-xs text-[#1A1A1A]/70 mt-1 leading-relaxed">
                      Atelier sartoriale in Via Giacomo Leopardi 138 a Catania. Tutte le foto stock sono state rimosse per garantire esclusività e autenticità.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1A1A1A]/20 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#1A1A1A]/60">Catania, Sicilia</span>
                  <button
                    onClick={() => onNavigate('gallery')}
                    className="text-[10px] uppercase font-bold tracking-wider text-[#1A1A1A] hover:underline flex items-center space-x-1"
                  >
                    <span>Apri Galleria</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Silent Atelier Reel Showcase */}
              <div className="border border-[#1A1A1A] bg-[#1A1A1A] text-white p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-white/10 text-white text-[9px] font-bold uppercase tracking-widest border border-white/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span>Reel Live Senza Audio</span>
                  </div>

                  <div>
                    <h3 className="font-serif italic text-2xl font-light text-white">
                      Il Gesto e la Tecnica
                    </h3>
                    <p className="text-xs text-white/70 mt-2 leading-relaxed">
                      Guarda Dario Riolo all'opera mentre rifinisce taglio e sfumatura nel salone di Catania. Riproduzione silenziosa per la massima concentrazione sul gesto.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-3 space-y-1 text-xs">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-white/90">
                      Format Atelier Reel
                    </div>
                    <div className="text-white/60 text-[11px]">
                      Audio disattivato · Movimento puro a forbice e lama
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <button
                    onClick={() => onNavigate('gallery')}
                    className="w-full py-3 bg-white text-[#1A1A1A] hover:bg-neutral-200 text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Esplora Galleria Video</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* I NOSTRI BARBIERI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/60">
            <Users className="w-3.5 h-3.5" />
            <span>Maestria & Passione</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif italic font-light text-[#1A1A1A]">
            I Maestri Barbieri
          </h2>
          <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
            Ogni membro del nostro team condivide la dedizione per il dettaglio, l'ascolto del cliente e l'aggiornamento continuo sui trend internazionali.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {operators.map((op) => (
            <div 
              key={op.id}
              className="bg-white border border-[#1A1A1A] p-6 text-center space-y-4 flex flex-col items-center"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border border-[#1A1A1A] p-1 bg-[#EFEDE9]">
                <img 
                  src={op.photo_url} 
                  alt={op.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif italic text-2xl font-light text-[#1A1A1A]">
                  {op.name}
                </h3>
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/60 block">
                  {op.role}
                </span>
              </div>

              <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                {op.bio}
              </p>

              <div className="pt-2 w-full">
                <button
                  onClick={() => onNavigate('booking', { operatorId: op.id })}
                  className="w-full py-2.5 bg-transparent hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider border border-[#1A1A1A] transition-all"
                >
                  Prenota con {op.name.split(' ')[0]}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER CTA BANNER */}
      <section className="bg-[#1A1A1A] text-white py-14 -mx-4 px-4 sm:px-6 lg:px-8 border-t border-[#1A1A1A]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-[0.25em] font-bold text-white/60">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Esperienza Sartoriale a Catania</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif italic font-light tracking-tight text-white">
            La tua poltrona ti aspetta.
          </h2>

          <p className="text-sm text-white/70 max-w-xl mx-auto leading-relaxed">
            Seleziona il trattamento desiderato, scegli il tuo barbiere di fiducia e prenota il tuo appuntamento in meno di 2 minuti.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => onNavigate('booking')}
              className="px-8 py-3.5 bg-white hover:bg-[#EFEDE9] text-[#1A1A1A] text-[11px] font-bold uppercase tracking-wider transition-all"
            >
              Prenota ora online
            </button>
            <button
              onClick={() => onNavigate('contacts')}
              className="px-8 py-3.5 bg-transparent hover:bg-white/10 text-white text-[11px] font-bold uppercase tracking-wider border border-white/30 transition-all"
            >
              Come raggiungerci
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
