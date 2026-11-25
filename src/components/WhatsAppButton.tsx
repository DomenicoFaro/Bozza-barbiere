import React from 'react';
import { MessageCircle } from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialData';

/** Bottone WhatsApp fisso in basso a destra (sopra la barra di navigazione su telefono). */
export const WhatsAppButton: React.FC = () => {
  const number = BUSINESS_INFO.phoneRaw.replace('+', '');
  const text = encodeURIComponent('Ciao Giuseppe, vorrei prenotare un appuntamento.');
  return (
    <a
      href={`https://wa.me/${number}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Scrivici su WhatsApp"
      title="Scrivici su WhatsApp"
      className="fixed right-4 bottom-28 lg:bottom-6 z-40 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg shadow-black/40 transition-colors"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
};
