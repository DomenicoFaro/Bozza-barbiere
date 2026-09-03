-- Dario Riolo Barber Shop: appuntamenti condivisi (Supabase)
-- Esegui questo script nel SQL Editor del tuo progetto Supabase
-- (Dashboard -> SQL Editor -> New query -> incolla ed esegui)
--
-- Prima di questo script serve gia' aver eseguito schema.sql (tabella
-- profiles con la colonna is_admin), perche' le policy sotto controllano
-- is_admin per decidere chi puo' vedere tutti gli appuntamenti.

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  booking_code text not null unique,
  service_id text not null,
  operator_id text not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  notes text,
  appointment_date text not null, -- formato YYYY-MM-DD
  start_time text not null,       -- formato HH:MM
  end_time text not null,         -- formato HH:MM
  status text not null default 'confirmed' check (status in ('confirmed', 'pending', 'cancelled', 'completed')),
  created_at timestamptz not null default now()
);

alter table public.appointments enable row level security;

-- Chiunque puo' creare un appuntamento (prenotazione pubblica, senza login,
-- come funzionava finora)
drop policy if exists "Appointments: public insert" on public.appointments;
create policy "Appointments: public insert" on public.appointments
  for insert with check (true);

-- Solo gli amministratori possono leggere la tabella intera (il pannello
-- admin). I clienti guest trovano i propri appuntamenti tramite le funzioni
-- RPC piu' sotto, che restituiscono solo le righe che gli appartengono.
drop policy if exists "Appointments: admin select all" on public.appointments;
create policy "Appointments: admin select all" on public.appointments
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Solo gli amministratori possono modificare direttamente un appuntamento
-- (es. segnarlo completato/cancellato dal pannello). I clienti guest
-- cancellano tramite la funzione RPC cancel_appointment.
drop policy if exists "Appointments: admin update" on public.appointments;
create policy "Appointments: admin update" on public.appointments
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  ) with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- ---------------------------------------------------------------------
-- FUNZIONI RPC: permettono al sito pubblico di leggere/modificare solo
-- le righe pertinenti, senza dover aprire la select su tutta la tabella
-- (che esporrebbe nome e telefono di tutti i clienti a chiunque).
-- ---------------------------------------------------------------------

-- Restituisce solo gli orari occupati (nessun dato del cliente) per
-- calcolare la disponibilita' degli slot nella pagina di prenotazione.
create or replace function public.get_busy_slots(p_date text, p_operator_id text default null)
returns table(operator_id text, start_time text, end_time text)
language sql security definer set search_path = public
as $$
  select operator_id, start_time, end_time
  from public.appointments
  where appointment_date = p_date
    and status <> 'cancelled'
    and (p_operator_id is null or operator_id = p_operator_id);
$$;
grant execute on function public.get_busy_slots(text, text) to anon, authenticated;

-- Ricerca guest per codice prenotazione (es. "DR-1234")
create or replace function public.lookup_appointment_by_code(p_code text)
returns setof public.appointments
language sql security definer set search_path = public
as $$
  select * from public.appointments
  where upper(booking_code) = upper(trim(p_code));
$$;
grant execute on function public.lookup_appointment_by_code(text) to anon, authenticated;

-- Ricerca guest per numero di telefono
create or replace function public.lookup_appointments_by_phone(p_phone text)
returns setof public.appointments
language sql security definer set search_path = public
as $$
  select * from public.appointments
  where regexp_replace(customer_phone, '[\s\-\(\)]', '', 'g')
        ilike '%' || regexp_replace(p_phone, '[\s\-\(\)]', '', 'g') || '%';
$$;
grant execute on function public.lookup_appointments_by_phone(text) to anon, authenticated;

-- Cancellazione guest: puo' cancellare solo se conosce anche il telefono
-- associato all'appuntamento (evita che chiunque conosca solo l'id possa
-- cancellare l'appuntamento di un altro cliente).
create or replace function public.cancel_appointment(p_id uuid, p_phone text)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  update public.appointments
  set status = 'cancelled'
  where id = p_id
    and regexp_replace(customer_phone, '[\s\-\(\)]', '', 'g') = regexp_replace(p_phone, '[\s\-\(\)]', '', 'g');
end;
$$;
grant execute on function public.cancel_appointment(uuid, text) to anon, authenticated;
