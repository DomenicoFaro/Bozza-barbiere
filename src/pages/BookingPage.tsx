import React, { useState, useEffect } from 'react';
import { PageView, Service, Operator, Appointment, TimeSlot } from '../types';
import { StorageService, getFormattedDate, minutesToTime, timeToMinutes } from '../services/storage';
import { BUSINESS_INFO } from '../data/initialData';
import { useAuth } from '../contexts/AuthContext';
import { 
  Scissors, 
  User, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  AlertCircle, 
  Download, 
  Sparkles, 
  Info,
  Phone,
  BookmarkCheck,
  RotateCcw
} from 'lucide-react';

interface BookingPageProps {
  initialServiceId?: string;
  initialOperatorId?: string;
  onNavigate: (page: PageView) => void;
}

// Avvolge il contenuto di ogni passo con una dissolvenza fluida in entrata/uscita
const StepTransition: React.FC<{ dimmed: boolean; className?: string; children: React.ReactNode }> = ({
  dimmed,
  className = '',
  children,
}) => {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const stateClasses = dimmed
    ? 'opacity-50 scale-[0.98] pointer-events-none'
    : entered
    ? 'opacity-100 translate-y-0 scale-100'
    : 'opacity-0 translate-y-3 scale-[0.99]';

  return (
    <div className={`transition-all duration-300 ease-out ${stateClasses} ${className}`}>
      {children}
    </div>
  );
};

