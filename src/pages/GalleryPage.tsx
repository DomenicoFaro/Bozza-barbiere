import React, { useState, useRef, useEffect } from 'react';
import { PageView, GalleryItem } from '../types';
import { StorageService } from '../services/storage';
import { MediaStorageService } from '../services/mediaStorage';
import { 
  Image as ImageIcon, 
  X, 
  ZoomIn, 
  Filter, 
  Play, 
  Sparkles, 
  Scissors, 
  Upload, 
  Check, 
  Plus,
  Trash2,
  Video
} from 'lucide-react';

interface GalleryPageProps {
  onNavigate: (page: PageView, extraParams?: { serviceId?: string; operatorId?: string }) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onNavigate }) => {
  const [items, setItems] = useState<GalleryItem[]>(() => StorageService.getGalleryItems());
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  // Clear previous stored media on initial load
  useEffect(() => {
    // Purge previous uploads from storage
    MediaStorageService.removeMedia('dr_user_uploaded_video');
    MediaStorageService.removeMedia('dr_cut_photo');
    StorageService.clearGallery();
    setItems([]);
  }, []);

  // Add custom photo or video modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('tagli');
  const [newDescription, setNewDescription] = useState('');
  const [newMediaPreview, setNewMediaPreview] = useState<string>('');
  const [isVideoFile, setIsVideoFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories = [
    { id: 'all', label: 'Tutti i Contenuti' },
    { id: 'tagli', label: 'Tagli & Sfumature' },
    { id: 'video', label: 'Video & Reel Live' },
    { id: 'salone', label: 'Salone & Arredi' },
    { id: 'barba', label: 'Barba & Panno Caldo' },
    { id: 'dettagli', label: 'Strumenti & Dettagli' },
  ];

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(item => item.category === activeCategory);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVid = file.type.startsWith('video/');
      setIsVideoFile(isVid);
      setMediaType(isVid ? 'video' : 'photo');
      if (isVid) {
        setNewCategory('video');
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setNewMediaPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaPreview || !newTitle.trim()) return;

    StorageService.addGalleryItem({
      title: newTitle.trim(),
      category: isVideoFile ? 'video' : newCategory,
      description: newDescription.trim() || 'Creazione esclusiva realizzata presso Dario Riolo Barber Shop Catania.',
      image: isVideoFile ? '/assets/dario_riolo_logo.png' : newMediaPreview,
      tag: '@darioriolo_barber',
      featured: true,
      isVideo: isVideoFile,
      videoUrl: isVideoFile ? newMediaPreview : undefined,
    });

    setItems(StorageService.getGalleryItems());
    setShowAddModal(false);
    setNewTitle('');
    setNewDescription('');
    setNewMediaPreview('');
    setIsVideoFile(false);
  };

  const handleDeleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Vuoi eliminare questo elemento dalla galleria?')) {
      StorageService.deleteGalleryItem(id);
      setItems(StorageService.getGalleryItems());
      if (lightboxItem?.id === id) {
        setLightboxItem(null);
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Sei sicuro di voler eliminare tutti i contenuti della galleria?')) {
      StorageService.clearGallery();
      setItems([]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#1A1A1A] pb-6 gap-4">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 text-[#1A1A1A]/70 font-bold text-[10px] uppercase tracking-[0.2em]">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Atelier & Portfolio · Catania</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif italic font-light text-[#1A1A1A] tracking-tight">
            Galleria Ufficiale
          </h1>
          <p className="text-sm text-[#1A1A1A]/70 leading-relaxed">
            I tagli sartoriali, le sfumature millimetriche, i rituali per la barba e l'atmosfera autentica di Via Giacomo Leopardi 138.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              className="inline-flex items-center px-3.5 py-2.5 bg-white hover:bg-red-50 text-red-600 border border-red-300 text-[10px] font-bold uppercase tracking-wider transition-all"
              title="Elimina tutti gli elementi"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              <span>Svuota Galleria</span>
            </button>
          )}

          <button
            onClick={() => {
              setMediaType('photo');
              setIsVideoFile(false);
              setNewMediaPreview('');
              setShowAddModal(true);
            }}
            className="inline-flex items-center px-4 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Aggiungi Foto o Video</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      {items.length > 0 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-[#1A1A1A]/20">
          <Filter className="w-3.5 h-3.5 text-[#1A1A1A]/60 mr-1 hidden sm:inline-block shrink-0" />
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
      )}

      {/* Gallery Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="group relative rounded-none overflow-hidden border border-[#1A1A1A] bg-white transition-all cursor-pointer aspect-[4/3] flex flex-col justify-end"
            >
              {item.isVideo && item.videoUrl ? (
                <video
                  src={item.videoUrl}
                  muted
                  playsInline
                  loop
                  autoPlay
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}

              {/* Badges on Top */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A] bg-white/95 px-2.5 py-1 border border-[#1A1A1A] shadow-sm">
                  {item.category}
                </span>

                <div className="flex items-center space-x-1.5">
                  {item.isVideo && (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white bg-black px-2 py-0.5 flex items-center space-x-1 border border-white/20 shadow-sm">
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>Video</span>
                    </span>
                  )}
                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDeleteItem(e, item.id)}
                    className="p-1.5 bg-black/80 hover:bg-red-600 text-white rounded-none border border-white/20 transition-colors shadow-sm"
                    title="Elimina dalla galleria"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Video Play Icon in Center if video */}
              {item.isVideo && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="w-12 h-12 rounded-full bg-white/90 text-[#1A1A1A] flex items-center justify-center pl-0.5 shadow-xl transition-transform group-hover:scale-110">
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                </div>
              )}

              {/* Bottom Overlay Info */}
              <div className="relative z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 text-white flex flex-col justify-end transition-all">
                {item.tag && (
                  <span className="text-[10px] font-mono text-white/80 block mb-1">
                    {item.tag}
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <h3 className="font-serif italic text-xl font-light text-white leading-snug">
                    {item.title}
                  </h3>
                  <ZoomIn className="w-4 h-4 text-white/70 group-hover:text-white shrink-0 ml-2" />
                </div>
                <p className="text-xs text-white/80 line-clamp-2 mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-[#1A1A1A]/40 p-12 text-center bg-white space-y-5">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#EFEDE9] flex items-center justify-center text-[#1A1A1A]">
            <ImageIcon className="w-7 h-7 opacity-60" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-serif italic text-2xl font-light text-[#1A1A1A]">
              Tutte le foto e i video precedenti sono stati rimossi
            </h3>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
              La galleria è ora completamente pulita e pronta ad accogliere i tuoi scatti autentici o i tuoi video reel. Premi il pulsante qui sotto per caricarli in qualsiasi momento.
            </p>
          </div>
          <button
            onClick={() => {
              setMediaType('photo');
              setIsVideoFile(false);
              setNewMediaPreview('');
              setShowAddModal(true);
            }}
            className="inline-flex items-center px-6 py-3 bg-[#1A1A1A] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-black transition-all shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Aggiungi Foto o Video</span>
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#1A1A1A] rounded-none overflow-hidden border border-white/30 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Action buttons on top right */}
            <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
              <button
                onClick={(e) => handleDeleteItem(e, lightboxItem.id)}
                className="p-2 bg-red-600/90 text-white hover:bg-red-700 border border-white/30 transition-colors"
                title="Elimina questo elemento"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLightboxItem(null)}
                className="p-2 bg-black/80 text-white hover:bg-white hover:text-black border border-white/30 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Media Presentation */}
            <div className="max-h-[70vh] overflow-hidden flex items-center justify-center bg-black">
              {lightboxItem.isVideo ? (
                <video
                  src={lightboxItem.videoUrl || lightboxItem.image}
                  muted
                  autoPlay
                  playsInline
                  loop
                  onVolumeChange={(e) => {
                    e.currentTarget.muted = true;
                  }}
                  className="max-h-[70vh] w-auto max-w-full"
                />
              ) : (
                <img
                  src={lightboxItem.image}
                  alt={lightboxItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-[70vh] object-contain"
                />
              )}
            </div>

            {/* Bottom info banner */}
            <div className="p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-white/20 bg-[#141414]">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A] bg-white px-2 py-0.5">
                    {lightboxItem.category}
                  </span>
                  {lightboxItem.tag && (
                    <span className="text-[10px] font-mono text-white/80">
                      {lightboxItem.tag}
                    </span>
                  )}
                </div>
                <h3 className="font-serif italic text-2xl font-light text-white pt-1">
                  {lightboxItem.title}
                </h3>
                <p className="text-xs text-white/75 max-w-xl leading-relaxed">
                  {lightboxItem.description}
                </p>
              </div>

              <div className="flex items-center space-x-3 shrink-0 w-full sm:w-auto pt-2 sm:pt-0">
                <button
                  onClick={() => {
                    setLightboxItem(null);
                    onNavigate('booking', { serviceId: 'srv-taglio-uomo', operatorId: 'op-dario' });
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-neutral-200 text-[#1A1A1A] text-[11px] font-bold uppercase tracking-wider transition-all"
                >
                  <Scissors className="w-3.5 h-3.5 mr-2" />
                  <span>Prenota con Dario</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Media Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="bg-white border border-[#1A1A1A] max-w-md w-full p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-3">
              <div className="flex items-center space-x-2">
                {isVideoFile ? <Video className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                <h3 className="font-serif italic text-lg font-light text-[#1A1A1A]">
                  Aggiungi Nuovo Contenuto
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-[#EFEDE9]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewItem} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[10px] uppercase tracking-wider block mb-1 text-[#1A1A1A]">
                  Seleziona File (Foto o Video) *
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#1A1A1A]/40 p-4 text-center cursor-pointer hover:border-[#1A1A1A] transition-colors bg-[#FDFCFB]"
                >
                  {newMediaPreview ? (
                    <div className="space-y-2">
                      {isVideoFile ? (
                        <video 
                          src={newMediaPreview} 
                          muted 
                          autoPlay 
                          loop 
                          className="max-h-36 mx-auto object-contain border border-[#1A1A1A]" 
                        />
                      ) : (
                        <img 
                          src={newMediaPreview} 
                          alt="Preview" 
                          className="max-h-36 mx-auto object-contain border border-[#1A1A1A]" 
                        />
                      )}
                      <span className="text-[10px] text-[#1A1A1A]/70 block underline">
                        Clicca per cambiare file ({isVideoFile ? 'Video' : 'Foto'})
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1.5 py-4">
                      <Upload className="w-6 h-6 mx-auto text-[#1A1A1A]/60" />
                      <p className="font-semibold text-[11px] text-[#1A1A1A]">
                        Carica foto o video dal dispositivo
                      </p>
                      <p className="text-[10px] text-[#1A1A1A]/60">
                        JPG, PNG, WebP o MP4
                      </p>
                    </div>
                  )}
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*,video/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[10px] uppercase tracking-wider block mb-1 text-[#1A1A1A]">
                  Titolo *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Es. Sfumatura Taper & Texture Crop"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 border border-[#1A1A1A] bg-white text-[#1A1A1A] focus:outline-none"
                />
              </div>

              {!isVideoFile && (
                <div>
                  <label className="font-bold text-[10px] uppercase tracking-wider block mb-1 text-[#1A1A1A]">
                    Categoria
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 border border-[#1A1A1A] bg-white text-[#1A1A1A] focus:outline-none"
                  >
                    <option value="tagli">Tagli & Sfumature</option>
                    <option value="barba">Barba & Panno Caldo</option>
                    <option value="salone">Salone & Arredi</option>
                    <option value="dettagli">Strumenti & Dettagli</option>
                  </select>
                </div>
              )}

              <div>
                <label className="font-bold text-[10px] uppercase tracking-wider block mb-1 text-[#1A1A1A]">
                  Descrizione o Dettagli Tecnici
                </label>
                <textarea 
                  rows={2}
                  placeholder="Descrivi la tecnica, i prodotti utilizzati o la particolarità del look..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 border border-[#1A1A1A] bg-white text-[#1A1A1A] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#EFEDE9] font-bold text-[10px] uppercase tracking-wider transition-colors"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={!newMediaPreview || !newTitle.trim()}
                  className="w-1/2 py-2.5 border border-[#1A1A1A] bg-[#1A1A1A] hover:bg-black disabled:opacity-50 text-white font-bold text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center space-x-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Salva</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

