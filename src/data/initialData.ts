import { Service, Operator, OperatorService, BusinessHours, Closure, Appointment, GalleryItem } from '../types';

export const BUSINESS_INFO = {
  name: 'Parrucchiere Uomo da Giuseppe',
  shortName: 'Da Giuseppe',
  ownerName: 'Giuseppe Distefano',
  monogram: 'G',
  tagline: 'Parrucchiere per uomo a Catania, nel quartiere Galermo',
  address: 'Via Galermo, 288/E, 95123 Catania (CT), Italia',
  streetShort: 'Via Galermo 288/E',
  neighborhood: 'Galermo',
  city: 'Catania',
  province: 'CT',
  phone: '+39 392 328 5621',
  phoneRaw: '+393923285621',
  email: '',
  instagram: '',
  facebook: 'https://www.facebook.com/parrucchiereuomoGiuseppe/',
  mapsUrl: 'https://maps.app.goo.gl/5PfKF1FaREsNQnHd7',
  googleMapsEmbed: 'https://www.google.com/maps?q=37.53603,15.0560584&z=17&output=embed',
  description: 'Il parrucchiere per uomo di fiducia del quartiere Galermo a Catania: tagli classici e moderni, cura della barba e un servizio sempre attento e cordiale. Il 96% dei clienti lo consiglia.',
};

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-taglio-uomo',
    name: 'Taglio Uomo',
    description: 'Taglio classico o moderno a forbice e macchinetta, rifinitura dei contorni e piega finale, sempre secondo i tuoi gusti.',
    duration_minutes: 30,
    price: 12,
    active: true,
    category: 'capelli',
    popular: true,
  },
  {
    id: 'srv-taglio-bambino',
    name: 'Taglio Bambino',
    description: 'Taglio paziente e delicato per i più piccoli (fino a 12 anni), con rifinitura accurata.',
    duration_minutes: 30,
    price: 10,
    active: true,
    category: 'capelli',
  },
  {
    id: 'srv-taglio-barba',
    name: 'Taglio + Barba',
    description: 'Il servizio completo: taglio di capelli e sistemazione della barba in un unico appuntamento.',
    duration_minutes: 45,
    price: 18,
    active: true,
    category: 'combo',
    popular: true,
  },
  {
    id: 'srv-barba',
    name: 'Barba',
    description: 'Modellatura e rifinitura della barba a rasoio, con prodotti idratanti e balsamo.',
    duration_minutes: 30,
    price: 8,
    active: true,
    category: 'barba',
    popular: true,
  },
  {
    id: 'srv-rasatura-testa',
    name: 'Rasatura Testa',
    description: 'Rasatura completa a lama con crema emolliente e lozione rinfrescante.',
    duration_minutes: 30,
    price: 10,
    active: true,
    category: 'capelli',
  },
  {
    id: 'srv-colorazione',
    name: 'Colorazione',
    description: 'Copertura naturale dei capelli bianchi o tonalizzazione per un look curato e omogeneo.',
    duration_minutes: 60,
    price: 25,
    active: true,
    category: 'trattamenti',
  },
];

export const INITIAL_OPERATORS: Operator[] = [
  {
    id: 'op-giuseppe',
    name: 'Giuseppe Distefano',
    photo_url: '/assets/giuseppe.jpg',
    role: 'Titolare & Parrucchiere',
    bio: 'Parrucchiere per uomo a Galermo, Catania. Cura ogni cliente con attenzione e passione, dai tagli classici alle tendenze più moderne.',
    active: true,
  },
];

export const INITIAL_OPERATOR_SERVICES: OperatorService[] = INITIAL_SERVICES.map((s) => ({
  operator_id: 'op-giuseppe',
  service_id: s.id,
}));

// Orari indicativi (da confermare con il salone): martedì-venerdì 08:00-13:00 e 15:30-20:30,
// sabato 08:00-13:00 e 14:00-20:00, lunedì solo mattina. Il sistema usa un'unica fascia per giorno.
export const INITIAL_BUSINESS_HOURS: BusinessHours[] = [
  { id: 'bh-0', day_of_week: 0, day_name: 'Domenica', open_time: null, close_time: null, is_closed: true },
  { id: 'bh-1', day_of_week: 1, day_name: 'Lunedì', open_time: '08:30', close_time: '13:00', is_closed: false },
  { id: 'bh-2', day_of_week: 2, day_name: 'Martedì', open_time: '08:00', close_time: '20:30', is_closed: false },
  { id: 'bh-3', day_of_week: 3, day_name: 'Mercoledì', open_time: '08:00', close_time: '20:30', is_closed: false },
  { id: 'bh-4', day_of_week: 4, day_name: 'Giovedì', open_time: '08:00', close_time: '20:30', is_closed: false },
  { id: 'bh-5', day_of_week: 5, day_name: 'Venerdì', open_time: '08:00', close_time: '20:30', is_closed: false },
  { id: 'bh-6', day_of_week: 6, day_name: 'Sabato', open_time: '08:00', close_time: '20:00', is_closed: false },
];

export const INITIAL_CLOSURES: Closure[] = [
  {
    id: 'cl-ferragosto',
    operator_id: null,
    date: '2027-08-15',
    reason: 'Ferragosto',
  },
  {
    id: 'cl-sant-agata',
    operator_id: null,
    date: '2027-02-05',
    reason: 'Festa di Sant\'Agata (Patrona di Catania)',
  }
];

// Funzione per generare una data formattata YYYY-MM-DD
export function getFormattedDate(daysOffset: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: 'gal-1', title: '', category: 'tagli', image: '/assets/gallery/foto-1.jpg', description: '', tag: 'Da Giuseppe', featured: true },
  { id: 'gal-2', title: '', category: 'tagli', image: '/assets/gallery/foto-2.jpg', description: '', tag: 'Da Giuseppe', featured: true },
  { id: 'gal-3', title: '', category: 'tagli', image: '/assets/gallery/foto-3.jpg', description: '', tag: 'Da Giuseppe', featured: true },
  { id: 'gal-4', title: '', category: 'tagli', image: '/assets/gallery/foto-4.jpg', description: '', tag: 'Da Giuseppe', featured: true },
  { id: 'gal-5', title: '', category: 'tagli', image: '/assets/gallery/foto-5.jpg', description: '', tag: 'Da Giuseppe', featured: true },
];
