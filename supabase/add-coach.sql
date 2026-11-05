-- Edit the three values below, then run this file in Supabase SQL Editor.
-- First create the user in Authentication > Users > Add user.

do $$
declare
  coach_email text := 'coach@example.com';
  coach_name text := 'Coach Name';
  requested_team_name text := 'Team Name';
  coach_user_id uuid;
  selected_team_id uuid;
begin
  select id into coach_user_id
  from auth.users
  where lower(email) = lower(coach_email)
  limit 1;

  if coach_user_id is null then
    raise exception 'No Auth user found for %', coach_email;
  end if;

  select id into selected_team_id
  from public.teams
  where lower(name) = lower(requested_team_name)
  limit 1;

  if selected_team_id is null then
    insert into public.teams (name)
    values (requested_team_name)
    returning id into selected_team_id;
  end if;

  insert into public.team_members (user_id, team_id, team_name, display_name)
  values (coach_user_id, selected_team_id, requested_team_name, coach_name)
  on conflict (user_id) do update set
    team_id = excluded.team_id,
    team_name = excluded.team_name,
    display_name = excluded.display_name;
end
$$;
