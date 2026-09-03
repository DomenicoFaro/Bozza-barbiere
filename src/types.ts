export type ServiceCategory = 'capelli' | 'barba' | 'trattamenti' | 'combo';

export interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  active: boolean;
  category: ServiceCategory;
  popular?: boolean;
}

export interface Operator {
  id: string;
  name: string;
  photo_url: string;
  role: string;
  bio?: string;
  active: boolean;
}

export interface OperatorService {
  operator_id: string;
  service_id: string;
}

export interface BusinessHours {
  id: string;
  day_of_week: number; // 0 = Domenica, 1 = Lunedì, ..., 6 = Sabato
  day_name: string;
  open_time: string | null; // "08:30"
  close_time: string | null; // "20:00" o "20:30"
  is_closed: boolean;
}

export interface Closure {
  id: string;
  operator_id: string | null; // null = chiusura per tutto il negozio
  date: string; // YYYY-MM-DD
  start_time?: string | null;
  end_time?: string | null;
  reason?: string;
}

export type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  booking_code: string; // es. "DR-7482"
  service_id: string;
  operator_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  notes?: string;
  appointment_date: string; // YYYY-MM-DD
  start_time: string; // "09:00"
  end_time: string; // "09:30"
  status: AppointmentStatus;
  created_at: string;
}

export interface TimeSlot {
  time: string; // "08:30"
  available: boolean;
  reason?: string;
  existingAppointment?: Appointment;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  tag?: string;
  featured?: boolean;
  isVideo?: boolean;
  videoUrl?: string;
}

export type PageView = 'home' | 'booking' | 'services' | 'gallery' | 'my-appointments' | 'contacts' | 'admin';
