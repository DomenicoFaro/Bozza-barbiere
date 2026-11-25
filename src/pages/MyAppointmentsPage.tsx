import React, { useState, useEffect } from 'react';
import { PageView, Appointment } from '../types';
import { StorageService } from '../services/storage';
import { BUSINESS_INFO } from '../data/initialData';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/AuthModal';
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
  HelpCircle,
  LogIn
} from 'lucide-react';

interface MyAppointmentsPageProps {
  onNavigate: (page: PageView) => void;
}

export const MyAppointmentsPage: React.FC<MyAppointmentsPageProps> = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<Appointment[]>([]);
  const [showManualSearch, setShowManualSearch] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Se il cliente è loggato, trova subito i suoi appuntamenti tramite il telefono del profilo
  useEffect(() => {
    if (user && profile?.phone) {
      StorageService.getAppointmentsByPhone(profile.phone).then(setResults);
      setHasSearched(true);
    }
  }, [user, profile]);

  // Cancellation Modal State
  const [cancellingAppointment, setCancellingAppointment] = useState<Appointment | null>(null);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null);

  // Reschedule Request Modal State
  const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);
  const [rescheduleNotes, setRescheduleNotes] = useState('');
  const [rescheduleSuccessMsg, setRescheduleSuccessMsg] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setHasSearched(true);
    setCancelSuccessMsg(null);
    setRescheduleSuccessMsg(null);

    // Se è un codice prenotazione (es. "GD-1234")
    if (query.toUpperCase().startsWith('GD-') || query.length === 4) {
      const byCode = await StorageService.getAppointmentByCode(query);
      setResults(byCode ? [byCode] : []);
    } else {
      // Ricerca per numero di telefono
      const byPhone = await StorageService.getAppointmentsByPhone(query);
      setResults(byPhone);
    }
  };

  const handleConfirmCancellation = async () => {
    if (!cancellingAppointment) return;

    const ok = await StorageService.cancelAppointmentAsGuest(cancellingAppointment.id, cancellingAppointment.customer_phone);
    if (!ok) {
      setCancellingAppointment(null);
      return;
    }

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
      <div className="max-w-3xl space-y-3 border-b border-[#2E2E2E] pb-6">
        <div className="inline-flex items-center space-x-2 text-[#F2EFEA]/70 font-bold text-[10px] uppercase tracking-[0.2em]">
          <BookmarkCheck className="w-3.5 h-3.5" />
          <span>Gestione Prenotazioni · Servizio Clienti</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-display uppercase tracking-wide font-light text-[#F2EFEA]">
          I Miei Appuntamenti
        </h1>
        <p className="text-sm text-[#F2EFEA]/70 leading-relaxed">
          {user
            ? 'Ecco gli appuntamenti collegati al tuo account.'
            : 'Accedi al tuo account per trovarli subito, oppure inserisci il numero di telefono o il codice prenotazione (es. GD-7319) ricevuto durante la conferma.'}
        </p>
      </div>

      {/* Feedback messages */}
      {cancelSuccessMsg && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-400 text-xs text-emerald-950 flex items-center space-x-3 rounded-none">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{cancelSuccessMsg}</span>
        </div>
      )}

      {rescheduleSuccessMsg && (
        <div className="p-4 bg-[#1C1C1C] border border-[#2E2E2E] text-xs text-[#F2EFEA] flex items-center space-x-3 rounded-none">
          <CheckCircle2 className="w-5 h-5 text-[#F2EFEA] shrink-0" />
          <span>{rescheduleSuccessMsg}</span>
        </div>
      )}

      {/* Se loggato: nessun box di ricerca, gli appuntamenti sono già mostrati sotto */}
      {!user && !showManualSearch && (
        <div className="bg-[#151515] rounded-none p-6 sm:p-8 border border-[#2E2E2E] text-center space-y-4">
          <LogIn className="w-8 h-8 mx-auto opacity-60" />
          <h3 className="font-display uppercase tracking-wide text-2xl font-light text-[#F2EFEA]">
            Accedi per vedere subito i tuoi appuntamenti
          </h3>
          <p className="text-xs text-[#F2EFEA]/70 max-w-md mx-auto">
            Se hai un account, effettua il login: troveremo automaticamente le tue prenotazioni collegate al tuo numero di telefono.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-3 rounded-none border border-[#C8102E] bg-[#C8102E] hover:bg-[#E3162F] text-white text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Accedi al mio account</span>
            </button>
            <button
              onClick={() => setShowManualSearch(true)}
              className="px-6 py-3 rounded-none border border-[#2E2E2E] text-[#F2EFEA] hover:bg-[#242424] text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Cerca con telefono o codice</span>
            </button>
          </div>
        </div>
      )}

      {!user && showManualSearch && (
        <div className="bg-[#151515] rounded-none p-6 sm:p-8 border border-[#2E2E2E]">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#F2EFEA]">
                Cerca tramite Telefono o Codice Prenotazione
              </label>
              <button
                type="button"
                onClick={() => setShowManualSearch(false)}
                className="text-[10px] uppercase tracking-wider font-bold text-[#F2EFEA]/60 hover:text-[#F2EFEA] underline"
              >
                Accedi invece
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#F2EFEA]/50 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Es. +39 340 1234567 oppure GD-7319"
                  className="w-full pl-10 pr-4 py-3 rounded-none border border-[#2E2E2E] text-xs focus:outline-none focus:ring-1 focus:ring-[#C8102E] bg-[#0B0B0B]"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-none border border-[#C8102E] bg-[#C8102E] hover:bg-[#E3162F] text-white text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Cerca Prenotazioni</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-[#F2EFEA]/60">
              <HelpCircle className="w-3.5 h-3.5 opacity-70" />
              <span>Suggerimento: se hai appena prenotato, cerca inserendo il numero di cellulare fornito.</span>
            </div>
          </form>
        </div>
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-[#2E2E2E] pb-3">
            <h2 className="font-display uppercase tracking-wide text-2xl font-light text-[#F2EFEA]">
              Risultati Trovati ({results.length})
            </h2>
            {results.length > 0 && (
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#F2EFEA]/60">
                Ordina per data più recente
              </span>
            )}
          </div>

          {results.length === 0 ? (
            <div className="bg-[#151515] rounded-none p-10 text-center border border-[#2E2E2E] space-y-4">
              <AlertCircle className="w-8 h-8 opacity-60 mx-auto" />
              <h3 className="font-display uppercase tracking-wide text-2xl font-light text-[#F2EFEA]">
                Nessun appuntamento trovato
              </h3>
              <p className="text-xs text-[#F2EFEA]/70 max-w-md mx-auto">
                Non risultano prenotazioni associate a "<strong>{searchQuery}</strong>". Verifica il numero o effettua una nuova prenotazione.
              </p>
              <button
                onClick={() => onNavigate('booking')}
                className="px-6 py-3 rounded-none border border-[#C8102E] bg-[#C8102E] hover:bg-[#E3162F] text-white text-[11px] font-bold uppercase tracking-wider"
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
                    className={`bg-[#151515] rounded-none p-6 border transition-all ${
                      isCancelled
                        ? 'border-rose-800 bg-rose-50/30 opacity-70'
                        : 'border-[#2E2E2E]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#F2EFEA]/15 pb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-[#F2EFEA] bg-[#1C1C1C] px-2.5 py-0.5 border border-[#2E2E2E]">
                            {apt.booking_code}
                          </span>
                          <span
                            className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border ${
                              isCancelled
                                ? 'bg-rose-900/40 text-rose-900 border-rose-800'
                                : isCompleted
                                ? 'bg-gray-100 text-gray-800 border-gray-300'
                                : 'bg-[#C8102E] text-white border-[#C8102E]'
                            }`}
                          >
                            {isCancelled ? 'Cancellato' : isCompleted ? 'Completato' : 'Confermato'}
                          </span>
                        </div>
                        <h3 className="font-display uppercase tracking-wide text-2xl font-light text-[#F2EFEA] mt-1">
                          {service?.name || 'Taglio o Cura Barba'}
                        </h3>
                      </div>

                      <div className="text-right">
                        <span className="text-3xl font-display uppercase tracking-wide font-light text-[#F2EFEA]">
                          €{service?.price}
                        </span>
                        <span className="block text-[10px] uppercase tracking-wider text-[#F2EFEA]/60">
                          {service?.duration_minutes} minuti
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 text-xs">
                      <div className="flex items-center space-x-2 text-[#F2EFEA]">
                        <Calendar className="w-3.5 h-3.5 opacity-70" />
                        <span>Data: <strong>{apt.appointment_date}</strong></span>
                      </div>
                      <div className="flex items-center space-x-2 text-[#F2EFEA]">
                        <Clock className="w-3.5 h-3.5 opacity-70" />
                        <span>Orario: <strong>{apt.start_time} – {apt.end_time}</strong></span>
                      </div>
                      <div className="flex items-center space-x-2 text-[#F2EFEA]">
                        <User className="w-3.5 h-3.5 opacity-70" />
                        <span>Parrucchiere: <strong>{operator?.name || 'Giuseppe'}</strong></span>
                      </div>
                    </div>

                    {apt.notes && (
                      <p className="text-xs text-[#F2EFEA]/70 bg-[#1C1C1C] p-3 border border-[#F2EFEA]/20 mb-4">
                        <strong className="text-[#F2EFEA]">Note:</strong> {apt.notes}
                      </p>
                    )}

                    {/* Actions Bar */}
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-[#F2EFEA]/15 items-center justify-between">
                      <div className="text-[11px] text-[#F2EFEA]/60">
                        Cliente: {apt.customer_name} ({apt.customer_phone})
                      </div>

                      <div className="flex items-center space-x-2">
                        {!isCancelled && !isCompleted && (
                          <>
                            <button
                              onClick={() => StorageService.downloadICalendar(apt)}
                              className="px-3 py-1.5 border border-[#2E2E2E] hover:bg-[#242424] text-[#F2EFEA] text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1"
                              title="Salva nel calendario del tuo smartphone o computer"
                            >
                              <Download className="w-3.5 h-3.5 opacity-70" />
                              <span>Calendario (.ics)</span>
                            </button>

                            <button
                              onClick={() => setRescheduleAppointment(apt)}
                              className="px-3 py-1.5 border border-[#2E2E2E] hover:bg-[#242424] text-[#F2EFEA] text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1"
                            >
                              <MessageSquare className="w-3.5 h-3.5 opacity-70" />
                              <span>Modifica orario</span>
                            </button>

                            <button
                              onClick={() => setCancellingAppointment(apt)}
                              className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/40 text-rose-400 border border-rose-800 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1"
                            >
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                              <span>Cancella</span>
                            </button>
                          </>
                        )}

                        {isCancelled && (
                          <span className="text-xs text-rose-400 italic font-display">
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
          <div className="bg-[#151515] rounded-none max-w-md w-full p-6 space-y-4 border border-[#2E2E2E] shadow-2xl">
            <div className="flex items-center space-x-3 text-rose-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-display uppercase tracking-wide text-xl font-light text-[#F2EFEA]">
                Vuoi davvero cancellare la prenotazione?
              </h3>
            </div>

            <p className="text-xs text-[#F2EFEA]/70 leading-relaxed">
              Stai per cancellare l'appuntamento <strong className="text-[#F2EFEA]">{cancellingAppointment.booking_code}</strong> per il giorno <strong className="text-[#F2EFEA]">{cancellingAppointment.appointment_date}</strong> alle ore <strong className="text-[#F2EFEA]">{cancellingAppointment.start_time}</strong>.
              Lo slot orario verrà immediatamente rimesso a disposizione degli altri clienti.
            </p>

            <div className="flex justify-end space-x-3 pt-3 border-t border-[#2E2E2E]">
              <button
                onClick={() => setCancellingAppointment(null)}
                className="px-4 py-2 border border-[#2E2E2E] text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] hover:bg-gray-100"
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
          <div className="bg-[#151515] rounded-none max-w-md w-full p-6 space-y-4 border border-[#2E2E2E] shadow-2xl">
            <div className="flex items-center space-x-3 text-[#F2EFEA]">
              <MessageSquare className="w-5 h-5 opacity-70" />
              <h3 className="font-display uppercase tracking-wide text-2xl font-light">
                Richiedi Modifica Orario
              </h3>
            </div>

            <p className="text-xs text-[#F2EFEA]/70">
              Prenotazione attuale: <strong>{rescheduleAppointment.booking_code}</strong> ({rescheduleAppointment.appointment_date} ore {rescheduleAppointment.start_time}).
            </p>

            <form onSubmit={handleSendRescheduleRequest} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] mb-1">
                  Indica la nuova data/orario desiderato:
                </label>
                <textarea
                  required
                  rows={3}
                  value={rescheduleNotes}
                  onChange={(e) => setRescheduleNotes(e.target.value)}
                  placeholder="Es. Vorrei spostare a giovedì pomeriggio dopo le 16:30..."
                  className="w-full p-3 rounded-none border border-[#2E2E2E] text-xs focus:outline-none focus:ring-1 focus:ring-[#C8102E] bg-[#0B0B0B]"
                />
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#2E2E2E]">
                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  className="text-[11px] text-[#F2EFEA] font-bold uppercase tracking-wider flex items-center gap-1 hover:underline"
                >
                  <Phone className="w-3 h-3" />
                  Oppure chiama
                </a>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setRescheduleAppointment(null)}
                    className="px-3.5 py-2 border border-[#2E2E2E] text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] hover:bg-gray-100"
                  >
                    Chiudi
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#C8102E] hover:bg-[#E3162F] text-white text-[10px] font-bold uppercase tracking-wider border border-[#C8102E]"
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
