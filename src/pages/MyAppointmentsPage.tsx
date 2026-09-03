import React, { useState } from 'react';
import { PageView, Appointment } from '../types';
import { StorageService } from '../services/storage';
import { BUSINESS_INFO } from '../data/initialData';
import { 
  BookmarkCheck, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  Scissors, 
  XCircle, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Phone, 
  MessageSquare,
  HelpCircle
} from 'lucide-react';

interface MyAppointmentsPageProps {
  onNavigate: (page: PageView) => void;
}

export const MyAppointmentsPage: React.FC<MyAppointmentsPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<Appointment[]>([]);
  
  // Cancellation Modal State
  const [cancellingAppointment, setCancellingAppointment] = useState<Appointment | null>(null);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null);

  // Reschedule Request Modal State
  const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);
  const [rescheduleNotes, setRescheduleNotes] = useState('');
  const [rescheduleSuccessMsg, setRescheduleSuccessMsg] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setHasSearched(true);
    setCancelSuccessMsg(null);
    setRescheduleSuccessMsg(null);

    // Se è un codice prenotazione (es. "DR-1234")
    if (query.toUpperCase().startsWith('DR-') || query.length === 4) {
      const byCode = StorageService.getAppointmentByCode(query);
      setResults(byCode ? [byCode] : []);
    } else {
      // Ricerca per numero di telefono
      const byPhone = StorageService.getAppointmentsByPhone(query);
      setResults(byPhone);
    }
  };

  const handleConfirmCancellation = () => {
    if (!cancellingAppointment) return;

    StorageService.updateAppointmentStatus(cancellingAppointment.id, 'cancelled');
    setCancelSuccessMsg(`L'appuntamento ${cancellingAppointment.booking_code} è stato cancellato. Lo slot orario è stato liberato con successo.`);
    
    // Aggiorna lista locale
    setResults(prev => prev.map(a => 
      a.id === cancellingAppointment.id ? { ...a, status: 'cancelled' } : a
    ));
    setCancellingAppointment(null);
  };

  const handleSendRescheduleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleAppointment) return;

    setRescheduleSuccessMsg(
      `La tua richiesta di modifica per l'appuntamento ${rescheduleAppointment.booking_code} è stata inoltrata al salone. Verrai ricontattato a breve al ${rescheduleAppointment.customer_phone}.`
    );
    setRescheduleAppointment(null);
    setRescheduleNotes('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Title */}
      <div className="max-w-3xl space-y-3 border-b border-[#1A1A1A] pb-6">
        <div className="inline-flex items-center space-x-2 text-[#1A1A1A]/70 font-bold text-[10px] uppercase tracking-[0.2em]">
          <BookmarkCheck className="w-3.5 h-3.5" />
          <span>Gestione Prenotazioni · Servizio Clienti</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif italic font-light text-[#1A1A1A] tracking-tight">
          I Miei Appuntamenti
        </h1>
        <p className="text-sm text-[#1A1A1A]/70 leading-relaxed">
          Inserisci il tuo numero di telefono o il codice prenotazione (es. <strong>DR-7319</strong>) ricevuto durante la conferma per visualizzare o gestire i tuoi appuntamenti.
        </p>
      </div>

      {/* Feedback messages */}
      {cancelSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-400 text-xs text-emerald-950 flex items-center space-x-3 rounded-none">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{cancelSuccessMsg}</span>
        </div>
      )}

      {rescheduleSuccessMsg && (
        <div className="p-4 bg-[#EFEDE9] border border-[#1A1A1A] text-xs text-[#1A1A1A] flex items-center space-x-3 rounded-none">
          <CheckCircle2 className="w-5 h-5 text-[#1A1A1A] shrink-0" />
          <span>{rescheduleSuccessMsg}</span>
        </div>
      )}

      {/* Search Box */}
      <div className="bg-white rounded-none p-6 sm:p-8 border border-[#1A1A1A]">
        <form onSubmit={handleSearch} className="space-y-4">
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
            Cerca tramite Telefono o Codice Prenotazione
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#1A1A1A]/50 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Es. +39 340 1234567 oppure DR-7319"
                className="w-full pl-10 pr-4 py-3 rounded-none border border-[#1A1A1A] text-xs focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] bg-[#FDFCFB]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-none border border-[#1A1A1A] bg-[#1A1A1A] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Cerca Prenotazioni</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-[#1A1A1A]/60">
            <HelpCircle className="w-3.5 h-3.5 opacity-70" />
            <span>Suggerimento: se hai appena prenotato, cerca inserendo il numero di cellulare fornito.</span>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-3">
            <h2 className="font-serif italic text-2xl font-light text-[#1A1A1A]">
              Risultati Trovati ({results.length})
            </h2>
            {results.length > 0 && (
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A]/60">
                Ordina per data più recente
              </span>
            )}
          </div>

          {results.length === 0 ? (
            <div className="bg-white rounded-none p-10 text-center border border-[#1A1A1A] space-y-4">
              <AlertCircle className="w-8 h-8 opacity-60 mx-auto" />
              <h3 className="font-serif italic text-2xl font-light text-[#1A1A1A]">
                Nessun appuntamento trovato
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 max-w-md mx-auto">
                Non risultano prenotazioni associate a "<strong>{searchQuery}</strong>". Verifica il numero o effettua una nuova prenotazione.
              </p>
              <button
                onClick={() => onNavigate('booking')}
                className="px-6 py-3 rounded-none border border-[#1A1A1A] bg-[#1A1A1A] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider"
              >
                Prenota ora
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((apt) => {
                const service = StorageService.getServiceById(apt.service_id);
                const operator = StorageService.getOperatorById(apt.operator_id);
                const isCancelled = apt.status === 'cancelled';
                const isCompleted = apt.status === 'completed';

                return (
                  <div
                    key={apt.id}
                    className={`bg-white rounded-none p-6 border transition-all ${
                      isCancelled
                        ? 'border-rose-300 bg-rose-50/30 opacity-70'
                        : 'border-[#1A1A1A]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#1A1A1A]/15 pb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-[#1A1A1A] bg-[#EFEDE9] px-2.5 py-0.5 border border-[#1A1A1A]">
                            {apt.booking_code}
                          </span>
                          <span
                            className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border ${
                              isCancelled
                                ? 'bg-rose-100 text-rose-900 border-rose-300'
                                : isCompleted
                                ? 'bg-gray-100 text-gray-800 border-gray-300'
                                : 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                            }`}
                          >
                            {isCancelled ? 'Cancellato' : isCompleted ? 'Completato' : 'Confermato'}
                          </span>
                        </div>
                        <h3 className="font-serif italic text-2xl font-light text-[#1A1A1A] mt-1">
                          {service?.name || 'Taglio o Cura Barba'}
                        </h3>
                      </div>

                      <div className="text-right">
                        <span className="text-3xl font-serif italic font-light text-[#1A1A1A]">
                          €{service?.price}
                        </span>
                        <span className="block text-[10px] uppercase tracking-wider text-[#1A1A1A]/60">
                          {service?.duration_minutes} minuti
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 text-xs">
                      <div className="flex items-center space-x-2 text-[#1A1A1A]">
                        <Calendar className="w-3.5 h-3.5 opacity-70" />
                        <span>Data: <strong>{apt.appointment_date}</strong></span>
                      </div>
                      <div className="flex items-center space-x-2 text-[#1A1A1A]">
                        <Clock className="w-3.5 h-3.5 opacity-70" />
                        <span>Orario: <strong>{apt.start_time} – {apt.end_time}</strong></span>
                      </div>
                      <div className="flex items-center space-x-2 text-[#1A1A1A]">
                        <User className="w-3.5 h-3.5 opacity-70" />
                        <span>Barbiere: <strong>{operator?.name || 'Master Barber'}</strong></span>
                      </div>
                    </div>

                    {apt.notes && (
                      <p className="text-xs text-[#1A1A1A]/70 bg-[#EFEDE9] p-3 border border-[#1A1A1A]/20 mb-4">
                        <strong className="text-[#1A1A1A]">Note:</strong> {apt.notes}
                      </p>
                    )}

                    {/* Actions Bar */}
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-[#1A1A1A]/15 items-center justify-between">
                      <div className="text-[11px] text-[#1A1A1A]/60">
                        Cliente: {apt.customer_name} ({apt.customer_phone})
                      </div>

                      <div className="flex items-center space-x-2">
                        {!isCancelled && !isCompleted && (
                          <>
                            <button
                              onClick={() => StorageService.downloadICalendar(apt)}
                              className="px-3 py-1.5 border border-[#1A1A1A] hover:bg-[#EFEDE9] text-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1"
                              title="Salva nel calendario del tuo smartphone o computer"
                            >
                              <Download className="w-3.5 h-3.5 opacity-70" />
                              <span>Calendario (.ics)</span>
                            </button>

                            <button
                              onClick={() => setRescheduleAppointment(apt)}
                              className="px-3 py-1.5 border border-[#1A1A1A] hover:bg-[#EFEDE9] text-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1"
                            >
                              <MessageSquare className="w-3.5 h-3.5 opacity-70" />
                              <span>Modifica orario</span>
                            </button>

                            <button
                              onClick={() => setCancellingAppointment(apt)}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1"
                            >
                              <XCircle className="w-3.5 h-3.5 text-rose-700" />
                              <span>Cancella</span>
                            </button>
                          </>
                        )}

                        {isCancelled && (
                          <span className="text-xs text-rose-700 italic font-serif">
                            Prenotazione annullata — slot orario liberato.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODALE DI CONFERMA CANCELLAZIONE (FASE 5) */}
      {cancellingAppointment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-none max-w-md w-full p-6 space-y-4 border border-[#1A1A1A] shadow-2xl">
            <div className="flex items-center space-x-3 text-rose-700">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-serif italic text-xl font-light text-[#1A1A1A]">
                Vuoi davvero cancellare la prenotazione?
              </h3>
            </div>

            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
              Stai per cancellare l'appuntamento <strong className="text-[#1A1A1A]">{cancellingAppointment.booking_code}</strong> per il giorno <strong className="text-[#1A1A1A]">{cancellingAppointment.appointment_date}</strong> alle ore <strong className="text-[#1A1A1A]">{cancellingAppointment.start_time}</strong>.
              Lo slot orario verrà immediatamente rimesso a disposizione degli altri clienti.
            </p>

            <div className="flex justify-end space-x-3 pt-3 border-t border-[#1A1A1A]">
              <button
                onClick={() => setCancellingAppointment(null)}
                className="px-4 py-2 border border-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] hover:bg-gray-100"
              >
                Annulla operazione
              </button>
              <button
                onClick={handleConfirmCancellation}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-[10px] font-bold uppercase tracking-wider border border-rose-800"
              >
                Conferma Cancellazione
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE RICHIESTA MODIFICA (FASE 5) */}
      {rescheduleAppointment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-none max-w-md w-full p-6 space-y-4 border border-[#1A1A1A] shadow-2xl">
            <div className="flex items-center space-x-3 text-[#1A1A1A]">
              <MessageSquare className="w-5 h-5 opacity-70" />
              <h3 className="font-serif italic text-2xl font-light">
                Richiedi Modifica Orario
              </h3>
            </div>

            <p className="text-xs text-[#1A1A1A]/70">
              Prenotazione attuale: <strong>{rescheduleAppointment.booking_code}</strong> ({rescheduleAppointment.appointment_date} ore {rescheduleAppointment.start_time}).
            </p>

            <form onSubmit={handleSendRescheduleRequest} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                  Indica la nuova data/orario desiderato:
                </label>
                <textarea
                  required
                  rows={3}
                  value={rescheduleNotes}
                  onChange={(e) => setRescheduleNotes(e.target.value)}
                  placeholder="Es. Vorrei spostare a giovedì pomeriggio dopo le 16:30..."
                  className="w-full p-3 rounded-none border border-[#1A1A1A] text-xs focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] bg-[#FDFCFB]"
                />
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#1A1A1A]">
                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  className="text-[11px] text-[#1A1A1A] font-bold uppercase tracking-wider flex items-center gap-1 hover:underline"
                >
                  <Phone className="w-3 h-3" />
                  Oppure chiama
                </a>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setRescheduleAppointment(null)}
                    className="px-3.5 py-2 border border-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] hover:bg-gray-100"
                  >
                    Chiudi
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider border border-[#1A1A1A]"
                  >
                    Invia richiesta
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
