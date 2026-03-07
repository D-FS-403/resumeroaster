-- Supabase Database Schema for ResuméRoast

-- Users table (extends Supabase auth.users)
create table if not exists public.users (
  id uuid references auth.users not null primary key,
  email text unique not null,
  is_pro boolean default false,
  created_at timestamptz default now()
);

-- Roasts history table
create table if not exists public.roasts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id),
  overall_score integer not null,
  grade text not null,
  roast_headline text not null,
  badges jsonb not null,
  categories jsonb not null,
  created_at timestamptz default now()
);

-- Stats table
create table if not exists public.stats (
  id text primary key default '1',
  roast_count integer default 0,
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.users enable row level security;
alter table public.roasts enable row level security;
alter table public.stats enable row level security;

-- Users policies
create policy "Users can view their own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own data" on public.users
  for update using (auth.uid() = id);

create policy "Anyone can create users" on public.users
  for insert with check (true);

-- Roasts policies
create policy "Anyone can view roasts" on public.roasts
  for select using (true);

create policy "Anyone can create roasts" on public.roasts
  for insert with check (true);

create policy "Users can view their own roasts" on public.roasts
  for select using (user_id = auth.uid() OR user_id is null);

-- Stats policies  
create policy "Anyone can view stats" on public.stats
  for select using (true);

-- Function to increment roast count
create or replace function increment_roast_count()
returns void as $$
begin
  update public.stats
  set roast_count = roast_count + 1,
      updated_at = now()
  where id = '1';
end;
$$ language plpgsql;

-- Trigger to increment count on new roast
create trigger on_roast_created
  after insert on public.roasts
  for each row
  execute function increment_roast_count();
