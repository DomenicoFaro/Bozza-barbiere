-- Dario Riolo Barber Shop: schema per il login clienti
-- Esegui questo script nel SQL Editor del tuo progetto Supabase
-- (Dashboard -> SQL Editor -> New query -> incolla ed esegui)

-- Tabella profili cliente, collegata 1:1 con auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  email text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Aggiunge la colonna is_admin se la tabella esiste già senza di essa
alter table public.profiles add column if not exists is_admin boolean not null default false;

alter table public.profiles enable row level security;

-- Ogni cliente può leggere solo il proprio profilo
drop policy if exists "Profiles: select own" on public.profiles;
create policy "Profiles: select own" on public.profiles
  for select using (auth.uid() = id);

-- Ogni cliente può aggiornare solo il proprio profilo
drop policy if exists "Profiles: update own" on public.profiles;
create policy "Profiles: update own" on public.profiles
  for update using (auth.uid() = id);

-- Ogni cliente può inserire solo il proprio profilo
drop policy if exists "Profiles: insert own" on public.profiles;
create policy "Profiles: insert own" on public.profiles
  for insert with check (auth.uid() = id);

-- Crea automaticamente una riga in profiles quando un cliente si registra
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, phone, email)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'phone',
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Mantiene updated_at aggiornato
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_profiles_updated on public.profiles;
create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Promuove ad amministratore l'account con questa email.
-- Va rieseguito (o eseguito la prima volta dopo la registrazione) perché
-- funziona solo se esiste già un utente registrato con questa email.
update public.profiles set is_admin = true where email = 'domenicof778@gmail.com';
update public.profiles set is_admin = true where email = 'paolo09.mila@gmail.com';
