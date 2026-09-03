import { Service, Operator, OperatorService, BusinessHours, Closure, Appointment, TimeSlot, GalleryItem } from '../types';
import {
  INITIAL_SERVICES,
  INITIAL_OPERATORS,
  INITIAL_OPERATOR_SERVICES,
  INITIAL_BUSINESS_HOURS,
  INITIAL_CLOSURES,
  GALLERY_ITEMS,
  BUSINESS_INFO,
  getFormattedDate,
} from '../data/initialData';
import { supabase } from './supabaseClient';

const STORAGE_KEYS = {
  SERVICES: 'dr_barber_services',
  OPERATORS: 'dr_barber_operators',
  OPERATOR_SERVICES: 'dr_barber_operator_services',
  BUSINESS_HOURS: 'dr_barber_business_hours',
  CLOSURES: 'dr_barber_closures',
  GALLERY: 'dr_barber_gallery_clean_v1',
};

type BusySlot = { operator_id: string; start_time: string; end_time: string };

// Helper per leggere e scrivere su localStorage in modo sicuro
function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Errore nel salvataggio su localStorage [${key}]:`, err);
  }
}

export const StorageService = {
  // SERVICES CRUD
  getServices(): Service[] {
    return getStored<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  },
  saveServices(services: Service[]): void {
    setStored(STORAGE_KEYS.SERVICES, services);
  },
  getServiceById(id: string): Service | undefined {
    return this.getServices().find(s => s.id === id);
  },
  updateService(service: Service): void {
    const services = this.getServices().map(s => (s.id === service.id ? service : s));
    this.saveServices(services);
  },
  addService(service: Omit<Service, 'id'>): Service {
    const newService: Service = {
      ...service,
      id: `srv-${Date.now()}`,
    };
    const services = [...this.getServices(), newService];
    this.saveServices(services);
    return newService;
  },
  deleteService(id: string): void {
    const services = this.getServices().filter(s => s.id !== id);
    this.saveServices(services);
  },

  // OPERATORS CRUD
  getOperators(): Operator[] {
    return getStored<Operator[]>(STORAGE_KEYS.OPERATORS, INITIAL_OPERATORS);
  },
  saveOperators(operators: Operator[]): void {
    setStored(STORAGE_KEYS.OPERATORS, operators);
  },
  getOperatorById(id: string): Operator | undefined {
    return this.getOperators().find(o => o.id === id);
  },
  updateOperator(operator: Operator): void {
    const operators = this.getOperators().map(o => (o.id === operator.id ? operator : o));
    this.saveOperators(operators);
  },
  addOperator(operator: Omit<Operator, 'id'>): Operator {
    const newOperator: Operator = {
      ...operator,
      id: `op-${Date.now()}`,
    };
    const operators = [...this.getOperators(), newOperator];
    this.saveOperators(operators);
    return newOperator;
  },

  // OPERATOR_SERVICES
  getOperatorServices(): OperatorService[] {
    return getStored<OperatorService[]>(STORAGE_KEYS.OPERATOR_SERVICES, INITIAL_OPERATOR_SERVICES);
  },
  saveOperatorServices(mappings: OperatorService[]): void {
    setStored(STORAGE_KEYS.OPERATOR_SERVICES, mappings);
  },
  getOperatorsForService(serviceId: string): Operator[] {
    const allOps = this.getOperators().filter(o => o.active);
    const mappings = this.getOperatorServices().filter(m => m.service_id === serviceId);
    return allOps.filter(op => mappings.some(m => m.operator_id === op.id));
  },

  // BUSINESS HOURS
  getBusinessHours(): BusinessHours[] {
    return getStored<BusinessHours[]>(STORAGE_KEYS.BUSINESS_HOURS, INITIAL_BUSINESS_HOURS);
  },
  saveBusinessHours(hours: BusinessHours[]): void {
    setStored(STORAGE_KEYS.BUSINESS_HOURS, hours);
  },

  // CLOSURES
  getClosures(): Closure[] {
    return getStored<Closure[]>(STORAGE_KEYS.CLOSURES, INITIAL_CLOSURES);
  },
  saveClosures(closures: Closure[]): void {
    setStored(STORAGE_KEYS.CLOSURES, closures);
  },
  addClosure(closure: Omit<Closure, 'id'>): Closure {
    const newClosure: Closure = {
      ...closure,
      id: `cl-${Date.now()}`,
    };
    const closures = [...this.getClosures(), newClosure];
    this.saveClosures(closures);
    return newClosure;
  },
  deleteClosure(id: string): void {
    const closures = this.getClosures().filter(c => c.id !== id);
    this.saveClosures(closures);
  },

  // APPOINTMENTS (condivisi tra tutti i dispositivi tramite Supabase)

  // Elenco completo: richiede permesso is_admin lato RLS (usato dal pannello admin)
  async getAppointments(): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true })
      .order('start_time', { ascending: true });
    if (error) {
      console.error('Errore nel caricamento degli appuntamenti:', error);
      return [];
    }
    return (data as Appointment[]) || [];
  },

  // Ricerca guest tramite funzione RPC (non espone l'intera tabella)
  async getAppointmentByCode(code: string): Promise<Appointment | undefined> {
    const { data, error } = await supabase.rpc('lookup_appointment_by_code', { p_code: code.trim() });
    if (error) {
      console.error('Errore nella ricerca per codice:', error);
      return undefined;
    }
    return (data as Appointment[] | null)?.[0];
  },
  async getAppointmentsByPhone(phone: string): Promise<Appointment[]> {
    const { data, error } = await supabase.rpc('lookup_appointments_by_phone', { p_phone: phone.trim() });
    if (error) {
      console.error('Errore nella ricerca per telefono:', error);
      return [];
    }
    return (data as Appointment[]) || [];
  },

  // Solo gli orari occupati (nessun dato cliente) per calcolare la disponibilità
  async getBusySlots(date: string, operatorId?: string): Promise<BusySlot[]> {
    const { data, error } = await supabase.rpc('get_busy_slots', {
      p_date: date,
      p_operator_id: operatorId && operatorId !== 'any' ? operatorId : null,
    });
    if (error) {
      console.error('Errore nel calcolo degli slot occupati:', error);
      return [];
    }
    return (data as BusySlot[]) || [];
  },

  // Collisione oraria calcolata su un elenco di slot occupati già recuperato
  isBusyGivenSlots(busySlots: BusySlot[], operatorId: string, startTime: string, durationMinutes: number): boolean {
    const newStart = timeToMinutes(startTime);
    const newEnd = newStart + durationMinutes;
    return busySlots.some(b => {
      if (b.operator_id !== operatorId) return false;
      const bStart = timeToMinutes(b.start_time);
      const bEnd = timeToMinutes(b.end_time);
      return newStart < bEnd && newEnd > bStart;
    });
  },

  // Controlla le chiusure straordinarie dell'operatore o del negozio (dato locale)
  isClosureBlocking(operatorId: string, date: string, startTime: string, durationMinutes: number): boolean {
    const newStart = timeToMinutes(startTime);
    const newEnd = newStart + durationMinutes;
    const closures = this.getClosures().filter(c =>
      c.date === date && (c.operator_id === null || c.operator_id === operatorId)
    );
    for (const c of closures) {
      if (!c.start_time || !c.end_time) return true; // Chiusura tutto il giorno
      const cStart = timeToMinutes(c.start_time);
      const cEnd = timeToMinutes(c.end_time);
      if (newStart < cEnd && newEnd > cStart) return true;
    }
    return false;
  },

  // Crea un nuovo appuntamento con prevenzione doppia prenotazione
  async createAppointment(data: {
    serviceId: string;
    operatorId: string;
    date: string;
    startTime: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    notes?: string;
  }): Promise<{ success: boolean; appointment?: Appointment; error?: string }> {
    const service = this.getServiceById(data.serviceId);
    if (!service) {
      return { success: false, error: 'Servizio non trovato.' };
    }

    // Blocca prenotazioni con orario già trascorso (es. slot rimasto selezionato mentre l'ora passava)
    const isToday = data.date === getFormattedDate(0);
    if (isToday) {
      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      if (timeToMinutes(data.startTime) <= nowMin) {
        return { success: false, error: 'Questo orario è già trascorso. Seleziona un orario futuro.' };
      }
    } else if (data.date < getFormattedDate(0)) {
      return { success: false, error: 'Non è possibile prenotare in una data passata.' };
    }

    const busySlots = await this.getBusySlots(data.date);

    // Se l'operatore scelto è "any" (primo disponibile), assegniamo il primo operatore libero
    let effectiveOperatorId = data.operatorId;
    if (effectiveOperatorId === 'any') {
      const availableOps = this.getOperatorsForService(data.serviceId);
      const freeOp = availableOps.find(op =>
        !this.isBusyGivenSlots(busySlots, op.id, data.startTime, service.duration_minutes) &&
        !this.isClosureBlocking(op.id, data.date, data.startTime, service.duration_minutes)
      );
      if (!freeOp) {
        return { success: false, error: 'Nessun barbiere disponibile in questo orario.' };
      }
      effectiveOperatorId = freeOp.id;
    }

    // Calcola end_time
    const endTime = addMinutesToTime(data.startTime, service.duration_minutes);

    // Verifica collisioni orario
    if (
      this.isBusyGivenSlots(busySlots, effectiveOperatorId, data.startTime, service.duration_minutes) ||
      this.isClosureBlocking(effectiveOperatorId, data.date, data.startTime, service.duration_minutes)
    ) {
      return {
        success: false,
        error: 'Questo slot orario è già stato occupato. Seleziona un orario differente.',
      };
    }

    const bookingCode = `DR-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data: inserted, error } = await supabase
      .from('appointments')
      .insert({
        booking_code: bookingCode,
        service_id: data.serviceId,
        operator_id: effectiveOperatorId,
        customer_name: data.customerName.trim(),
        customer_phone: data.customerPhone.trim(),
        customer_email: data.customerEmail?.trim() || null,
        notes: data.notes?.trim() || null,
        appointment_date: data.date,
        start_time: data.startTime,
        end_time: endTime,
        status: 'confirmed',
      })
      .select()
      .single();

    if (error || !inserted) {
      console.error('Errore nella creazione dell\'appuntamento:', error);
      return { success: false, error: 'Errore di connessione al server. Riprova.' };
    }

    return { success: true, appointment: inserted as Appointment };
  },

  // Admin: aggiorna direttamente lo stato di un appuntamento (richiede permesso is_admin lato RLS)
  async adminUpdateAppointmentStatus(id: string, status: Appointment['status']): Promise<boolean> {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (error) {
      console.error('Errore nell\'aggiornamento dello stato:', error);
      return false;
    }
    return true;
  },

  // Cliente guest: cancella un proprio appuntamento (verifica anche il telefono lato server)
  async cancelAppointmentAsGuest(id: string, phone: string): Promise<boolean> {
    const { error } = await supabase.rpc('cancel_appointment', { p_id: id, p_phone: phone });
    if (error) {
      console.error('Errore nella cancellazione:', error);
      return false;
    }
    return true;
  },

  // Genera tutti gli slot orari da 30 min per una data specifica e calcola la disponibilità
  async generateDaySlots(dateStr: string, serviceId?: string, operatorId?: string): Promise<TimeSlot[]> {
    const date = new Date(dateStr + 'T00:00:00');
    const dayOfWeek = date.getDay(); // 0 = dom, 1 = lun, ...

    const businessHours = this.getBusinessHours().find(h => h.day_of_week === dayOfWeek);

    // Se il giorno è chiuso
    if (!businessHours || businessHours.is_closed || !businessHours.open_time || !businessHours.close_time) {
      return [];
    }

    // Controlla chiusura totale del negozio
    const shopClosures = this.getClosures().filter(c => c.date === dateStr && c.operator_id === null && !c.start_time);
    if (shopClosures.length > 0) {
      return [];
    }

    const service = serviceId ? this.getServiceById(serviceId) : undefined;
    const duration = service ? service.duration_minutes : 30;

    const openMin = timeToMinutes(businessHours.open_time);
    const closeMin = timeToMinutes(businessHours.close_time);

    const slots: TimeSlot[] = [];
    const availableOps = serviceId ? this.getOperatorsForService(serviceId) : this.getOperators();
    const busySlots = await this.getBusySlots(dateStr, operatorId);

    // Se la data selezionata è oggi, blocca gli slot con orario già trascorso
    const isToday = dateStr === getFormattedDate(0);
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();

    for (let currentMin = openMin; currentMin < closeMin; currentMin += 30) {
      const timeStr = minutesToTime(currentMin);
      const slotEndMin = currentMin + duration;

      // Orario già passato (solo per la data odierna)
      if (isToday && currentMin <= nowMin) {
        slots.push({
          time: timeStr,
          available: false,
          reason: 'Orario già trascorso',
        });
        continue;
      }

      // Se la durata del servizio sfora l'orario di chiusura, lo slot non è disponibile
      if (slotEndMin > closeMin) {
        slots.push({
          time: timeStr,
          available: false,
          reason: 'Oltre orario di chiusura',
        });
        continue;
      }

      let isAvailable = false;

      if (operatorId && operatorId !== 'any') {
        // Operatore specifico selezionato
        const busy =
          this.isBusyGivenSlots(busySlots, operatorId, timeStr, duration) ||
          this.isClosureBlocking(operatorId, dateStr, timeStr, duration);
        isAvailable = !busy;
      } else {
        // Qualsiasi operatore / primo disponibile
        // Se c'è almeno un operatore abilitato al servizio libero per tutta la durata, lo slot è verde
        const freeOp = availableOps.find(op =>
          !this.isBusyGivenSlots(busySlots, op.id, timeStr, duration) &&
          !this.isClosureBlocking(op.id, dateStr, timeStr, duration)
        );
        isAvailable = !!freeOp;
      }

      slots.push({
        time: timeStr,
        available: isAvailable,
        reason: isAvailable ? undefined : 'Slot occupato',
      });
    }

    return slots;
  },

  // Generatore di file .ics standard (iCalendar)
  generateICalendar(appointment: Appointment): string {
    const service = this.getServiceById(appointment.service_id);
    const operator = this.getOperatorById(appointment.operator_id);
    const serviceName = service?.name || 'Taglio & Cura Barba';
    const operatorName = operator?.name || 'Dario Riolo Barber Shop';

    // Format YYYYMMDDTHHmmSS
    const dateFormatted = appointment.appointment_date.replace(/-/g, '');
    const startTimeFormatted = appointment.start_time.replace(':', '') + '00';
    const endTimeFormatted = appointment.end_time.replace(':', '') + '00';

    const startDateTime = `${dateFormatted}T${startTimeFormatted}`;
    const endDateTime = `${dateFormatted}T${endTimeFormatted}`;
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Dario Riolo Barber Shop//IT',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${appointment.booking_code}-${Date.now()}@darioriolobarbershop.it`,
      `DTSTAMP:${now}`,
      `DTSTART:${startDateTime}`,
      `DTEND:${endDateTime}`,
      `SUMMARY:Appuntamento: ${serviceName} da Dario Riolo Barber Shop`,
      `DESCRIPTION:Appuntamento con ${operatorName}\\nCodice prenotazione: ${appointment.booking_code}\\nTelefono salone: ${BUSINESS_INFO.phone}`,
      `LOCATION:${BUSINESS_INFO.address}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    return ics;
  },

  // Scarica il file .ics nel browser
  downloadICalendar(appointment: Appointment): void {
    const icsContent = this.generateICalendar(appointment);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `prenotazione-${appointment.booking_code}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Verifica lo stato aperto/chiuso attuale del negozio
  getShopCurrentStatus(): { isOpen: boolean; text: string; nextOpen?: string } {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const nowTotalMin = currentHour * 60 + currentMin;

    const hours = this.getBusinessHours();
    const todayHours = hours.find(h => h.day_of_week === dayOfWeek);

    if (!todayHours || todayHours.is_closed || !todayHours.open_time || !todayHours.close_time) {
      // Trova il prossimo giorno aperto
      return {
        isOpen: false,
        text: 'Oggi Chiuso',
        nextOpen: 'Riapre Martedì alle 08:30',
      };
    }

    const openMin = timeToMinutes(todayHours.open_time);
    const closeMin = timeToMinutes(todayHours.close_time);

    if (nowTotalMin >= openMin && nowTotalMin < closeMin) {
      return {
        isOpen: true,
        text: `Aperto adesso fino alle ${todayHours.close_time}`,
      };
    } else if (nowTotalMin < openMin) {
      return {
        isOpen: false,
        text: `Apre oggi alle ${todayHours.open_time}`,
      };
    } else {
      return {
        isOpen: false,
        text: 'Chiuso per oggi',
        nextOpen: 'Riapre domani alle 08:30',
      };
    }
  },

  // GALLERY ITEMS
  getGalleryItems(): GalleryItem[] {
    return getStored<GalleryItem[]>(STORAGE_KEYS.GALLERY, GALLERY_ITEMS);
  },
  saveGalleryItems(items: GalleryItem[]): void {
    setStored(STORAGE_KEYS.GALLERY, items);
  },
  clearGallery(): void {
    setStored(STORAGE_KEYS.GALLERY, []);
  },
  addGalleryItem(item: Omit<GalleryItem, 'id'>): GalleryItem {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
    };
    const items = [newItem, ...this.getGalleryItems()];
    this.saveGalleryItems(items);
    return newItem;
  },
  deleteGalleryItem(id: string): void {
    const items = this.getGalleryItems().filter(i => i.id !== id);
    this.saveGalleryItems(items);
  },

  // Reimposta i dati a quelli predefiniti (utile per test/demo)
  resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.OPERATORS);
    localStorage.removeItem(STORAGE_KEYS.OPERATOR_SERVICES);
    localStorage.removeItem(STORAGE_KEYS.BUSINESS_HOURS);
    localStorage.removeItem(STORAGE_KEYS.CLOSURES);
    localStorage.removeItem(STORAGE_KEYS.GALLERY);
  },
};

// Utilities per il tempo
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + (minutes || 0);
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function addMinutesToTime(timeStr: string, minutesToAdd: number): string {
  const total = timeToMinutes(timeStr) + minutesToAdd;
  return minutesToTime(total);
}

export { getFormattedDate } from '../data/initialData';
