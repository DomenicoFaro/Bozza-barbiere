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
    { id: 'all', label: 'Tutti' },
    { id: 'capelli', label: 'Capelli' },
    { id: 'barba', label: 'Barba' },
    { id: 'trattamenti', label: 'Colore' },
  ];

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="max-w-3xl space-y-3 border-b border-[#4A4A51] pb-6">
        <div className="inline-flex items-center space-x-2 text-[#F2EFEA]/70 font-bold text-[10px] uppercase tracking-[0.2em]">
          <Scissors className="w-3.5 h-3.5" />
          <span>Servizi</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-display uppercase tracking-wide font-light text-[#F2EFEA]">
          Listino prezzi
        </h1>
        <p className="text-sm text-[#F2EFEA]/70 leading-relaxed">
          Scegli cosa ti serve e prenota. Prezzi chiari, nessuna sorpresa.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-[#F2EFEA]/20">
        <Filter className="w-3.5 h-3.5 text-[#F2EFEA]/60 mr-1 hidden sm:inline-block" />
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-none text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
              selectedCategory === cat.id
                ? 'bg-[#C8102E] text-white border-[#C8102E]'
                : 'bg-[#2D2D32] text-[#F2EFEA]/70 hover:text-[#F2EFEA] border-[#F2EFEA]/30 hover:border-[#C8102E]'
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
              className="bg-[#2D2D32] rounded-none p-7 border border-[#4A4A51] transition-all flex flex-col justify-between group hover:bg-[#424249]/30"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    {service.popular && (
                      <span className="inline-flex items-center text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 border border-[#C8102E] bg-[#C8102E] text-white mb-2">
                        <Sparkles className="w-2.5 h-2.5 mr-1" />
                        Più richiesto
                      </span>
                    )}
                    <h3 className="font-display uppercase tracking-wide text-2xl font-light text-[#F2EFEA] transition-colors">
                      {service.name}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-3xl font-display uppercase tracking-wide font-light text-[#F2EFEA]">
                      €{service.price}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#F2EFEA]/70 leading-relaxed min-h-[48px]">
                  {service.description}
                </p>

                <div className="flex items-center space-x-4 pt-3 border-t border-[#F2EFEA]/15 text-xs text-[#F2EFEA]/70">
                  <span className="flex items-center space-x-1.5 font-medium text-[#F2EFEA]">
                    <Clock className="w-3.5 h-3.5 opacity-70" />
                    <span className="text-[11px]">Durata: {service.duration_minutes} min</span>
                  </span>
                  <span>•</span>
                  <span className="text-[10px] text-[#F2EFEA]/60">
                    Su appuntamento
                  </span>
                </div>
              </div>

              {/* Action Button: Directly selects service and moves to Step 2 (Operator) */}
              <div className="pt-6">
                <button
                  onClick={() => onNavigate('booking', { serviceId: service.id })}
                  className="w-full py-3 rounded-none border border-[#C8102E] bg-[#C8102E] hover:bg-[#E3162F] text-white text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
                >
                  <span>Prenota</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info note box */}
      <div className="bg-[#38383E] border border-[#4A4A51] rounded-none p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-display uppercase tracking-wide text-xl font-light text-[#F2EFEA]">
            Vuoi qualcosa di diverso?
          </h4>
          <p className="text-xs text-[#F2EFEA]/70">
            Scrivilo nelle note della prenotazione oppure chiamaci: ci mettiamo d'accordo.
          </p>
        </div>
        <button
          onClick={() => onNavigate('contacts')}
          className="px-6 py-3 rounded-none bg-[#2D2D32] border border-[#C8102E] text-[11px] font-bold uppercase tracking-wider text-[#F2EFEA] hover:bg-[#C8102E] hover:text-white transition-all shrink-0"
        >
          Contattaci
        </button>
      </div>
    </div>
  );
};
