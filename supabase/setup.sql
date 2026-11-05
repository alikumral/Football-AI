-- Football AI Coach Data Entry - Supabase schema
-- Run once in Supabase Dashboard > SQL Editor.

create schema if not exists private;

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists teams_name_lower_idx on public.teams (lower(name));

create table if not exists public.team_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  team_name text not null,
  display_name text not null,
  created_at timestamptz not null default now()
);

create index if not exists team_members_team_id_idx on public.team_members(team_id);

create or replace function private.current_team_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select team_id
  from public.team_members
  where user_id = (select auth.uid())
  limit 1
$$;

revoke all on function private.current_team_id() from public;
grant usage on schema private to authenticated;
grant execute on function private.current_team_id() to authenticated;

create table if not exists public.players (
  id uuid primary key,
  team_id uuid not null default private.current_team_id() references public.teams(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.drafts (
  id uuid primary key,
  team_id uuid not null default private.current_team_id() references public.teams(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists players_team_id_idx on public.players(team_id);
create index if not exists drafts_team_id_idx on public.drafts(team_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end
$$;

drop trigger if exists players_set_updated_at on public.players;
create trigger players_set_updated_at before update on public.players
for each row execute function public.set_updated_at();

drop trigger if exists drafts_set_updated_at on public.drafts;
create trigger drafts_set_updated_at before update on public.drafts
for each row execute function public.set_updated_at();

alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.players enable row level security;
alter table public.drafts enable row level security;

revoke all on table public.teams, public.team_members, public.players, public.drafts from anon, authenticated;
grant select on table public.team_members to authenticated;
grant select, insert, update, delete on table public.players, public.drafts to authenticated;

drop policy if exists "Members read their membership" on public.team_members;
create policy "Members read their membership"
on public.team_members for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Members read team players" on public.players;
create policy "Members read team players"
on public.players for select to authenticated
using (team_id = (select private.current_team_id()));

drop policy if exists "Members create team players" on public.players;
create policy "Members create team players"
on public.players for insert to authenticated
with check (team_id = (select private.current_team_id()));

drop policy if exists "Members update team players" on public.players;
create policy "Members update team players"
on public.players for update to authenticated
using (team_id = (select private.current_team_id()))
with check (team_id = (select private.current_team_id()));

drop policy if exists "Members delete team players" on public.players;
create policy "Members delete team players"
on public.players for delete to authenticated
using (team_id = (select private.current_team_id()));

drop policy if exists "Members read team drafts" on public.drafts;
create policy "Members read team drafts"
on public.drafts for select to authenticated
using (team_id = (select private.current_team_id()));

drop policy if exists "Members create team drafts" on public.drafts;
create policy "Members create team drafts"
on public.drafts for insert to authenticated
with check (team_id = (select private.current_team_id()));

drop policy if exists "Members update team drafts" on public.drafts;
create policy "Members update team drafts"
on public.drafts for update to authenticated
using (team_id = (select private.current_team_id()))
with check (team_id = (select private.current_team_id()));

drop policy if exists "Members delete team drafts" on public.drafts;
create policy "Members delete team drafts"
on public.drafts for delete to authenticated
using (team_id = (select private.current_team_id()));

create or replace function public.submit_player(p_player_id uuid, p_player_data jsonb)
returns void
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  insert into public.players (id, data)
  values (p_player_id, p_player_data)
  on conflict (id) do update set data = excluded.data;

  delete from public.drafts where id = p_player_id;
end
$$;

revoke all on function public.submit_player(uuid, jsonb) from public, anon;
grant execute on function public.submit_player(uuid, jsonb) to authenticated;