export const BookingPage: React.FC<BookingPageProps> = ({ initialServiceId, initialOperatorId, onNavigate }) => {
  // Wizard Steps: 1 (Service), 2 (Operator), 3 (Date & Time), 4 (Customer Form), 5 (Success)
  const [currentStep, setCurrentStep] = useState<number>(initialServiceId && initialOperatorId ? 3 : initialServiceId ? 2 : 1);

  // Avanzamento automatico dei passi dopo una selezione, con una breve animazione
  const [isAdvancing, setIsAdvancing] = useState(false);
  const advanceTimeoutRef = React.useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) window.clearTimeout(advanceTimeoutRef.current);
    };
  }, []);

  const advanceToStep = (step: number, delay = 500) => {
    setIsAdvancing(true);
    advanceTimeoutRef.current = window.setTimeout(() => {
      setCurrentStep(step);
      setIsAdvancing(false);
    }, delay);
  };

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId || '');
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>(initialOperatorId || 'any'); // 'any' or operator.id
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>('');

  // Customer info
  const { profile } = useAuth();
  const [customerFirstName, setCustomerFirstName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+39 ');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Precompila i dati cliente dal profilo se l'utente è loggato
  useEffect(() => {
    if (!profile) return;
    if (profile.first_name) setCustomerFirstName(profile.first_name);
    if (profile.last_name) setCustomerLastName(profile.last_name);
    if (profile.phone) setCustomerPhone(profile.phone);
    if (profile.email) setCustomerEmail(profile.email);
  }, [profile]);

  // Status & Confirmation
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data from StorageService
  const allServices = StorageService.getServices().filter(s => s.active);
  const businessHours = StorageService.getBusinessHours();
  const closures = StorageService.getClosures();

  // Find first available day initially if not set
  useEffect(() => {
    if (!selectedDate) {
      // Find the first non-closed day starting today or tomorrow
      for (let i = 0; i < 14; i++) {
        const testDateStr = getFormattedDate(i);
        const testDate = new Date(testDateStr + 'T00:00:00');
        const dayOfWeek = testDate.getDay();
        const bh = businessHours.find(h => h.day_of_week === dayOfWeek);
        const hasClosure = closures.some(c => c.date === testDateStr && c.operator_id === null && !c.start_time);
        
        if (bh && !bh.is_closed && !hasClosure) {
          setSelectedDate(testDateStr);
          break;
        }
      }
    }
  }, [businessHours, closures, selectedDate]);

  // When initialServiceId or initialOperatorId prop changes
  useEffect(() => {
    if (initialServiceId) {
      setSelectedServiceId(initialServiceId);
      if (initialOperatorId) {
        setSelectedOperatorId(initialOperatorId);
        setCurrentStep(3);
      } else {
        setCurrentStep(2);
      }
    } else if (initialOperatorId) {
      setSelectedOperatorId(initialOperatorId);
    }
  }, [initialServiceId, initialOperatorId]);

  const selectedService = allServices.find(s => s.id === selectedServiceId);
  const availableOperators = selectedServiceId
    ? StorageService.getOperatorsForService(selectedServiceId)
    : [];

  const selectedOperator = selectedOperatorId === 'any'
    ? null
    : StorageService.getOperatorById(selectedOperatorId);

  // Computed slots for Step 3 (caricati da Supabase, disponibilità condivisa tra tutti i dispositivi)
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    if (!selectedDate || !selectedServiceId) {
      setSlots([]);
      return;
    }
    let active = true;
    setSlotsLoading(true);
    StorageService.generateDaySlots(selectedDate, selectedServiceId, selectedOperatorId).then(result => {
      if (active) {
        setSlots(result);
        setSlotsLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [selectedDate, selectedServiceId, selectedOperatorId]);

  // Date picker: Generate next 14 selectable days with their business status
  const nextDays = Array.from({ length: 14 }, (_, i) => {
    const dateStr = getFormattedDate(i);
    const dateObj = new Date(dateStr + 'T00:00:00');
    const dayOfWeek = dateObj.getDay();
    const bh = businessHours.find(h => h.day_of_week === dayOfWeek);
    const isShopClosed = !bh || bh.is_closed;
    const isSpecialClosure = closures.some(c => c.date === dateStr && c.operator_id === null && !c.start_time);
    const isSelectable = !isShopClosed && !isSpecialClosure;

    const dayName = dateObj.toLocaleDateString('it-IT', { weekday: 'short' });
    const dayNum = dateObj.getDate();
    const monthName = dateObj.toLocaleDateString('it-IT', { month: 'short' });

    return {
      dateStr,
      dayName,
      dayNum,
      monthName,
      isSelectable,
      closureReason: isSpecialClosure ? 'Chiusura festiva' : (isShopClosed ? 'Chiuso' : undefined)
    };
  });

  // Handle final appointment submission
  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const fullName = `${customerFirstName} ${customerLastName}`.trim();
    if (!fullName || !customerPhone.trim() || customerPhone.trim() === '+39') {
      setErrorMsg('Inserisci il tuo nome e numero di telefono per confermare la prenotazione.');
      return;
    }

    setIsSubmitting(true);

    const result = await StorageService.createAppointment({
      serviceId: selectedServiceId,
      operatorId: selectedOperatorId,
      date: selectedDate,
      startTime: selectedSlotTime,
      customerName: fullName,
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || undefined,
      notes: customerNotes.trim() || undefined,
    });

    setIsSubmitting(false);

    if (result.success && result.appointment) {
      setConfirmedAppointment(result.appointment);
      setCurrentStep(5); // Success step
    } else {
      setErrorMsg(result.error || 'Si è verificato un errore durante la prenotazione. Riprova.');
    }
  };

  const stepsHeader = [
    { num: 1, title: 'Servizio', desc: selectedService ? selectedService.name : 'Scegli' },
    { num: 2, title: 'Barbiere', desc: selectedOperatorId === 'any' ? 'Primo disponibile' : (selectedOperator?.name || 'Scegli') },
    { num: 3, title: 'Data & Ora', desc: selectedSlotTime ? `${selectedDate} alle ${selectedSlotTime}` : 'Scegli' },
    { num: 4, title: 'I tuoi Dati', desc: 'Riepilogo e conferma' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Wizard Header & Breadcrumbs (Only if not in step 5) */}
      {currentStep < 5 && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2 border-b border-[#1A1A1A] pb-6">
            <span className="text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-[0.2em] block">
              Prenotazione Online · Dario Riolo
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif italic font-light text-[#1A1A1A]">
              Prenota il tuo Appuntamento
            </h1>
            <p className="text-xs text-[#1A1A1A]/70">
              Zero attese. Slot orari riservati esclusivamente per te a Catania.
            </p>
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {stepsHeader.map((step) => {
              const isCurrent = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <div
                  key={step.num}
                  className={`p-3 border transition-all rounded-none ${
                    isCurrent
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : isPast
                      ? 'bg-white border-[#1A1A1A] text-[#1A1A1A]'
                      : 'bg-[#EFEDE9]/60 border-[#1A1A1A]/20 text-[#1A1A1A]/50'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className={`w-4 h-4 text-[9px] font-bold flex items-center justify-center border ${
                        isCurrent
                          ? 'bg-white text-[#1A1A1A] border-white'
                          : isPast
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-transparent text-current border-current opacity-60'
                      }`}
                    >
                      {isPast ? '✓' : step.num}
                    </span>
                    <span className="font-bold text-[10px] uppercase tracking-wider">
                      {step.title}
                    </span>
                  </div>
                  <p className="text-[10px] truncate opacity-80">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {isAdvancing && (
            <div className="flex items-center justify-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-[#1A1A1A]/70 animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Selezionato, passo successivo...</span>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: SCEGLI IL SERVIZIO */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <StepTransition dimmed={isAdvancing} className="space-y-6">
          <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-3">
            <div>
              <h2 className="font-serif italic text-2xl font-light text-[#1A1A1A]">
                Passo 1: Seleziona il Servizio
              </h2>
              <p className="text-xs text-[#1A1A1A]/70 mt-1">
                Tutti i prezzi includono lavaggio specifico e styling finale con prodotti professionali. Seleziona una card per continuare automaticamente.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allServices.map((service) => {
              const isSelected = selectedServiceId === service.id;
              return (
                <div
                  key={service.id}
                  onClick={() => {
                    setSelectedServiceId(service.id);
                    const ops = StorageService.getOperatorsForService(service.id);
                    if (selectedOperatorId !== 'any' && !ops.some(o => o.id === selectedOperatorId)) {
                      setSelectedOperatorId('any');
                    }
                    advanceToStep(2);
                  }}
                  className={`p-5 border cursor-pointer transition-all flex flex-col justify-between rounded-none ${
                    isSelected
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md'
                      : 'bg-white border-[#1A1A1A] hover:bg-[#EFEDE9]/50'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-serif italic text-lg ${isSelected ? 'text-white' : 'text-[#1A1A1A]'}`}>
                        {service.name}
                      </h3>
                      <span className={`text-2xl font-serif italic font-light ${isSelected ? 'text-white' : 'text-[#1A1A1A]'}`}>
                        €{service.price}
                      </span>
                    </div>

                    <p className={`text-xs leading-relaxed mb-4 ${isSelected ? 'text-white/80' : 'text-[#1A1A1A]/70'}`}>
                      {service.description}
                    </p>
                  </div>

                  <div className={`flex justify-between items-center pt-3 border-t text-xs ${isSelected ? 'border-white/20' : 'border-[#1A1A1A]/10'}`}>
                    <span className={`flex items-center text-[11px] ${isSelected ? 'text-white/80' : 'text-[#1A1A1A]/70'}`}>
                      <Clock className="w-3.5 h-3.5 mr-1 opacity-70" />
                      {service.duration_minutes} minuti
                    </span>

                    <span
                      className={`font-bold px-2 py-0.5 text-[9px] uppercase tracking-widest border ${
                        isSelected
                          ? 'bg-white text-[#1A1A1A] border-white'
                          : 'bg-[#FDFCFB] text-[#1A1A1A] border-[#1A1A1A]'
                      }`}
                    >
                      {isSelected ? 'Selezionato' : 'Scegli'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </StepTransition>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: SCEGLI L'OPERATORE */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <StepTransition dimmed={isAdvancing} className="space-y-6">
          <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-3">
            <div>
              <h2 className="font-serif italic text-2xl font-light text-[#1A1A1A]">
                Passo 2: Scegli il tuo Barbiere
              </h2>
              <p className="text-xs text-[#1A1A1A]/70 mt-1">
                Servizio selezionato: <strong className="text-[#1A1A1A]">{selectedService?.name}</strong> ({selectedService?.duration_minutes} min • €{selectedService?.price})
              </p>
            </div>
            <button
              onClick={() => setCurrentStep(1)}
              className="text-[11px] uppercase tracking-wider font-bold text-[#1A1A1A]/70 hover:text-[#1A1A1A] flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Cambia servizio
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Opzione 1: Qualsiasi Operatore / Il Primo Disponibile */}
            <div
              onClick={() => {
                setSelectedOperatorId('any');
                advanceToStep(3);
              }}
              className={`p-5 border cursor-pointer transition-all flex flex-col justify-between rounded-none ${
                selectedOperatorId === 'any'
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md'
                  : 'bg-white border-[#1A1A1A] hover:bg-[#EFEDE9]/50'
              }`}
            >
              <div className="text-center space-y-3">
                <div className={`w-16 h-16 rounded-none mx-auto flex items-center justify-center border ${
                  selectedOperatorId === 'any' ? 'bg-white text-[#1A1A1A] border-white' : 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                }`}>
                  <Sparkles className="w-7 h-7" />
                </div>
                <div>
                  <h3 className={`font-serif italic text-lg ${selectedOperatorId === 'any' ? 'text-white' : 'text-[#1A1A1A]'}`}>
                    Nessuna preferenza
                  </h3>
                  <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                    selectedOperatorId === 'any' ? 'text-white/80' : 'text-[#1A1A1A]/70'
                  }`}>
                    Primo barbiere disponibile
                  </p>
                  <p className={`text-xs mt-2 ${selectedOperatorId === 'any' ? 'text-white/70' : 'text-[#1A1A1A]/60'}`}>
                    Massima flessibilità oraria: ti assegneremo il primo professionista libero.
                  </p>
                </div>
              </div>

              <div className="pt-4 text-center">
                <span
                  className={`inline-block w-full py-1.5 border text-[10px] font-bold uppercase tracking-widest ${
                    selectedOperatorId === 'any'
                      ? 'bg-white text-[#1A1A1A] border-white'
                      : 'bg-[#FDFCFB] text-[#1A1A1A] border-[#1A1A1A]'
                  }`}
                >
                  {selectedOperatorId === 'any' ? 'Selezionato' : 'Scegli'}
                </span>
              </div>
            </div>

            {/* Operatori abilitati al servizio */}
            {availableOperators.map((operator) => {
              const isSelected = selectedOperatorId === operator.id;
              return (
                <div
                  key={operator.id}
                  onClick={() => {
                    setSelectedOperatorId(operator.id);
                    advanceToStep(3);
                  }}
                  className={`p-5 border cursor-pointer transition-all flex flex-col justify-between rounded-none ${
                    isSelected
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md'
                      : 'bg-white border-[#1A1A1A] hover:bg-[#EFEDE9]/50'
                  }`}
                >
                  <div className="text-center space-y-3">
                    <img
                      src={operator.photo_url}
                      alt={operator.name}
                      className="w-16 h-16 rounded-none object-cover mx-auto border border-current"
                    />
                    <div>
                      <h3 className={`font-serif italic text-lg ${isSelected ? 'text-white' : 'text-[#1A1A1A]'}`}>
                        {operator.name}
                      </h3>
                      <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                        isSelected ? 'text-white/80' : 'text-[#1A1A1A]/70'
                      }`}>
                        {operator.role}
                      </p>
                      <p className={`text-xs mt-2 line-clamp-2 ${isSelected ? 'text-white/70' : 'text-[#1A1A1A]/60'}`}>
                        {operator.bio}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 text-center">
                    <span
                      className={`inline-block w-full py-1.5 border text-[10px] font-bold uppercase tracking-widest ${
                        isSelected
                          ? 'bg-white text-[#1A1A1A] border-white'
                          : 'bg-[#FDFCFB] text-[#1A1A1A] border-[#1A1A1A]'
                      }`}
                    >
                      {isSelected ? 'Selezionato' : 'Scegli'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-start items-center pt-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 border border-[#1A1A1A] text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] hover:bg-white flex items-center space-x-1.5 rounded-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Indietro</span>
            </button>
          </div>
        </StepTransition>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: SCEGLI GIORNO E ORARIO */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <StepTransition dimmed={isAdvancing} className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[#1A1A1A] pb-3">
            <div>
              <h2 className="font-serif italic text-2xl font-light text-[#1A1A1A]">
                Passo 3: Seleziona Giorno e Orario
              </h2>
              <p className="text-xs text-[#1A1A1A]/70 mt-1">
                Barbiere: <strong className="text-[#1A1A1A]">{selectedOperatorId === 'any' ? 'Primo disponibile' : selectedOperator?.name}</strong> • Servizio: <strong className="text-[#1A1A1A]">{selectedService?.name}</strong> ({selectedService?.duration_minutes} min)
              </p>
            </div>
            <button
              onClick={() => setCurrentStep(2)}
              className="text-[11px] uppercase tracking-wider font-bold text-[#1A1A1A]/70 hover:text-[#1A1A1A] flex items-center gap-1 self-start sm:self-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Cambia barbiere
            </button>
          </div>

          {/* Calendario dei Giorni (Orizzontale scrollabile) */}
          <div className="space-y-3">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
              1. Scegli il Giorno
            </label>
            <div className="flex space-x-2 overflow-x-auto pb-3 pt-1">
              {nextDays.map((d) => {
                const isSelected = selectedDate === d.dateStr;
                return (
                  <button
                    key={d.dateStr}
                    type="button"
                    disabled={!d.isSelectable}
                    onClick={() => {
                      setSelectedDate(d.dateStr);
                      setSelectedSlotTime('');
                    }}
                    className={`flex-shrink-0 w-20 py-3 px-2 rounded-none text-center transition-all flex flex-col items-center justify-center border ${
                      isSelected
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-sm'
                        : d.isSelectable
                        ? 'bg-white text-[#1A1A1A] border-[#1A1A1A] hover:bg-[#EFEDE9]'
                        : 'bg-[#EFEDE9]/40 text-[#1A1A1A]/30 border-[#1A1A1A]/10 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-[9px] font-bold uppercase tracking-widest">
                      {d.dayName}
                    </span>
                    <span className="text-2xl font-serif italic font-light my-0.5">
                      {d.dayNum}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider">
                      {d.isSelectable ? d.monthName : d.closureReason}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Griglia degli Slot Orari con LEGENDA OBBLIGATORIA (Verde = Disponibile, Rosso = Occupato) */}
          <div className="bg-white border border-[#1A1A1A] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#1A1A1A] pb-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
                  2. Scegli l'Orario per {selectedDate}
                </label>
                <p className="text-[11px] text-[#1A1A1A]/70 mt-0.5">
                  Intervalli ogni 30 minuti. Il servizio richiede {selectedService?.duration_minutes} minuti.
                </p>
              </div>

              {/* LEGENDA COLORI FISSA COME DA PRD */}
              <div className="flex items-center space-x-4 text-xs font-medium bg-[#EFEDE9] px-3.5 py-1.5 border border-[#1A1A1A]">
                <span className="text-[#1A1A1A] text-[10px] uppercase tracking-wider font-bold">
                  Legenda:
                </span>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 border border-emerald-700" />
                  <span className="text-emerald-950 font-bold text-[11px]">Verde = Disponibile</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-rose-600" />
                  <span className="text-rose-950 font-bold text-[11px]">Rosso = Occupato</span>
                </div>
              </div>
            </div>

            {slotsLoading ? (
              <div className="p-8 text-center text-[#1A1A1A]/60 text-xs uppercase tracking-wider font-bold">
                Verifica disponibilità in corso...
              </div>
            ) : slots.length === 0 ? (
              <div className="p-8 text-center text-[#1A1A1A]/70 space-y-2">
                <AlertCircle className="w-8 h-8 opacity-60 mx-auto" />
                <p className="text-sm font-semibold text-[#1A1A1A]">
                  Nessun orario di apertura disponibile per la data selezionata.
                </p>
                <p className="text-xs">
                  Il negozio potrebbe essere chiuso per riposo settimanale (Lunedì o Domenica) o festività.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                {slots.map((slot) => {
                  const isSelected = selectedSlotTime === slot.time;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => {
                        setSelectedSlotTime(slot.time);
                        advanceToStep(4);
                      }}
                      className={`py-3 px-2 rounded-none text-center font-mono text-xs font-bold transition-all relative border ${
                        isSelected
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md'
                          : slot.available
                          ? 'bg-emerald-50 text-emerald-950 border-emerald-400 hover:bg-emerald-100 cursor-pointer'
                          : 'bg-rose-50 text-rose-400 border-rose-200 cursor-not-allowed line-through opacity-70'
                      }`}
                      title={slot.available ? `Disponibile alle ${slot.time}` : `Orario ${slot.time} non disponibile (${slot.reason || 'occupato'})`}
                    >
                      <div className="flex items-center justify-center space-x-1">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            isSelected
                              ? 'bg-white'
                              : slot.available
                              ? 'bg-emerald-600'
                              : 'bg-rose-500'
                          }`}
                        />
                        <span>{slot.time}</span>
                      </div>
                      {isSelected && (
                        <span className="block text-[8px] font-sans font-bold uppercase tracking-widest text-white/80 mt-0.5">
                          Scelto
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-start items-center pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 border border-[#1A1A1A] text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] hover:bg-white flex items-center space-x-1.5 rounded-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Indietro</span>
            </button>
          </div>
        </StepTransition>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: CONFERMA E DATI CLIENTE */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <div className="space-y-8">
          <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-3">
            <div>
              <h2 className="font-serif italic text-2xl font-light text-[#1A1A1A]">
                Passo 4: Riepilogo & Dati Personali
              </h2>
              <p className="text-xs text-[#1A1A1A]/70 mt-1">
                Controlla i dettagli del tuo appuntamento e inserisci i tuoi recapiti per la conferma.
              </p>
            </div>
            <button
              onClick={() => setCurrentStep(3)}
              className="text-[11px] uppercase tracking-wider font-bold text-[#1A1A1A]/70 hover:text-[#1A1A1A] flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Modifica orario
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Box Riepilogo Ordine */}
            <div className="lg:col-span-5 bg-white p-6 border border-[#1A1A1A] space-y-4">
              <h3 className="font-serif italic text-lg font-normal text-[#1A1A1A] border-b border-[#1A1A1A] pb-2">
                Dettagli Prenotazione
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-[#1A1A1A]/10">
                  <span className="text-[#1A1A1A]/60">Trattamento:</span>
                  <span className="font-bold text-[#1A1A1A]">{selectedService?.name}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-[#1A1A1A]/10">
                  <span className="text-[#1A1A1A]/60">Barbiere:</span>
                  <span className="font-bold text-[#1A1A1A]">
                    {selectedOperatorId === 'any' ? 'Primo disponibile' : selectedOperator?.name}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-[#1A1A1A]/10">
                  <span className="text-[#1A1A1A]/60">Data:</span>
                  <span className="font-bold text-[#1A1A1A]">{selectedDate}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-[#1A1A1A]/10">
                  <span className="text-[#1A1A1A]/60">Orario di inizio:</span>
                  <span className="font-bold text-[#1A1A1A]">{selectedSlotTime}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-[#1A1A1A]/10">
                  <span className="text-[#1A1A1A]/60">Durata prevista:</span>
                  <span className="font-semibold text-[#1A1A1A]">{selectedService?.duration_minutes} minuti</span>
                </div>

                <div className="flex justify-between py-1 border-b border-[#1A1A1A]/10">
                  <span className="text-[#1A1A1A]/60">Luogo:</span>
                  <span className="font-medium text-[#1A1A1A] text-right">Via Giacomo Leopardi 138, Catania</span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-[#1A1A1A]">
                  <span className="font-bold uppercase tracking-wider text-[11px] text-[#1A1A1A]">Prezzo totale al salone:</span>
                  <span className="font-serif italic text-3xl font-light text-[#1A1A1A]">
                    €{selectedService?.price}
                  </span>
                </div>
                <p className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/60 text-right">
                  Pagamento diretto in negozio (Contanti o Carta)
                </p>
              </div>
            </div>

            {/* Form Dati Cliente */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-[#1A1A1A] space-y-5">
              <h3 className="font-serif italic text-lg font-normal text-[#1A1A1A] border-b border-[#1A1A1A] pb-2">
                I Tuoi Dati di Contatto
              </h3>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-300 text-xs text-rose-900 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                      Nome *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerFirstName}
                      onChange={(e) => setCustomerFirstName(e.target.value)}
                      placeholder="Mario"
                      className="w-full px-3.5 py-2.5 rounded-none border border-[#1A1A1A] text-xs bg-[#FDFCFB] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                      Cognome *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerLastName}
                      onChange={(e) => setCustomerLastName(e.target.value)}
                      placeholder="Rossi"
                      className="w-full px-3.5 py-2.5 rounded-none border border-[#1A1A1A] text-xs bg-[#FDFCFB] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                    Numero di Telefono (per conferma e promemoria) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+39 340 1234567"
                    className="w-full px-3.5 py-2.5 rounded-none border border-[#1A1A1A] text-xs bg-[#FDFCFB] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]"
                  />
                  <p className="text-[10px] text-[#1A1A1A]/60 mt-1">
                    Ti consentirà anche di ritrovare e gestire la tua prenotazione nella sezione "I miei appuntamenti".
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                    Indirizzo Email (facoltativo)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="mario.rossi@example.com"
                    className="w-full px-3.5 py-2.5 rounded-none border border-[#1A1A1A] text-xs bg-[#FDFCFB] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                    Note per il barbiere (facoltativo)
                  </label>
                  <textarea
                    rows={2}
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="Es. Sfumatura a pelle, barba molto corta, pelle delicata..."
                    className="w-full px-3.5 py-2.5 rounded-none border border-[#1A1A1A] text-xs bg-[#FDFCFB] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-none border border-[#1A1A1A] bg-[#1A1A1A] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4 opacity-70" />
                    <span>{isSubmitting ? 'Salvataggio in corso...' : 'Conferma Definitiva Prenotazione'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="flex justify-start">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 border border-[#1A1A1A] text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] hover:bg-white flex items-center space-x-1.5 rounded-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Indietro al calendario</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: SCHERMATA DI SUCCESSO E DOWNLOAD .ICS (FASE 4) */}
      {/* ========================================================================= */}
      {currentStep === 5 && confirmedAppointment && (
        <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 border border-[#1A1A1A] shadow-md text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-none bg-[#1A1A1A] text-white mx-auto flex items-center justify-center border border-[#1A1A1A]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2 border-b border-[#1A1A1A] pb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/60 block">
              Prenotazione Confermata
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif italic font-light text-[#1A1A1A]">
              Ti aspettiamo in Salone!
            </h2>
            <p className="text-xs sm:text-sm text-[#1A1A1A]/70">
              Il tuo appuntamento è stato registrato con successo nel nostro sistema.
            </p>
          </div>

          {/* Booking Code Highlight Card */}
          <div className="p-4 bg-[#EFEDE9] border border-[#1A1A1A] max-w-sm mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/70 block">
              Codice Prenotazione Univoco
            </span>
            <span className="text-3xl font-serif italic font-light tracking-wider text-[#1A1A1A] block my-1">
              {confirmedAppointment.booking_code}
            </span>
            <span className="text-[10px] text-[#1A1A1A]/60">
              Salva questo codice per consultare o modificare il tuo appuntamento.
            </span>
          </div>

          {/* Details recap table */}
          <div className="bg-[#FDFCFB] p-4 text-xs text-left space-y-2 border border-[#1A1A1A]">
            <div className="flex justify-between border-b border-[#1A1A1A]/10 pb-1">
              <span className="text-[#1A1A1A]/60">Cliente:</span>
              <span className="font-bold text-[#1A1A1A]">{confirmedAppointment.customer_name}</span>
            </div>
            <div className="flex justify-between border-b border-[#1A1A1A]/10 pb-1">
              <span className="text-[#1A1A1A]/60">Servizio:</span>
              <span className="font-bold text-[#1A1A1A]">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between border-b border-[#1A1A1A]/10 pb-1">
              <span className="text-[#1A1A1A]/60">Barbiere:</span>
              <span className="font-bold text-[#1A1A1A]">
                {StorageService.getOperatorById(confirmedAppointment.operator_id)?.name}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#1A1A1A]/10 pb-1">
              <span className="text-[#1A1A1A]/60">Data e Orario:</span>
              <span className="font-bold text-[#1A1A1A]">
                {confirmedAppointment.appointment_date} dalle {confirmedAppointment.start_time} alle {confirmedAppointment.end_time}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#1A1A1A]/60">Indirizzo:</span>
              <span className="font-bold text-[#1A1A1A]">{BUSINESS_INFO.address}</span>
            </div>
          </div>

          {/* Action buttons including .ICS DOWNLOAD (FASE 4 requirement) */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => StorageService.downloadICalendar(confirmedAppointment)}
              className="px-6 py-3 rounded-none border border-[#1A1A1A] bg-[#1A1A1A] hover:bg-black text-white font-bold text-[11px] uppercase tracking-wider shadow transition-all flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Aggiungi al Calendario (.ics)</span>
            </button>

            <button
              onClick={() => onNavigate('my-appointments')}
              className="px-5 py-3 rounded-none border border-[#1A1A1A] bg-transparent hover:bg-[#EFEDE9] text-[#1A1A1A] font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>Visualizza nei miei appuntamenti</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setCurrentStep(1);
                setSelectedServiceId('');
                setSelectedSlotTime('');
                setConfirmedAppointment(null);
              }}
              className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]/70 hover:text-[#1A1A1A] underline underline-offset-4"
            >
              Effettua un'altra prenotazione
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
