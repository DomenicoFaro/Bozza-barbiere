import { Service, Operator, OperatorService, BusinessHours, Closure, Appointment, GalleryItem } from '../types';

export const BUSINESS_INFO = {
  name: 'Dario Riolo Barber Shop',
  shortName: 'Dario Riolo',
  monogram: 'DR',
  tagline: 'Artigianalità sartoriale & cura contemporanea a Catania',
  address: 'Via Giacomo Leopardi, 138, 95127 Catania (CT), Italia',
  city: 'Catania',
  province: 'CT',
  phone: '+39 351 614 8696',
  phoneRaw: '+393516148696',
  email: 'info@darioriolobarbershop.it',
  instagram: 'https://instagram.com',
  mapsUrl: 'https://maps.google.com/?q=Via+Giacomo+Leopardi+138+95127+Catania',
  googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.251433989345!2d15.094589276412702!3d37.51892892641042!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1313e2d67d7a31b5%3A0xb3f56f17cf7bfa2b!2sVia%20Giacomo%20Leopardi%2C%20138%2C%2095127%20Catania%20CT!5e0!3m2!1sit!2sit!4v1709462800000!5m2!1sit!2sit',
  description: 'Un rifugio di stile e relax nel cuore di Catania. Poltrone in pelle, finiture in legno caldo rovere e un approccio artigianale che unisce le tecniche della barbieria classica alle tendenze più attuali.',
};

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-taglio-uomo',
    name: 'Taglio Uomo',
    description: 'Consulenza personalizzata, lavaggio con shampoo specifico, taglio sartoriale a forbice e macchinetta, rifinitura contorni e styling.',
    duration_minutes: 30,
    price: 12,
    active: true,
    category: 'capelli',
    popular: true,
  },
  {
    id: 'srv-taglio-bambino',
    name: 'Taglio Bambino',
    description: 'Taglio delicato e paziente per i più piccoli (fino a 12 anni), con rifinitura accurata e styling finale.',
    duration_minutes: 30,
    price: 10,
    active: true,
    category: 'capelli',
  },
  {
    id: 'srv-taglio-donna',
    name: 'Taglio Donna',
    description: 'Consulenza morfologica, lavaggio relax, taglio personalizzato su misura e asciugatura naturale o modellata.',
    duration_minutes: 45,
    price: 20,
    active: true,
    category: 'capelli',
  },
  {
    id: 'srv-barba',
    name: 'Barba / Rifinitura Barba',
    description: 'Modellatura geometrica o sfumata della barba, rifinitura a rasoio, oli idratanti e balsamo condizionante.',
    duration_minutes: 30,
    price: 8,
    active: true,
    category: 'barba',
    popular: true,
  },
  {
    id: 'srv-rasatura-testa',
    name: 'Rasatura Testa',
    description: 'Rasatura completa a lama con crema emolliente, passaggio a rasoio e lozione rinfrescante tonificante.',
    duration_minutes: 30,
    price: 10,
    active: true,
    category: 'capelli',
  },
  {
    id: 'srv-rasatura-panno-caldo',
    name: 'Rasatura con Panno Caldo',
    description: 'Il rituale tradizionale all\'italiana: doppio panno caldo vaporizzato con oli essenziali, rasatura tradizionale a lama, panno freddo e balsamo dopobarba idratante.',
    duration_minutes: 30,
    price: 12,
    active: true,
    category: 'barba',
    popular: true,
  },
  {
    id: 'srv-colorazione',
    name: 'Colorazione',
    description: 'Copertura naturale dei capelli bianchi o tonalizzazione sfumata per un look discreto, giovane e omogeneo.',
    duration_minutes: 60,
    price: 25,
    active: true,
    category: 'trattamenti',
  },
  {
    id: 'srv-cheratina',
    name: 'Trattamento Cheratina',
    description: 'Trattamento ricostruttivo e lisciante intensivo per capelli crespi o danneggiati. Dona setosità, corpo e disciplina duratura.',
    duration_minutes: 90,
    price: 50,
    active: true,
    category: 'trattamenti',
  },
  {
    id: 'srv-manicure-uomo',
    name: 'Manicure Uomo',
    description: 'Cura meticolosa di unghie e cuticole, limatura elegante, scrub esfoliante e idratazione mani per un aspetto curato e professionale.',
    duration_minutes: 30,
    price: 10,
    active: true,
    category: 'trattamenti',
  },
];

