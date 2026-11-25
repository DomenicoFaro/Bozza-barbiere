import React, { useState, useEffect } from 'react';
import { PageView, Appointment, Service, Operator, BusinessHours, Closure } from '../types';
import { StorageService, getFormattedDate, timeToMinutes, minutesToTime } from '../services/storage';
import { BrandLogo } from '../components/BrandLogo';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/AuthModal';
import {
  ShieldCheck,
  Calendar,
  Clock,
  User,
  Scissors,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Lock,
  LogOut,
  Filter,
  Ban,
  Check,
  ShieldAlert,
  Phone,
  RefreshCw,
  Sliders,
  DollarSign
} from 'lucide-react';

interface AdminPageProps {
  onNavigate: (page: PageView) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  // Auth state (vero account Supabase con permesso is_admin)
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Tab State: 'agenda' | 'appointments' | 'services' | 'operators' | 'hours'
  const [activeTab, setActiveTab] = useState<'agenda' | 'appointments' | 'services' | 'operators' | 'hours'>('agenda');

  // Agenda Filters
  const [selectedDate, setSelectedDate] = useState<string>(getFormattedDate(0));
  const [filterOperator, setFilterOperator] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Refresh trigger
  const [tick, setTick] = useState(0);
  const triggerRefresh = () => setTick(t => t + 1);

