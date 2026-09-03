import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Maximize2, 
  RotateCcw, 
  Scissors, 
  Upload, 
  Calendar,
  CheckCircle2,
  Film,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { PageView } from '../types';
import { MediaStorageService } from '../services/mediaStorage';
import { DRLogo } from './DRLogo';
import { useAuth } from '../contexts/AuthContext';

interface AtelierVideoPlayerProps {
  onNavigate?: (page: PageView, extraParams?: { serviceId?: string; operatorId?: string }) => void;
  className?: string;
  showDetails?: boolean;
}

const STORAGE_VIDEO_KEY = 'dr_user_uploaded_video';

export const AtelierVideoPlayer: React.FC<AtelierVideoPlayerProps> = ({ 
  onNavigate,
  className = '',
  showDetails = true
}) => {
  const { isAdmin } = useAuth();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [hasCustomVideo, setHasCustomVideo] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Load custom video from IndexedDB if previously uploaded by user
  useEffect(() => {
    let active = true;
    async function loadSavedVideo() {
      try {
        const blob = await MediaStorageService.getMedia(STORAGE_VIDEO_KEY);
        if (blob && active) {
          const url = URL.createObjectURL(blob);
          setVideoSrc(url);
          setHasCustomVideo(true);
          return;
        }
      } catch (err) {
        console.error('Error loading saved video:', err);
      }
    }
    loadSavedVideo();

    return () => {
      active = false;
    };
  }, []);

  // Try autoplay whenever videoSrc changes
  useEffect(() => {
    if (!videoSrc) return;
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    }
  }, [videoSrc]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  const processVideoFile = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Per favore seleziona un file video valido (.mp4, .mov, .webm)');
      return;
    }

    try {
      // Save in IndexedDB for permanent local storage
      await MediaStorageService.saveMedia(STORAGE_VIDEO_KEY, file);
      const objectUrl = URL.createObjectURL(file);
      setVideoSrc(objectUrl);
      setHasCustomVideo(true);
    } catch (err) {
      console.error('Failed to save video:', err);
      // Fallback to in-memory URL
      const objectUrl = URL.createObjectURL(file);
      setVideoSrc(objectUrl);
      setHasCustomVideo(true);
    }
  };

  const handleRemoveVideo = async () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
    }
    await MediaStorageService.removeMedia(STORAGE_VIDEO_KEY);
    setVideoSrc(null);
    setHasCustomVideo(false);
    setIsPlaying(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processVideoFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processVideoFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className={`relative bg-[#1A1A1A] border border-[#1A1A1A] overflow-hidden text-white flex flex-col ${className}`}>
      {/* Hidden file input for video selection */}
      <input 
        ref={fileInputRef}
        type="file" 
        accept="video/*" 
        onChange={handleFileInputChange} 
        className="hidden" 
      />

      {/* Video Container (9:16 portrait style) */}
      <div 
        className={`relative w-full aspect-[9/16] max-h-[640px] bg-black overflow-hidden select-none cursor-pointer group ${
          isDragging ? 'ring-4 ring-white' : ''
        }`}
        onClick={() => {
          if (videoSrc) {
            togglePlay();
          } else if (isAdmin) {
            fileInputRef.current?.click();
          }
        }}
        onDrop={isAdmin ? handleDrop : undefined}
        onDragOver={isAdmin ? handleDragOver : undefined}
        onDragLeave={isAdmin ? handleDragLeave : undefined}
      >
        {videoSrc ? (
          <>
            <video
              ref={videoRef}
              src={videoSrc}
              loop
              playsInline
              autoPlay
              muted
              className="w-full h-full object-cover"
            />

            {/* Top Overlay Badges */}
            <div className="absolute top-3 inset-x-3 flex items-center justify-end z-20 pointer-events-none">
              <div className="flex items-center space-x-1.5 pointer-events-auto">
                <div className="bg-black/75 backdrop-blur-md px-2.5 py-1 border border-white/20 text-[10px] font-mono text-white/90">
                  @darioriolo_barber
                </div>
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveVideo();
                    }}
                    className="p-1.5 bg-black/75 hover:bg-red-600 text-white backdrop-blur-md border border-white/20 transition-colors"
                    title="Rimuovi il video caricato"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Center Play Icon when paused */}
            {!isPlaying && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <div className="w-16 h-16 rounded-full bg-white text-[#1A1A1A] flex items-center justify-center pl-1 shadow-2xl transition-transform transform scale-100 hover:scale-110">
                  <Play className="w-8 h-8 fill-current" />
                </div>
              </div>
            )}

            {/* Bottom Gradient for controls */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-10" />

            {/* Video Controls (senza barra/contatore dei secondi) */}
            <div
              className="absolute inset-x-0 bottom-0 z-30 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={togglePlay}
                    className="p-1 hover:bg-white/20 text-white transition-colors"
                    title={isPlaying ? 'Pausa' : 'Riproduci'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      const video = videoRef.current;
                      if (video) {
                        video.currentTime = 0;
                        video.play();
                        setIsPlaying(true);
                      }
                    }}
                    className="p-1 hover:bg-white/20 text-white transition-colors"
                    title="Ricomincia dall'inizio"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handleFullscreen}
                    className="p-1 hover:bg-white/20 text-white transition-colors"
                    title="Schermo intero"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : isAdmin ? (
          /* Solo per l'admin: prompt di caricamento del video */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#181818] to-black border-2 border-dashed border-white/20 hover:border-white/50 transition-colors">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 text-white border border-white/20">
              <Film className="w-8 h-8" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/60 mb-2">
              Dario Riolo · Atelier Catania
            </span>

            <h3 className="font-serif italic text-2xl font-light text-white mb-2 leading-tight">
              Carica il tuo Video Reel Originale
            </h3>

            <p className="text-xs text-white/75 max-w-xs mb-6 leading-relaxed">
              Trascina qui il file video (.mp4) di Dario Riolo oppure clicca il pulsante sotto per selezionarlo dal tuo dispositivo.
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-6 py-3.5 bg-white text-[#1A1A1A] hover:bg-neutral-200 font-bold text-[11px] uppercase tracking-wider flex items-center space-x-2 shadow-2xl transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Seleziona File Video (.mp4)</span>
            </button>

            <p className="text-[10px] text-white/40 mt-4">
              Verrà salvato istantaneamente nel tuo browser con audio e qualità originale.
            </p>
          </div>
        ) : (
          /* Visitatore non admin: nessun video ancora caricato, nessun invito a caricarlo */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#181818] to-black">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 text-white border border-white/20">
              <Film className="w-8 h-8" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
              Dario Riolo · Atelier Catania
            </span>
            <p className="text-xs text-white/60 max-w-xs mt-2">
              Video in arrivo a breve.
            </p>
          </div>
        )}
      </div>

      {/* Details Box below video */}
      {showDetails && (
        <div className="p-5 bg-[#141414] border-t border-white/10 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/60 block mb-1">
                L'Arte del Taglio a Catania
              </span>
              <h3 className="font-serif italic text-lg font-light text-white leading-snug">
                Forbice su pettine & Sfumatura Taper
              </h3>
            </div>
            {hasCustomVideo ? (
              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Video Originale</span>
              </span>
            ) : (
              <span className="text-[9px] font-bold uppercase tracking-widest text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>In attesa file</span>
              </span>
            )}
          </div>

          <p className="text-xs text-white/75 leading-relaxed">
            Ripresa diretta dalla poltrona di Dario Riolo: precisione geometrica millimetrica, contorni puliti a rasoio e cura sartoriale di ogni ciocca.
          </p>

          {/* Action buttons */}
          <div className="pt-1 flex flex-col sm:flex-row gap-2">
            {onNavigate && (
              <button
                onClick={() => onNavigate('booking', { serviceId: 'srv-taglio-uomo', operatorId: 'op-dario' })}
                className="flex-1 py-3 px-4 bg-white hover:bg-neutral-200 text-[#1A1A1A] font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Prenota con Dario Riolo</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-3 px-3 bg-transparent hover:bg-white/10 text-white/80 hover:text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5"
                title="Carica o sostituisci il file video"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{hasCustomVideo ? 'Sostituisci video' : 'Carica video (.mp4)'}</span>
              </button>
            )}

            {isAdmin && hasCustomVideo && (
              <button
                onClick={handleRemoveVideo}
                className="py-3 px-3 bg-transparent hover:bg-red-950/40 text-white/80 hover:text-red-300 border border-white/20 hover:border-red-500/40 text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5"
                title="Rimuovi il video caricato"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Rimuovi video</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