export const INITIAL_OPERATORS: Operator[] = [
  {
    id: 'op-dario',
    name: 'Dario Riolo',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    role: 'Titolare & Master Barber',
    bio: 'Fondatore del barber shop con oltre 15 anni di esperienza nella rasatura tradizionale e nei tagli classici e moderni.',
    active: true,
  },
  {
    id: 'op-marco',
    name: 'Marco Cutuli',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    role: 'Senior Barber & Beard Stylist',
    bio: 'Specialista nella cura e scultura della barba e nel rituale con panno caldo all\'italiana.',
    active: true,
  },
  {
    id: 'op-luca',
    name: 'Luca Grasso',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    role: 'Hair Stylist & Colorist',
    bio: 'Esperto in sfumature razor fade, colorazioni naturali e trattamenti tecnici alla cheratina.',
    active: true,
  },
];

export const INITIAL_OPERATOR_SERVICES: OperatorService[] = [
  // Dario esegue tutti i servizi
  { operator_id: 'op-dario', service_id: 'srv-taglio-uomo' },
  { operator_id: 'op-dario', service_id: 'srv-taglio-bambino' },
  { operator_id: 'op-dario', service_id: 'srv-taglio-donna' },
  { operator_id: 'op-dario', service_id: 'srv-barba' },
  { operator_id: 'op-dario', service_id: 'srv-rasatura-testa' },
  { operator_id: 'op-dario', service_id: 'srv-rasatura-panno-caldo' },
  { operator_id: 'op-dario', service_id: 'srv-colorazione' },
  { operator_id: 'op-dario', service_id: 'srv-cheratina' },
  { operator_id: 'op-dario', service_id: 'srv-manicure-uomo' },

  // Marco esegue barba, tagli e manicure
  { operator_id: 'op-marco', service_id: 'srv-taglio-uomo' },
  { operator_id: 'op-marco', service_id: 'srv-taglio-bambino' },
  { operator_id: 'op-marco', service_id: 'srv-barba' },
  { operator_id: 'op-marco', service_id: 'srv-rasatura-testa' },
  { operator_id: 'op-marco', service_id: 'srv-rasatura-panno-caldo' },
  { operator_id: 'op-marco', service_id: 'srv-manicure-uomo' },

  // Luca esegue tagli, colorazione e cheratina
  { operator_id: 'op-luca', service_id: 'srv-taglio-uomo' },
  { operator_id: 'op-luca', service_id: 'srv-taglio-bambino' },
  { operator_id: 'op-luca', service_id: 'srv-taglio-donna' },
  { operator_id: 'op-luca', service_id: 'srv-barba' },
  { operator_id: 'op-luca', service_id: 'srv-colorazione' },
  { operator_id: 'op-luca', service_id: 'srv-cheratina' },
];

export const INITIAL_BUSINESS_HOURS: BusinessHours[] = [
  { id: 'bh-0', day_of_week: 0, day_name: 'Domenica', open_time: null, close_time: null, is_closed: true },
  { id: 'bh-1', day_of_week: 1, day_name: 'Lunedì', open_time: null, close_time: null, is_closed: true },
  { id: 'bh-2', day_of_week: 2, day_name: 'Martedì', open_time: '08:30', close_time: '20:00', is_closed: false },
  { id: 'bh-3', day_of_week: 3, day_name: 'Mercoledì', open_time: '08:30', close_time: '20:00', is_closed: false },
  { id: 'bh-4', day_of_week: 4, day_name: 'Giovedì', open_time: '08:30', close_time: '20:00', is_closed: false },
  { id: 'bh-5', day_of_week: 5, day_name: 'Venerdì', open_time: '08:30', close_time: '20:30', is_closed: false },
  { id: 'bh-6', day_of_week: 6, day_name: 'Sabato', open_time: '08:30', close_time: '20:30', is_closed: false },
];

export const INITIAL_CLOSURES: Closure[] = [
  {
    id: 'cl-ferragosto',
    operator_id: null,
    date: '2026-08-15',
    reason: 'Festa dell\'Assunta (Ferragosto)',
  },
  {
    id: 'cl-sant-agata',
    operator_id: null,
    date: '2026-02-05',
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
  { id: 'gal-1', title: '', category: 'tagli', image: '/assets/gallery/foto-1.png', description: '', tag: '@darioriolo_barber', featured: true },
  { id: 'gal-2', title: '', category: 'tagli', image: '/assets/gallery/foto-2.png', description: '', tag: '@darioriolo_barber', featured: true },
  { id: 'gal-3', title: '', category: 'tagli', image: '/assets/gallery/foto-3.png', description: '', tag: '@darioriolo_barber', featured: true },
  { id: 'gal-4', title: '', category: 'tagli', image: '/assets/gallery/foto-4.png', description: '', tag: '@darioriolo_barber', featured: true },
  { id: 'gal-5', title: '', category: 'tagli', image: '/assets/gallery/foto-5.png', description: '', tag: '@darioriolo_barber', featured: true },
  { id: 'gal-6', title: '', category: 'tagli', image: '/assets/gallery/foto-6.png', description: '', tag: '@darioriolo_barber', featured: true },
];
