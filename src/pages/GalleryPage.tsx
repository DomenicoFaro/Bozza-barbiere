import React, { useState } from 'react';
import { PageView } from '../types';
import { GALLERY_ITEMS } from '../data/initialData';
import { Image as ImageIcon, X, ZoomIn, Calendar, Filter } from 'lucide-react';

interface GalleryPageProps {
  onNavigate: (page: PageView) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxImage, setLightboxImage] = useState<typeof GALLERY_ITEMS[0] | null>(null);

  const categories = [
    { id: 'all', label: 'Tutti gli Scatti' },
    { id: 'salone', label: 'Salone & Arredi' },
    { id: 'barba', label: 'Barba & Panno Caldo' },
    { id: 'tagli', label: 'Tagli & Sfumature' },
    { id: 'dettagli', label: 'Strumenti & Dettagli' },
  ];

  const filteredItems = activeCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="max-w-3xl space-y-3 border-b border-[#1A1A1A] pb-6">
        <div className="inline-flex items-center space-x-2 text-[#1A1A1A]/70 font-bold text-[10px] uppercase tracking-[0.2em]">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Atmosfera & Stile · Portfolio</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif italic font-light text-[#1A1A1A] tracking-tight">
          Galleria Fotografica
        </h1>
        <p className="text-sm text-[#1A1A1A]/70 leading-relaxed">
          Esplora l'ambiente del nostro salone a Catania: pavimenti in legno di rovere miele, poltrone ergonomiche in pelle nera, tocchi di verde botanico e luce naturale.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-[#1A1A1A]/20">
        <Filter className="w-3.5 h-3.5 text-[#1A1A1A]/60 mr-1 hidden sm:inline-block" />
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-none text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
              activeCategory === cat.id
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                : 'bg-white text-[#1A1A1A]/70 hover:text-[#1A1A1A] border-[#1A1A1A]/30 hover:border-[#1A1A1A]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setLightboxImage(item)}
            className="group relative rounded-none overflow-hidden border border-[#1A1A1A] bg-white transition-all cursor-pointer aspect-[4/3]"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-white bg-black/60 px-2 py-0.5 border border-white/30">
                  {item.category}
                </span>
                <ZoomIn className="w-4 h-4 text-white/80" />
              </div>
              <h3 className="font-serif italic text-xl font-light text-white">
                {item.title}
              </h3>
              <p className="text-xs text-white/80 line-clamp-2 mt-1">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#1A1A1A] rounded-none overflow-hidden border border-white/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/80 text-white hover:bg-white hover:text-black border border-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[75vh] overflow-hidden flex items-center justify-center bg-black">
              <img
                src={lightboxImage.image}
                alt={lightboxImage.title}
                className="w-full max-h-[75vh] object-contain"
              />
            </div>

            <div className="p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-white/20 bg-[#1A1A1A]">
              <div>
                <h3 className="font-serif italic text-2xl font-light text-white">
                  {lightboxImage.title}
                </h3>
                <p className="text-xs text-white/70 mt-1 max-w-xl">
                  {lightboxImage.description}
                </p>
              </div>

              <button
                onClick={() => {
                  setLightboxImage(null);
                  onNavigate('booking');
                }}
                className="inline-flex items-center px-6 py-3 rounded-none bg-white hover:bg-[#EFEDE9] text-[#1A1A1A] text-[11px] font-bold uppercase tracking-wider transition-all shrink-0"
              >
                <Calendar className="w-3.5 h-3.5 mr-2" />
                Prenota un taglio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
