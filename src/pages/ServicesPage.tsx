import React, { useState } from 'react';
import { PageView, Service, ServiceCategory } from '../types';
import { StorageService } from '../services/storage';
import { Scissors, Clock, ArrowRight, Sparkles, Check, Filter } from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (page: PageView, extraParams?: { serviceId?: string }) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const services = StorageService.getServices().filter(s => s.active);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'Tutti i Servizi' },
    { id: 'capelli', label: 'Capelli & Tagli' },
    { id: 'barba', label: 'Barba & Rasatura' },
    { id: 'trattamenti', label: 'Trattamenti & Cura' },
  ];

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="max-w-3xl space-y-3 border-b border-[#1A1A1A] pb-6">
        <div className="inline-flex items-center space-x-2 text-[#1A1A1A]/70 font-bold text-[10px] uppercase tracking-[0.2em]">
          <Scissors className="w-3.5 h-3.5" />
          <span>Listino Completo · Atelier</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif italic font-light text-[#1A1A1A] tracking-tight">
          Servizi di Barbieria & Cura Maschile
        </h1>
        <p className="text-sm text-[#1A1A1A]/70 leading-relaxed">
          Scegli il trattamento desiderato: puoi prenotarlo direttamente online selezionando il barbiere e l'orario a te più congeniale.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-[#1A1A1A]/20">
        <Filter className="w-3.5 h-3.5 text-[#1A1A1A]/60 mr-1 hidden sm:inline-block" />
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-none text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
              selectedCategory === cat.id
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                : 'bg-white text-[#1A1A1A]/70 hover:text-[#1A1A1A] border-[#1A1A1A]/30 hover:border-[#1A1A1A]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          return (
            <div
              key={service.id}
              className="bg-white rounded-none p-7 border border-[#1A1A1A] transition-all flex flex-col justify-between group hover:bg-[#EFEDE9]/30"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    {service.popular && (
                      <span className="inline-flex items-center text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 border border-[#1A1A1A] bg-[#1A1A1A] text-white mb-2">
                        <Sparkles className="w-2.5 h-2.5 mr-1" />
                        Più richiesto
                      </span>
                    )}
                    <h3 className="font-serif italic text-2xl font-light text-[#1A1A1A] transition-colors">
                      {service.name}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-3xl font-serif italic font-light text-[#1A1A1A]">
                      €{service.price}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#1A1A1A]/70 leading-relaxed min-h-[48px]">
                  {service.description}
                </p>

                <div className="flex items-center space-x-4 pt-3 border-t border-[#1A1A1A]/15 text-xs text-[#1A1A1A]/70">
                  <span className="flex items-center space-x-1.5 font-medium text-[#1A1A1A]">
                    <Clock className="w-3.5 h-3.5 opacity-70" />
                    <span className="text-[11px]">Durata: {service.duration_minutes} min</span>
                  </span>
                  <span>•</span>
                  <span className="text-[10px] text-[#1A1A1A]/60">
                    Prodotti professionali inclusi
                  </span>
                </div>
              </div>

              {/* Action Button: Directly selects service and moves to Step 2 (Operator) */}
              <div className="pt-6">
                <button
                  onClick={() => onNavigate('booking', { serviceId: service.id })}
                  className="w-full py-3 rounded-none border border-[#1A1A1A] bg-[#1A1A1A] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
                >
                  <span>Prenota questo servizio</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info note box */}
      <div className="bg-[#EFEDE9] border border-[#1A1A1A] rounded-none p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-serif italic text-xl font-light text-[#1A1A1A]">
            Hai esigenze particolari o cerchi una combinazione personalizzata?
          </h4>
          <p className="text-xs text-[#1A1A1A]/70">
            Puoi selezionare note aggiuntive in fase di prenotazione o contattarci direttamente per trattamenti speciali.
          </p>
        </div>
        <button
          onClick={() => onNavigate('contacts')}
          className="px-6 py-3 rounded-none bg-white border border-[#1A1A1A] text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all shrink-0"
        >
          Contatta il salone
        </button>
      </div>
    </div>
  );
};
