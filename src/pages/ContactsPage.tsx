import React, { useState } from 'react';
import { PageView } from '../types';
import { BUSINESS_INFO } from '../data/initialData';
import { StorageService } from '../services/storage';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  Calendar, 
  Navigation,
  MessageSquare
} from 'lucide-react';

interface ContactsPageProps {
  onNavigate: (page: PageView) => void;
}

export const ContactsPage: React.FC<ContactsPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const businessHours = StorageService.getBusinessHours();
  const shopStatus = StorageService.getShopCurrentStatus();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3 border-b border-[#1A1A1A] pb-6">
        <div className="inline-flex items-center space-x-2 text-[#1A1A1A]/70 font-bold text-[10px] uppercase tracking-[0.2em]">
          <MapPin className="w-3.5 h-3.5" />
          <span>Vieni a Trovarci · Atelier Catania</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif italic font-light text-[#1A1A1A] tracking-tight">
          Contatti & Posizione
        </h1>
        <p className="text-sm text-[#1A1A1A]/70 leading-relaxed">
          Siamo a Catania in Via Giacomo Leopardi 138, a pochi passi da Corso Italia e Viale Vittorio Veneto.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Info, Telephone, Hours */}
        <div className="lg:col-span-5 space-y-6">
          {/* Status banner */}
          <div className="p-4 rounded-none bg-white border border-[#1A1A1A] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  shopStatus.isOpen ? 'bg-emerald-600 animate-pulse' : 'bg-[#1A1A1A]'
                }`}
              />
              <div>
                <span className="font-serif italic text-lg text-[#1A1A1A]">
                  {shopStatus.text}
                </span>
                <p className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/60">
                  Prenotazione sempre disponibile online h24
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('booking')}
              className="px-4 py-2 rounded-none border border-[#1A1A1A] bg-[#1A1A1A] hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider transition-all"
            >
              Prenota
            </button>
          </div>

          {/* Contact Details Card */}
          <div className="bg-white rounded-none p-6 border border-[#1A1A1A] space-y-5">
            <h3 className="font-serif italic text-2xl font-light text-[#1A1A1A] border-b border-[#1A1A1A]/15 pb-3">
              Recapiti Ufficiali
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-[#EFEDE9] text-[#1A1A1A] border border-[#1A1A1A]/20 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#1A1A1A] block text-xs uppercase tracking-wider">Indirizzo</span>
                  <p className="text-[#1A1A1A]/70 mt-0.5">{BUSINESS_INFO.address}</p>
                  <a
                    href={BUSINESS_INFO.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#1A1A1A] font-bold uppercase tracking-wider mt-1 hover:underline text-[10px]"
                  >
                    <Navigation className="w-3 h-3 mr-1" />
                    Avvia navigatore
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-[#EFEDE9] text-[#1A1A1A] border border-[#1A1A1A]/20 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#1A1A1A] block text-xs uppercase tracking-wider">Telefono & WhatsApp</span>
                  <a
                    href={`tel:${BUSINESS_INFO.phoneRaw}`}
                    className="text-lg font-serif italic text-[#1A1A1A] hover:underline block mt-0.5"
                  >
                    {BUSINESS_INFO.phone}
                  </a>
                  <span className="text-[10px] text-[#1A1A1A]/60">
                    Attivo negli orari di apertura per informazioni e urgenze
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-[#EFEDE9] text-[#1A1A1A] border border-[#1A1A1A]/20 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#1A1A1A] block text-xs uppercase tracking-wider">Email</span>
                  <p className="text-[#1A1A1A]/70 mt-0.5">{BUSINESS_INFO.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Orari di Apertura Table */}
          <div className="bg-white rounded-none p-6 border border-[#1A1A1A] space-y-4">
            <h3 className="font-serif italic text-2xl font-light text-[#1A1A1A] flex items-center gap-2 border-b border-[#1A1A1A]/15 pb-3">
              <Clock className="w-4 h-4 opacity-70" />
              Orari Settimanali
            </h3>

            <div className="space-y-1.5 text-xs">
              {businessHours.map((h) => {
                const isToday = new Date().getDay() === h.day_of_week;
                return (
                  <div
                    key={h.id}
                    className={`flex justify-between items-center py-2 px-2.5 ${
                      isToday
                        ? 'bg-[#EFEDE9] text-[#1A1A1A] font-bold border border-[#1A1A1A]'
                        : 'text-[#1A1A1A]/70 border-b border-[#1A1A1A]/10'
                    }`}
                  >
                    <span>
                      {h.day_name} {isToday && '(Oggi)'}
                    </span>
                    <span>
                      {h.is_closed ? (
                        <span className="text-rose-700 font-medium">Chiuso</span>
                      ) : (
                        <span className="font-medium font-mono text-[11px]">{h.open_time} – {h.close_time}</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Google Maps Embed & Contact Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Interactive Google Maps Embed */}
          <div className="bg-white rounded-none overflow-hidden border border-[#1A1A1A]">
            <div className="p-4 border-b border-[#1A1A1A] flex justify-between items-center bg-[#EFEDE9]">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#1A1A1A]" />
                <span className="font-serif italic text-base text-[#1A1A1A]">
                  Mappa Salone · Catania
                </span>
              </div>
              <a
                href={BUSINESS_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] hover:underline"
              >
                Ingrandisci mappa
              </a>
            </div>
            <div className="w-full h-72 sm:h-80 bg-gray-100">
              <iframe
                title="Mappa Dario Riolo Barber Shop"
                src={BUSINESS_INFO.googleMapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-none p-6 sm:p-8 border border-[#1A1A1A] space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-[#1A1A1A]/70 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Modulo di Contatto</span>
              </div>
              <h3 className="font-serif italic text-3xl font-light text-[#1A1A1A]">
                Inviaci un Messaggio
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 mt-1">
                Per informazioni, eventi, collaborazioni o richieste particolari.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 bg-[#EFEDE9] border border-[#1A1A1A] text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-[#1A1A1A] mx-auto" />
                <h4 className="font-serif italic text-2xl font-light text-[#1A1A1A]">
                  Messaggio inviato con successo!
                </h4>
                <p className="text-xs text-[#1A1A1A]/70 max-w-md mx-auto">
                  Grazie per averci contattato. Ti risponderemo al più presto al recapito indicato.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-6 py-2.5 border border-[#1A1A1A] bg-[#1A1A1A] hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider"
                >
                  Invia un altro messaggio
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                      Nome e Cognome *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Mario Rossi"
                      className="w-full px-3.5 py-2.5 rounded-none border border-[#1A1A1A] text-xs focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] bg-[#FDFCFB]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                      Numero di Telefono
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+39 340 1234567"
                      className="w-full px-3.5 py-2.5 rounded-none border border-[#1A1A1A] text-xs focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] bg-[#FDFCFB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                    Indirizzo Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="mario.rossi@example.com"
                    className="w-full px-3.5 py-2.5 rounded-none border border-[#1A1A1A] text-xs focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] bg-[#FDFCFB]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                    Il tuo Messaggio *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Scrivi qui la tua richiesta o domanda..."
                    className="w-full px-3.5 py-2.5 rounded-none border border-[#1A1A1A] text-xs focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] bg-[#FDFCFB]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-none border border-[#1A1A1A] bg-[#1A1A1A] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5 opacity-70" />
                  <span>{loading ? 'Invio in corso...' : 'Invia Messaggio'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
