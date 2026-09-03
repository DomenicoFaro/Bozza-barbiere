import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase non configurato: imposta VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nel file .env per abilitare il login.'
  );
}

// Placeholder valido (ma inattivo) finché le variabili d'ambiente non sono impostate,
// così il resto del sito continua a funzionare senza login.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