  // Modals
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);
  const [isClosureModalOpen, setIsClosureModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);

  // Manual Booking Form State
  const [manualClientName, setManualClientName] = useState('');
  const [manualClientPhone, setManualClientPhone] = useState('+39 ');
  const [manualServiceId, setManualServiceId] = useState('');
  const [manualOperatorId, setManualOperatorId] = useState('');
  const [manualDate, setManualDate] = useState(getFormattedDate(0));
  const [manualTime, setManualTime] = useState('09:00');
  const [manualNotes, setManualNotes] = useState('');
  const [manualError, setManualError] = useState<string | null>(null);

  // Closure Form State
  const [closureDate, setClosureDate] = useState(getFormattedDate(0));
  const [closureOperatorId, setClosureOperatorId] = useState<string>('all'); // 'all' or specific op
  const [closureReason, setClosureReason] = useState('');

  // Fetch live storage data
  const services = StorageService.getServices();
  const operators = StorageService.getOperators();
  const businessHours = StorageService.getBusinessHours();
  const closures = StorageService.getClosures();

  // Appuntamenti: caricati da Supabase (condivisi tra tutti i dispositivi)
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin) return;
    let active = true;
    setAppointmentsLoading(true);
    StorageService.getAppointments().then(data => {
      if (active) {
        setAllAppointments(data);
        setAppointmentsLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [user, isAdmin, tick]);

  const handleLogout = () => {
    signOut();
  };

  // Add Manual Appointment
  const handleCreateManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualError(null);

    if (!manualClientName || !manualClientPhone || !manualServiceId || !manualOperatorId) {
      setManualError('Compila tutti i campi obbligatori.');
      return;
    }

    const result = await StorageService.createAppointment({
      serviceId: manualServiceId,
      operatorId: manualOperatorId,
      date: manualDate,
      startTime: manualTime,
      customerName: manualClientName,
      customerPhone: manualClientPhone,
      notes: manualNotes ? `[Prenotazione manuale] ${manualNotes}` : '[Prenotazione manuale / telefonica]',
    });

    if (result.success) {
      setIsManualBookingOpen(false);
      setManualClientName('');
      setManualClientPhone('+39 ');
      setManualNotes('');
      triggerRefresh();
    } else {
      setManualError(result.error || 'Errore nella creazione dell\'appuntamento.');
    }
  };

  // Add Closure / Block
  const handleAddClosure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!closureDate || !closureReason) return;

    StorageService.addClosure({
      date: closureDate,
      operator_id: closureOperatorId === 'all' ? null : closureOperatorId,
      reason: closureReason,
    });

    setIsClosureModalOpen(false);
    setClosureReason('');
    triggerRefresh();
  };

  // Filtered Appointments for the day
  const dayAppointments = allAppointments.filter(a => {
    const matchDate = a.appointment_date === selectedDate;
    const matchOp = filterOperator === 'all' || a.operator_id === filterOperator;
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchDate && matchOp && matchStatus;
  });

  // Calculate statistics for selected date
  const activeDayAppointments = allAppointments.filter(a => a.appointment_date === selectedDate && a.status !== 'cancelled');
  const totalRevenueEst = activeDayAppointments.reduce((sum, a) => {
    const srv = StorageService.getServiceById(a.service_id);
    return sum + (srv ? srv.price : 0);
  }, 0);

  // Time grid slots (08:30 to 20:30 every 30 minutes)
  const timeGridRows: string[] = [];
  for (let m = timeToMinutes('08:30'); m <= timeToMinutes('20:00'); m += 30) {
    timeGridRows.push(minutesToTime(m));
  }

  // =========================================================================
  // LOADING SCREEN
  // =========================================================================
  if (authLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <RefreshCw className="w-6 h-6 mx-auto animate-spin text-[#F2EFEA]/50" />
      </div>
    );
  }

  // =========================================================================
  // LOGIN SCREEN (nessun utente Supabase collegato)
  // =========================================================================
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-[#151515] rounded-none p-8 border border-[#2E2E2E] shadow-none space-y-6 text-center">
          <BrandLogo size="lg" className="mx-auto" />
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2EFEA] block">
              Area Riservata
            </span>
            <h1 className="text-3xl font-display uppercase tracking-wide font-light text-[#F2EFEA]">
              Pannello Gestione Titolare
            </h1>
            <p className="text-xs text-[#9A9A9A]">
              Accedi con il tuo account per gestire agenda, servizi, orari e appuntamenti. Solo gli account abilitati come amministratore possono entrare.
            </p>
          </div>

          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full py-3 rounded-none bg-[#C8102E] hover:bg-[#E3162F] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
          >
            <Lock className="w-4 h-4 text-white" />
            <span>Accedi al Pannello</span>
          </button>
        </div>

        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </div>
    );
  }

  // =========================================================================
  // ACCESSO NEGATO (utente loggato ma senza permesso is_admin)
  // =========================================================================
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-[#151515] rounded-none p-8 border border-[#2E2E2E] shadow-none space-y-6 text-center">
          <ShieldAlert className="w-10 h-10 mx-auto text-rose-400" />
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400 block">
              Accesso Negato
            </span>
            <h1 className="text-2xl font-display uppercase tracking-wide font-light text-[#F2EFEA]">
              Questo account non è amministratore
            </h1>
            <p className="text-xs text-[#9A9A9A]">
              L'account {user.email} non ha i permessi per accedere al pannello di gestione. Contatta il titolare per essere abilitato.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-none border border-[#2E2E2E] text-[#F2EFEA] hover:bg-[#242424] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Esci e prova con un altro account</span>
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED ADMIN PANEL
  // =========================================================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Admin Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#151515] p-6 rounded-none border border-[#2E2E2E]">
        <div className="flex items-center space-x-4">
          <BrandLogo size="md" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2EFEA]">
                Pannello Controllo
              </span>
              <span className="px-2 py-0.5 rounded-none bg-emerald-900/40 text-emerald-400 text-[10px] font-bold tracking-wider uppercase border border-emerald-700">
                Titolare Attivo
              </span>
            </div>
            <h1 className="text-3xl font-display uppercase tracking-wide font-light text-[#F2EFEA]">
              Agenda & Gestione Salone
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-end md:self-auto">
          <button
            onClick={() => setIsManualBookingOpen(true)}
            className="px-4 py-2.5 rounded-none bg-[#C8102E] hover:bg-[#E3162F] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 border border-[#C8102E]"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Nuovo Appuntamento</span>
          </button>

          <button
            onClick={() => setIsClosureModalOpen(true)}
            className="px-3.5 py-2.5 rounded-none bg-[#151515] hover:bg-rose-950/40 text-rose-400 border border-rose-800 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5"
          >
            <Ban className="w-3.5 h-3.5 text-rose-400" />
            <span>Blocca Slot / Ferie</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2.5 rounded-none bg-[#C8102E] hover:bg-[#E3162F] text-white border border-[#2E2E2E]"
            title="Esci dall'area admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-[#2E2E2E] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('agenda')}
          className={`px-4 py-2.5 rounded-none text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center space-x-1.5 border ${
            activeTab === 'agenda'
              ? 'bg-[#C8102E] text-white border-[#C8102E]'
              : 'bg-[#151515] text-[#9A9A9A] hover:text-[#F2EFEA] border-[#2E2E2E]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Agenda Giornaliera (Colonne Barbieri)</span>
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2.5 rounded-none text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center space-x-1.5 border ${
            activeTab === 'appointments'
              ? 'bg-[#C8102E] text-white border-[#C8102E]'
              : 'bg-[#151515] text-[#9A9A9A] hover:text-[#F2EFEA] border-[#2E2E2E]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Tutti gli Appuntamenti ({allAppointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2.5 rounded-none text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center space-x-1.5 border ${
            activeTab === 'services'
              ? 'bg-[#C8102E] text-white border-[#C8102E]'
              : 'bg-[#151515] text-[#9A9A9A] hover:text-[#F2EFEA] border-[#2E2E2E]'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Gestione Servizi & Prezzi ({services.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('operators')}
          className={`px-4 py-2.5 rounded-none text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center space-x-1.5 border ${
            activeTab === 'operators'
              ? 'bg-[#C8102E] text-white border-[#C8102E]'
              : 'bg-[#151515] text-[#9A9A9A] hover:text-[#F2EFEA] border-[#2E2E2E]'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Operatori & Staff ({operators.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hours')}
          className={`px-4 py-2.5 rounded-none text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center space-x-1.5 border ${
            activeTab === 'hours'
              ? 'bg-[#C8102E] text-white border-[#C8102E]'
              : 'bg-[#151515] text-[#9A9A9A] hover:text-[#F2EFEA] border-[#2E2E2E]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Orari & Chiusure</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: AGENDA GIORNALIERA (FASE 6 REQUIREMENT: COLONNE PER OPERATORE) */}
      {/* ========================================================================= */}
      {activeTab === 'agenda' && (
        <div className="space-y-6">
          {/* Controls & Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Date selector */}
            <div className="bg-[#151515] p-4 rounded-none border border-[#2E2E2E]">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9A9A9A] mb-1">
                Data Selezionata
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full text-xs font-bold text-[#F2EFEA] focus:outline-none bg-transparent"
              />
            </div>

            {/* Quick date switches */}
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedDate(getFormattedDate(0))}
                className="flex-1 py-3 px-3 rounded-none bg-[#151515] border border-[#2E2E2E] text-xs font-bold uppercase tracking-wider text-[#F2EFEA] hover:bg-[#242424]"
              >
                Oggi
              </button>
              <button
                onClick={() => setSelectedDate(getFormattedDate(1))}
                className="flex-1 py-3 px-3 rounded-none bg-[#151515] border border-[#2E2E2E] text-xs font-bold uppercase tracking-wider text-[#F2EFEA] hover:bg-[#242424]"
              >
                Domani
              </button>
            </div>

            {/* Stat: Appuntamenti */}
            <div className="bg-[#151515] p-4 rounded-none border border-[#2E2E2E]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#9A9A9A] block">
                Appuntamenti Giornata
              </span>
              <span className="text-2xl font-display uppercase tracking-wide font-light text-[#F2EFEA]">
                {activeDayAppointments.length} clienti
              </span>
            </div>

            {/* Stat: Incasso Stimato */}
            <div className="bg-[#151515] p-4 rounded-none border border-[#2E2E2E]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#9A9A9A] block">
                Incasso Stimato
              </span>
              <span className="text-2xl font-display uppercase tracking-wide font-light text-[#F2EFEA]">
                €{totalRevenueEst}
              </span>
            </div>
          </div>

          {/* Agenda Grid: Columns for each operator */}
          <div className="bg-[#151515] rounded-none border border-[#2E2E2E] overflow-x-auto">
            <div className="min-w-[768px]">
              {/* Header Columns */}
              <div className="grid grid-cols-12 border-b border-[#2E2E2E] bg-[#1C1C1C] p-3 text-xs font-bold uppercase tracking-wider text-[#F2EFEA]">
                <div className="col-span-2 text-center text-[#9A9A9A]">Orario</div>
                {operators.map((op) => (
                  <div key={op.id} className="col-span-3 text-center flex items-center justify-center space-x-2">
                    <img
                      src={op.photo_url}
                      alt={op.name}
                      className="w-5 h-5 rounded-full object-cover border border-[#2E2E2E]"
                    />
                    <span className="font-display uppercase tracking-wide capitalize text-sm">{op.name}</span>
                  </div>
                ))}
                <div className="col-span-1 text-center text-[10px] text-[#9A9A9A]">Note</div>
              </div>

              {/* Time slot rows */}
              <div className="divide-y divide-[#2E2E2E]/15 text-xs">
                {timeGridRows.map((timeStr) => {
                  return (
                    <div key={timeStr} className="grid grid-cols-12 min-h-[58px] items-stretch hover:bg-[#0B0B0B] transition-colors">
                      {/* Time label */}
                      <div className="col-span-2 flex items-center justify-center font-mono font-bold text-[#9A9A9A] bg-[#1C1C1C]/40 border-r border-[#F2EFEA]/20">
                        {timeStr}
                      </div>

                      {/* Operator Columns */}
                      {operators.map((op) => {
                        // Cerca appuntamento per questo operatore a quest'ora
                        const apt = allAppointments.find(a => 
                          a.operator_id === op.id && 
                          a.appointment_date === selectedDate && 
                          a.status !== 'cancelled' &&
                          a.start_time === timeStr
                        );

                        // Cerca chiusura per questo operatore
                        const closure = closures.find(c => 
                          c.date === selectedDate && 
                          (c.operator_id === null || c.operator_id === op.id)
                        );

                        return (
                          <div key={op.id} className="col-span-3 p-1.5 border-r border-[#F2EFEA]/20 flex flex-col justify-center">
                            {apt ? (
                              <div
                                className={`p-2.5 rounded-none border text-[11px] relative group ${
                                  apt.status === 'completed'
                                    ? 'bg-gray-100 border-gray-400 text-gray-800'
                                    : 'bg-[#0B0B0B] border-[#2E2E2E] text-[#F2EFEA]'
                                }`}
                              >
                                <div className="flex justify-between items-start font-bold">
                                  <span className="font-display uppercase tracking-wide text-xs">{apt.customer_name}</span>
                                  <span className="font-mono text-[9px] bg-[#151515] px-1 border border-[#2E2E2E]">
                                    {apt.booking_code}
                                  </span>
                                </div>
                                <div className="text-[10px] text-[#9A9A9A] mt-0.5">
                                  {StorageService.getServiceById(apt.service_id)?.name} ({apt.start_time} - {apt.end_time})
                                </div>
                                <div className="text-[10px] text-[#F2EFEA] font-medium flex items-center gap-1 mt-1">
                                  <Phone className="w-2.5 h-2.5 text-[#F2EFEA]" />
                                  <span>{apt.customer_phone}</span>
                                </div>

                                {/* Quick actions on hover */}
                                <div className="mt-1 pt-1 border-t border-[#F2EFEA]/20 flex justify-end space-x-1 opacity-90">
                                  {apt.status !== 'completed' && (
                                    <button
                                      onClick={async () => {
                                        await StorageService.adminUpdateAppointmentStatus(apt.id, 'completed');
                                        triggerRefresh();
                                      }}
                                      className="px-1.5 py-0.5 rounded-none bg-[#C8102E] hover:bg-[#E3162F] text-white text-[9px] font-bold uppercase tracking-wider"
                                      title="Segna come completato"
                                    >
                                      ✓ Completa
                                    </button>
                                  )}
                                  <button
                                    onClick={async () => {
                                      if (confirm(`Cancellare appuntamento per ${apt.customer_name}?`)) {
                                        await StorageService.adminUpdateAppointmentStatus(apt.id, 'cancelled');
                                        triggerRefresh();
                                      }
                                    }}
                                    className="px-1.5 py-0.5 rounded-none bg-rose-950/40 hover:bg-rose-900/40 text-rose-400 text-[9px] border border-rose-800 uppercase font-bold"
                                    title="Cancella appuntamento"
                                  >
                                    Cancella
                                  </button>
                                </div>
                              </div>
                            ) : closure ? (
                              <div className="p-2 rounded-none bg-rose-950/40 text-rose-400 text-[10px] italic border border-rose-800">
                                Chiuso: {closure.reason || 'Ferie/Pausa'}
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setManualOperatorId(op.id);
                                  setManualTime(timeStr);
                                  setManualDate(selectedDate);
                                  setIsManualBookingOpen(true);
                                }}
                                className="w-full h-full min-h-[36px] rounded-none border border-dashed border-[#F2EFEA]/30 hover:border-[#C8102E] hover:bg-[#242424] text-[#9A9A9A] hover:text-[#F2EFEA] flex items-center justify-center text-[10px] font-bold uppercase tracking-wider transition-colors"
                              >
                                + Libero
                              </button>
                            )}
                          </div>
                        );
                      })}

                      {/* Side note column */}
                      <div className="col-span-1 flex items-center justify-center text-[10px] text-[#9A9A9A]/50">
                        •
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TUTTI GLI APPUNTAMENTI (LISTA / TABELLA) */}
      {/* ========================================================================= */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <div className="bg-[#151515] p-4 rounded-none border border-[#2E2E2E] flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#F2EFEA]">Filtra per:</span>

              <select
                value={filterOperator}
                onChange={(e) => setFilterOperator(e.target.value)}
                className="text-xs px-3 py-2 rounded-none border border-[#2E2E2E] bg-[#0B0B0B]"
              >
                <option value="all">Tutti i parrucchieri</option>
                {operators.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs px-3 py-2 rounded-none border border-[#2E2E2E] bg-[#0B0B0B]"
              >
                <option value="all">Tutti gli stati</option>
                <option value="confirmed">Confermati</option>
                <option value="completed">Completati</option>
                <option value="cancelled">Cancellati</option>
              </select>
            </div>

            <span className="text-xs text-[#9A9A9A]">
              {allAppointments.length} record totali nel database
            </span>
          </div>

          <div className="bg-[#151515] rounded-none border border-[#2E2E2E] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1C1C1C] text-[#F2EFEA] font-bold uppercase tracking-wider text-[10px] border-b border-[#2E2E2E]">
                  <tr>
                    <th className="p-3.5">Codice</th>
                    <th className="p-3.5">Cliente & Telefono</th>
                    <th className="p-3.5">Servizio</th>
                    <th className="p-3.5">Parrucchiere</th>
                    <th className="p-3.5">Data & Ora</th>
                    <th className="p-3.5">Stato</th>
                    <th className="p-3.5 text-right">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2E2E2E]/15">
                  {allAppointments
                    .filter(a => (filterOperator === 'all' || a.operator_id === filterOperator) && (filterStatus === 'all' || a.status === filterStatus))
                    .map((apt) => {
                      const srv = StorageService.getServiceById(apt.service_id);
                      const op = StorageService.getOperatorById(apt.operator_id);
                      return (
                        <tr key={apt.id} className="hover:bg-[#0B0B0B] transition-colors">
                          <td className="p-3.5 font-mono font-bold text-[#F2EFEA]">
                            {apt.booking_code}
                          </td>
                          <td className="p-3.5">
                            <span className="font-display uppercase tracking-wide text-sm text-[#F2EFEA] block">{apt.customer_name}</span>
                            <span className="text-[#9A9A9A]">{apt.customer_phone}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold text-[#F2EFEA]">{srv?.name || 'Servizio'}</span>
                            <span className="text-[11px] text-[#9A9A9A] block">€{srv?.price} • {srv?.duration_minutes}m</span>
                          </td>
                          <td className="p-3.5 font-display uppercase tracking-wide text-sm text-[#F2EFEA]">
                            {op?.name || 'Non assegnato'}
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold text-[#F2EFEA] block">{apt.appointment_date}</span>
                            <span className="text-[#9A9A9A]">{apt.start_time} - {apt.end_time}</span>
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded-none text-[10px] font-bold uppercase tracking-wider border ${
                                apt.status === 'confirmed'
                                  ? 'bg-emerald-900/40 text-emerald-400 border-emerald-700'
                                  : apt.status === 'completed'
                                  ? 'bg-gray-100 text-gray-800 border-gray-300'
                                  : 'bg-rose-900/40 text-rose-400 border-rose-800'
                              }`}
                            >
                              {apt.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            {apt.status === 'confirmed' && (
                              <button
                                onClick={async () => {
                                  await StorageService.adminUpdateAppointmentStatus(apt.id, 'completed');
                                  triggerRefresh();
                                }}
                                className="px-2.5 py-1 rounded-none bg-[#C8102E] text-white font-bold uppercase tracking-wider text-[9px]"
                              >
                                Completa
                              </button>
                            )}
                            {apt.status !== 'cancelled' && (
                              <button
                                onClick={async () => {
                                  await StorageService.adminUpdateAppointmentStatus(apt.id, 'cancelled');
                                  triggerRefresh();
                                }}
                                className="px-2.5 py-1 rounded-none bg-rose-950/40 text-rose-400 font-bold uppercase tracking-wider text-[9px] border border-rose-800"
                              >
                                Cancella
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: GESTIONE CRUD SERVIZI (FASE 6 REQUIREMENT) */}
      {/* ========================================================================= */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-display uppercase tracking-wide text-2xl font-light text-[#F2EFEA]">
                Listino Servizi & Tariffe
              </h2>
              <p className="text-xs text-[#9A9A9A]">
                Modifica prezzi, durate o crea nuovi trattamenti per il salone.
              </p>
            </div>
            <button
              onClick={() => setIsNewServiceModalOpen(true)}
              className="px-4 py-2.5 rounded-none bg-[#C8102E] hover:bg-[#E3162F] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 border border-[#C8102E]"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Aggiungi Servizio</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-[#151515] rounded-none p-6 border border-[#2E2E2E] space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2EFEA] bg-[#1C1C1C] px-2 py-0.5 border border-[#2E2E2E]">
                      {service.category}
                    </span>
                    <h3 className="font-display uppercase tracking-wide font-light text-xl text-[#F2EFEA] mt-2">
                      {service.name}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-display uppercase tracking-wide font-light text-[#F2EFEA]">
                      €{service.price}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#9A9A9A] line-clamp-3">
                  {service.description}
                </p>

                <div className="flex justify-between items-center pt-3 border-t border-[#F2EFEA]/20 text-xs text-[#9A9A9A]">
                  <span className="flex items-center gap-1 font-bold uppercase text-[10px] tracking-wider text-[#F2EFEA]">
                    <Clock className="w-3.5 h-3.5 text-[#F2EFEA]" />
                    {service.duration_minutes} min
                  </span>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${service.active ? 'bg-emerald-900/40 text-emerald-400 border-emerald-700' : 'bg-rose-900/40 text-rose-900 border-rose-800'}`}>
                    {service.active ? 'Attivo' : 'Disattivato'}
                  </span>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => setEditingService(service)}
                    className="flex-1 py-2 rounded-none border border-[#2E2E2E] hover:bg-[#242424] text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] flex items-center justify-center space-x-1"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#F2EFEA]" />
                    <span>Modifica</span>
                  </button>

                  <button
                    onClick={() => {
                      StorageService.updateService({ ...service, active: !service.active });
                      triggerRefresh();
                    }}
                    className={`px-3 py-2 rounded-none text-[10px] font-bold uppercase tracking-wider border ${
                      service.active
                        ? 'border-rose-800 text-rose-400 hover:bg-rose-950/40'
                        : 'border-emerald-700 text-emerald-400 hover:bg-emerald-950/40'
                    }`}
                  >
                    {service.active ? 'Disattiva' : 'Attiva'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: GESTIONE OPERATORI (FASE 6 REQUIREMENT) */}
      {/* ========================================================================= */}
      {activeTab === 'operators' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-display uppercase tracking-wide text-2xl font-light text-[#F2EFEA]">
                Team & Operatori Salone
              </h2>
              <p className="text-xs text-[#9A9A9A]">
                Configura i parrucchieri abilitati e i servizi che ciascuno può eseguire.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {operators.map((op) => (
              <div
                key={op.id}
                className="bg-[#151515] rounded-none p-6 border border-[#2E2E2E] space-y-4 text-center"
              >
                <img
                  src={op.photo_url}
                  alt={op.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto border border-[#2E2E2E]"
                />

                <div>
                  <h3 className="font-display uppercase tracking-wide font-light text-xl text-[#F2EFEA]">
                    {op.name}
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#F2EFEA] mt-1">
                    {op.role}
                  </p>
                  <p className="text-xs text-[#9A9A9A] mt-2">
                    {op.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F2EFEA]/20 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#9A9A9A] block mb-2">
                    Servizi Assegnati:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {StorageService.getOperatorServices()
                      .filter(m => m.operator_id === op.id)
                      .map(m => {
                        const s = StorageService.getServiceById(m.service_id);
                        return s ? (
                          <span key={m.service_id} className="text-[10px] bg-[#1C1C1C] border border-[#2E2E2E] px-1.5 py-0.5 text-[#F2EFEA] font-medium">
                            {s.name}
                          </span>
                        ) : null;
                      })}
                  </div>
                </div>

                <button
                  onClick={() => setEditingOperator(op)}
                  className="w-full py-2.5 rounded-none border border-[#2E2E2E] hover:bg-[#242424] text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] flex items-center justify-center space-x-1 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#F2EFEA]" />
                  <span>Modifica Ruolo & Bio</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: ORARI E CHIUSURE (FASE 6 REQUIREMENT) */}
      {/* ========================================================================= */}
      {activeTab === 'hours' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Orari settimanali */}
          <div className="bg-[#151515] rounded-none p-6 border border-[#2E2E2E] space-y-4">
            <h3 className="font-display uppercase tracking-wide font-light text-xl text-[#F2EFEA] border-b border-[#2E2E2E] pb-3">
              Orari Settimanali Ufficiali
            </h3>
            <div className="space-y-3 text-xs">
              {businessHours.map((h) => (
                <div key={h.id} className="flex justify-between items-center py-2.5 border-b border-[#F2EFEA]/10">
                  <span className="font-bold uppercase tracking-wider text-[11px] text-[#F2EFEA] w-28">{h.day_name}</span>
                  <span>
                    {h.is_closed ? (
                      <span className="text-rose-400 font-bold uppercase text-[10px] tracking-wider">Chiuso</span>
                    ) : (
                      <span className="font-medium text-[#F2EFEA]">{h.open_time} – {h.close_time}</span>
                    )}
                  </span>
                  <button
                    onClick={() => {
                      const updated = businessHours.map(bh => 
                        bh.id === h.id ? { ...bh, is_closed: !bh.is_closed } : bh
                      );
                      StorageService.saveBusinessHours(updated);
                      triggerRefresh();
                    }}
                    className="text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] hover:underline"
                  >
                    {h.is_closed ? 'Imposta Aperto' : 'Imposta Chiuso'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Chiusure straordinarie / Ferie */}
          <div className="bg-[#151515] rounded-none p-6 border border-[#2E2E2E] space-y-4">
            <div className="flex justify-between items-center border-b border-[#2E2E2E] pb-3">
              <h3 className="font-display uppercase tracking-wide font-light text-xl text-[#F2EFEA]">
                Chiusure Straordinarie & Ferie
              </h3>
              <button
                onClick={() => setIsClosureModalOpen(true)}
                className="px-3 py-1.5 rounded-none bg-[#C8102E] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-[#E3162F]"
              >
                <Plus className="w-3 h-3" />
                Aggiungi
              </button>
            </div>

            {closures.length === 0 ? (
              <p className="text-xs text-[#9A9A9A]">Nessuna chiusura programmata.</p>
            ) : (
              <div className="space-y-3 text-xs">
                {closures.map((c) => (
                  <div key={c.id} className="flex justify-between items-center p-3.5 rounded-none bg-[#0B0B0B] border border-[#2E2E2E]">
                    <div>
                      <span className="font-bold text-[#F2EFEA] block">{c.date}</span>
                      <span className="text-[#9A9A9A] text-[11px]">
                        {c.reason} {c.operator_id ? `(${StorageService.getOperatorById(c.operator_id)?.name})` : '(Tutto il salone)'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        StorageService.deleteClosure(c.id);
                        triggerRefresh();
                      }}
                      className="text-rose-400 hover:text-rose-900 p-1"
                      title="Elimina chiusura"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALE: NUOVO APPUNTAMENTO MANUALE (FASE 6 REQUIREMENT) */}
      {/* ========================================================================= */}
      {isManualBookingOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151515] rounded-none max-w-lg w-full p-6 sm:p-8 space-y-4 border border-[#2E2E2E] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#2E2E2E] pb-3">
              <h3 className="font-display uppercase tracking-wide font-light text-2xl text-[#F2EFEA]">
                Nuovo Appuntamento Manuale
              </h3>
              <button
                onClick={() => setIsManualBookingOpen(false)}
                className="text-[#F2EFEA] hover:text-black font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {manualError && (
              <div className="p-3 rounded-none bg-rose-950/40 text-rose-400 text-xs border border-rose-800">
                {manualError}
              </div>
            )}

            <form onSubmit={handleCreateManualBooking} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] mb-1">Nome Cliente *</label>
                <input
                  type="text"
                  required
                  value={manualClientName}
                  onChange={(e) => setManualClientName(e.target.value)}
                  placeholder="Nome del cliente..."
                  className="w-full px-3 py-2 rounded-none border border-[#2E2E2E] bg-[#0B0B0B]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] mb-1">Numero di Telefono *</label>
                <input
                  type="tel"
                  required
                  value={manualClientPhone}
                  onChange={(e) => setManualClientPhone(e.target.value)}
                  placeholder="+39 ..."
                  className="w-full px-3 py-2 rounded-none border border-[#2E2E2E] bg-[#0B0B0B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] mb-1">Servizio *</label>
                  <select
                    required
                    value={manualServiceId}
                    onChange={(e) => setManualServiceId(e.target.value)}
                    className="w-full px-3 py-2 rounded-none border border-[#2E2E2E] bg-[#0B0B0B]"
                  >
                    <option value="">Seleziona...</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name} (€{s.price})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] mb-1">Parrucchiere *</label>
                  <select
                    required
                    value={manualOperatorId}
                    onChange={(e) => setManualOperatorId(e.target.value)}
                    className="w-full px-3 py-2 rounded-none border border-[#2E2E2E] bg-[#0B0B0B]"
                  >
                    <option value="">Seleziona...</option>
                    {operators.map(o => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] mb-1">Data *</label>
                  <input
                    type="date"
                    required
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-none border border-[#2E2E2E] bg-[#0B0B0B]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] mb-1">Orario Inizio *</label>
                  <select
                    value={manualTime}
                    onChange={(e) => setManualTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-none border border-[#2E2E2E] bg-[#0B0B0B]"
                  >
                    {timeGridRows.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] mb-1">Note interne</label>
                <textarea
                  rows={2}
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="Es. Prenotazione telefonica, cliente fisso..."
                  className="w-full px-3 py-2 rounded-none border border-[#2E2E2E] bg-[#0B0B0B]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsManualBookingOpen(false)}
                  className="px-4 py-2.5 rounded-none border border-[#2E2E2E] text-[#F2EFEA] text-[10px] font-bold uppercase tracking-wider hover:bg-[#242424]"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-none bg-[#C8102E] hover:bg-[#E3162F] text-white font-bold uppercase tracking-wider text-[10px] border border-[#C8102E]"
                >
                  Registra Appuntamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALE: BLOCCA SLOT / CHIUSURA (FASE 6 REQUIREMENT) */}
      {/* ========================================================================= */}
      {isClosureModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151515] rounded-none max-w-md w-full p-6 space-y-4 border border-[#2E2E2E]">
            <h3 className="font-display uppercase tracking-wide font-light text-2xl text-[#F2EFEA] border-b border-[#2E2E2E] pb-3">
              Aggiungi Chiusura Straordinaria / Ferie
            </h3>

            <form onSubmit={handleAddClosure} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] mb-1">Data Chiusura *</label>
                <input
                  type="date"
                  required
                  value={closureDate}
                  onChange={(e) => setClosureDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-none border border-[#2E2E2E] bg-[#0B0B0B]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] mb-1">Operatore Interessato</label>
                <select
                  value={closureOperatorId}
                  onChange={(e) => setClosureOperatorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-none border border-[#2E2E2E] bg-[#0B0B0B]"
                >
                  <option value="all">Tutto il Salone (Chiusura completa)</option>
                  {operators.map(o => (
                    <option key={o.id} value={o.id}>{o.name} (Ferie/Permesso personale)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] mb-1">Motivo / Descrizione *</label>
                <input
                  type="text"
                  required
                  value={closureReason}
                  onChange={(e) => setClosureReason(e.target.value)}
                  placeholder="Es. Ferie estive, Corso di aggiornamento..."
                  className="w-full px-3 py-2 rounded-none border border-[#2E2E2E] bg-[#0B0B0B]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsClosureModalOpen(false)}
                  className="px-4 py-2.5 rounded-none border border-[#2E2E2E] text-[#F2EFEA] text-[10px] font-bold uppercase tracking-wider hover:bg-[#242424]"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-none bg-rose-700 hover:bg-rose-800 text-white font-bold uppercase tracking-wider text-[10px]"
                >
                  Salva Chiusura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALE: MODIFICA SERVIZIO (FASE 6 REQUIREMENT) */}
      {/* ========================================================================= */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151515] rounded-none max-w-md w-full p-6 space-y-4 border border-[#2E2E2E]">
            <h3 className="font-display uppercase tracking-wide font-light text-2xl text-[#F2EFEA] border-b border-[#2E2E2E] pb-3">
              Modifica Servizio: {editingService.name}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] mb-1">Nome Servizio</label>
                <input
                  type="text"
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-none border border-[#2E2E2E] bg-[#0B0B0B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] mb-1">Prezzo (€)</label>
                  <input
                    type="number"
                    value={editingService.price}
                    onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-none border border-[#2E2E2E] bg-[#0B0B0B]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] mb-1">Durata (minuti)</label>
                  <select
                    value={editingService.duration_minutes}
                    onChange={(e) => setEditingService({ ...editingService, duration_minutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-none border border-[#2E2E2E] bg-[#0B0B0B]"
                  >
                    <option value={30}>30 minuti</option>
                    <option value={45}>45 minuti</option>
                    <option value={60}>60 minuti</option>
                    <option value={90}>90 minuti</option>
                    <option value={120}>120 minuti</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] mb-1">Descrizione</label>
                <textarea
                  rows={3}
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-none border border-[#2E2E2E] bg-[#0B0B0B]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2.5 rounded-none border border-[#2E2E2E] text-[#F2EFEA] text-[10px] font-bold uppercase tracking-wider hover:bg-[#242424]"
                >
                  Annulla
                </button>
                <button
                  type="button"
                  onClick={() => {
                    StorageService.updateService(editingService);
                    setEditingService(null);
                    triggerRefresh();
                  }}
                  className="px-5 py-2.5 rounded-none bg-[#C8102E] hover:bg-[#E3162F] text-white font-bold uppercase tracking-wider text-[10px] border border-[#C8102E]"
                >
                  Salva Modifiche
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALE: AGGIUNGI NUOVO SERVIZIO */}
      {/* ========================================================================= */}
      {isNewServiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151515] rounded-none max-w-md w-full p-6 space-y-4 border border-[#2E2E2E]">
            <h3 className="font-display uppercase tracking-wide font-light text-2xl text-[#F2EFEA] border-b border-[#2E2E2E] pb-3">
              Aggiungi Nuovo Trattamento
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                const price = Number((form.elements.namedItem('price') as HTMLInputElement).value);
                const duration = Number((form.elements.namedItem('duration') as HTMLSelectElement).value);
                const desc = (form.elements.namedItem('desc') as HTMLTextAreaElement).value;
                const category = (form.elements.namedItem('category') as HTMLSelectElement).value as any;

                StorageService.addService({
                  name,
                  price,
                  duration_minutes: duration,
                  description: desc,
                  category,
                  active: true,
                });

                setIsNewServiceModalOpen(false);
                triggerRefresh();
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] mb-1">Nome Trattamento *</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Es. Trattamento Barba Luxury..."
                  className="w-full px-3 py-2 rounded-none border border-[#2E2E2E] bg-[#0B0B0B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] mb-1">Prezzo (€) *</label>
                  <input
                    name="price"
                    type="number"
                    required
                    placeholder="15"
                    className="w-full px-3 py-2 rounded-none border border-[#2E2E2E] bg-[#0B0B0B]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] mb-1">Durata</label>
                  <select
                    name="duration"
                    defaultValue={30}
                    className="w-full px-3 py-2 rounded-none border border-[#2E2E2E] bg-[#0B0B0B]"
                  >
                    <option value={30}>30 minuti</option>
                    <option value={45}>45 minuti</option>
                    <option value={60}>60 minuti</option>
                    <option value={90}>90 minuti</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] mb-1">Categoria</label>
                <select
                  name="category"
                  defaultValue="barba"
                  className="w-full px-3 py-2 rounded-none border border-[#2E2E2E] bg-[#0B0B0B]"
                >
                  <option value="capelli">Capelli</option>
                  <option value="barba">Barba</option>
                  <option value="trattamenti">Trattamenti</option>
                  <option value="combo">Combo</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] mb-1">Descrizione *</label>
                <textarea
                  name="desc"
                  required
                  rows={2}
                  placeholder="Descrivi il trattamento e i prodotti inclusi..."
                  className="w-full px-3 py-2 rounded-none border border-[#2E2E2E] bg-[#0B0B0B]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewServiceModalOpen(false)}
                  className="px-4 py-2.5 rounded-none border border-[#2E2E2E] text-[#F2EFEA] text-[10px] font-bold uppercase tracking-wider hover:bg-[#242424]"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-none bg-[#C8102E] hover:bg-[#E3162F] text-white font-bold uppercase tracking-wider text-[10px] border border-[#C8102E]"
                >
                  Crea Servizio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALE: MODIFICA OPERATORE */}
      {/* ========================================================================= */}
      {editingOperator && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151515] rounded-none max-w-md w-full p-6 space-y-4 border border-[#2E2E2E]">
            <h3 className="font-display uppercase tracking-wide font-light text-2xl text-[#F2EFEA] border-b border-[#2E2E2E] pb-3">
              Modifica Profilo: {editingOperator.name}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] mb-1">Nome e Cognome</label>
                <input
                  type="text"
                  value={editingOperator.name}
                  onChange={(e) => setEditingOperator({ ...editingOperator, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-none border border-[#2E2E2E] bg-[#0B0B0B]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] mb-1">Ruolo / Titolo</label>
                <input
                  type="text"
                  value={editingOperator.role}
                  onChange={(e) => setEditingOperator({ ...editingOperator, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-none border border-[#2E2E2E] bg-[#0B0B0B]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EFEA] mb-1">Biografia breve</label>
                <textarea
                  rows={3}
                  value={editingOperator.bio || ''}
                  onChange={(e) => setEditingOperator({ ...editingOperator, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-none border border-[#2E2E2E] bg-[#0B0B0B]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingOperator(null)}
                  className="px-4 py-2.5 rounded-none border border-[#2E2E2E] text-[#F2EFEA] text-[10px] font-bold uppercase tracking-wider hover:bg-[#242424]"
                >
                  Annulla
                </button>
                <button
                  type="button"
                  onClick={() => {
                    StorageService.updateOperator(editingOperator);
                    setEditingOperator(null);
                    triggerRefresh();
                  }}
                  className="px-5 py-2.5 rounded-none bg-[#C8102E] hover:bg-[#E3162F] text-white font-bold uppercase tracking-wider text-[10px] border border-[#C8102E]"
                >
                  Salva Profilo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
