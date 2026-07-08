-- ============================================================================
-- Comunidad — initial schema
-- Marketing lead capture (access_requests) + working governance product demo
-- (profiles, communities, members, feed posts, proposals, votes, actas).
--
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query → Run),
-- or via `supabase db push` if you use the CLI.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. access_requests  (marketing site — anonymous, insert-only lead capture)
-- ---------------------------------------------------------------------------
create table if not exists public.access_requests (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  name          text,
  role          text,          -- Presidente | Miembro de junta | Vecino | Administrador
  dwellings     integer,       -- número de viviendas
  plan_interest text,          -- Pequeña | Mediana | Grande (set from a plan card)
  wants_call    boolean not null default false,
  created_at    timestamptz not null default now()
);

alter table public.access_requests enable row level security;

-- Anyone (anonymous visitors) can submit a request. No SELECT policy exists,
-- so nobody can read rows from the client — you read them in the dashboard.
drop policy if exists "access_requests_insert_anon" on public.access_requests;
create policy "access_requests_insert_anon"
  on public.access_requests
  for insert
  to anon, authenticated
  with check (true);

-- Optional, truthful signup counter (exposes only a count, never row contents).
create or replace function public.access_request_count()
returns bigint
language sql
security definer
set search_path = public
as $$
  select count(*) from public.access_requests;
$$;
grant execute on function public.access_request_count() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. profiles  (one row per auth user)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Names are shown next to feed posts and votes, so any signed-in user can read
-- profiles (acceptable for this demo). Users manage only their own row.
drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated"
  on public.profiles for select to authenticated using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert to authenticated with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Auto-create a profile whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 3. communities + membership
-- ---------------------------------------------------------------------------
create table if not exists public.communities (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  dwellings  integer,
  join_code  text not null unique,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.community_members (
  id           uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  role         text not null default 'vecino', -- presidente | miembro_junta | vecino | administrador
  created_at   timestamptz not null default now(),
  unique (community_id, user_id)
);

alter table public.communities       enable row level security;
alter table public.community_members enable row level security;

-- SECURITY DEFINER helpers: they bypass RLS, which breaks the classic
-- communities <-> community_members policy recursion.
create or replace function public.is_member(cid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.community_members m
    where m.community_id = cid and m.user_id = auth.uid()
  );
$$;

create or replace function public.is_board(cid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.community_members m
    where m.community_id = cid and m.user_id = auth.uid()
      and m.role in ('presidente', 'miembro_junta')
  );
$$;

grant execute on function public.is_member(uuid) to authenticated;
grant execute on function public.is_board(uuid)  to authenticated;

-- communities: members (or the creator) can read; creator can insert directly.
drop policy if exists "communities_select_member" on public.communities;
create policy "communities_select_member"
  on public.communities for select to authenticated
  using (public.is_member(id) or created_by = auth.uid());

drop policy if exists "communities_insert_own" on public.communities;
create policy "communities_insert_own"
  on public.communities for insert to authenticated
  with check (created_by = auth.uid());

-- community_members: members can see the roster; you may add only yourself.
drop policy if exists "members_select_member" on public.community_members;
create policy "members_select_member"
  on public.community_members for select to authenticated
  using (public.is_member(community_id));

drop policy if exists "members_insert_self" on public.community_members;
create policy "members_insert_self"
  on public.community_members for insert to authenticated
  with check (user_id = auth.uid());

-- create_community: atomically create the building and enroll the creator as
-- presidente, generating a unique 6-char join code.
create or replace function public.create_community(p_name text, p_dwellings int)
returns public.communities
language plpgsql
security definer
set search_path = public
as $$
declare
  c    public.communities;
  code text;
begin
  if auth.uid() is null then
    raise exception 'Debes iniciar sesión';
  end if;
  loop
    code := upper(substr(md5(random()::text), 1, 6));
    exit when not exists (select 1 from public.communities where join_code = code);
  end loop;
  insert into public.communities (name, dwellings, join_code, created_by)
    values (p_name, p_dwellings, code, auth.uid())
    returning * into c;
  insert into public.community_members (community_id, user_id, role)
    values (c.id, auth.uid(), 'presidente');
  return c;
end;
$$;

-- join_community: enroll the current user into a community by its code.
create or replace function public.join_community(p_code text)
returns public.communities
language plpgsql
security definer
set search_path = public
as $$
declare
  c public.communities;
begin
  if auth.uid() is null then
    raise exception 'Debes iniciar sesión';
  end if;
  select * into c from public.communities where join_code = upper(trim(p_code));
  if c.id is null then
    raise exception 'Código no válido';
  end if;
  insert into public.community_members (community_id, user_id, role)
    values (c.id, auth.uid(), 'vecino')
    on conflict (community_id, user_id) do nothing;
  return c;
end;
$$;

grant execute on function public.create_community(text, int) to authenticated;
grant execute on function public.join_community(text)        to authenticated;

-- ---------------------------------------------------------------------------
-- 4. posts  (community feed — comunicación)
-- ---------------------------------------------------------------------------
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  author_id    uuid not null references auth.users(id),
  kind         text not null default 'mensaje', -- aviso | mensaje
  title        text,
  body         text not null,
  created_at   timestamptz not null default now()
);

alter table public.posts enable row level security;

drop policy if exists "posts_select_member" on public.posts;
create policy "posts_select_member"
  on public.posts for select to authenticated
  using (public.is_member(community_id));

drop policy if exists "posts_insert_member" on public.posts;
create policy "posts_insert_member"
  on public.posts for insert to authenticated
  with check (public.is_member(community_id) and author_id = auth.uid());

drop policy if exists "posts_delete_author" on public.posts;
create policy "posts_delete_author"
  on public.posts for delete to authenticated
  using (author_id = auth.uid() or public.is_board(community_id));

-- ---------------------------------------------------------------------------
-- 5. proposals + votes  (decisiones y votaciones)
-- ---------------------------------------------------------------------------
create table if not exists public.proposals (
  id           uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  author_id    uuid not null references auth.users(id),
  title        text not null,
  description  text,
  status       text not null default 'abierta', -- abierta | cerrada
  created_at   timestamptz not null default now(),
  closed_at    timestamptz
);

create table if not exists public.votes (
  id          uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  choice      text not null check (choice in ('si', 'no', 'abstencion')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (proposal_id, user_id)
);

alter table public.proposals enable row level security;
alter table public.votes     enable row level security;

-- Helper: resolve a proposal's community without tripping RLS recursion.
create or replace function public.proposal_community(pid uuid)
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select community_id from public.proposals where id = pid;
$$;
grant execute on function public.proposal_community(uuid) to authenticated;

drop policy if exists "proposals_select_member" on public.proposals;
create policy "proposals_select_member"
  on public.proposals for select to authenticated
  using (public.is_member(community_id));

drop policy if exists "proposals_insert_member" on public.proposals;
create policy "proposals_insert_member"
  on public.proposals for insert to authenticated
  with check (public.is_member(community_id) and author_id = auth.uid());

drop policy if exists "proposals_update_author_or_board" on public.proposals;
create policy "proposals_update_author_or_board"
  on public.proposals for update to authenticated
  using (author_id = auth.uid() or public.is_board(community_id))
  with check (author_id = auth.uid() or public.is_board(community_id));

-- votes: transparent within a community (voto trazable) — every member can see
-- who voted what; each member manages only their own vote.
drop policy if exists "votes_select_member" on public.votes;
create policy "votes_select_member"
  on public.votes for select to authenticated
  using (public.is_member(public.proposal_community(proposal_id)));

drop policy if exists "votes_insert_self" on public.votes;
create policy "votes_insert_self"
  on public.votes for insert to authenticated
  with check (
    user_id = auth.uid()
    and public.is_member(public.proposal_community(proposal_id))
  );

drop policy if exists "votes_update_self" on public.votes;
create policy "votes_update_self"
  on public.votes for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 6. actas  (constancia — permanent record of decisions)
-- ---------------------------------------------------------------------------
create table if not exists public.actas (
  id                 uuid primary key default gen_random_uuid(),
  community_id       uuid not null references public.communities(id) on delete cascade,
  proposal_id        uuid references public.proposals(id) on delete set null,
  title              text not null,
  body               text,
  result_si          integer not null default 0,
  result_no          integer not null default 0,
  result_abstencion  integer not null default 0,
  decided_at         timestamptz not null default now(),
  created_at         timestamptz not null default now()
);

alter table public.actas enable row level security;

drop policy if exists "actas_select_member" on public.actas;
create policy "actas_select_member"
  on public.actas for select to authenticated
  using (public.is_member(community_id));

drop policy if exists "actas_insert_member" on public.actas;
create policy "actas_insert_member"
  on public.actas for insert to authenticated
  with check (public.is_member(community_id));

-- close_proposal: tally the votes, mark the proposal cerrada, and write an acta.
create or replace function public.close_proposal(p_proposal uuid)
returns public.actas
language plpgsql
security definer
set search_path = public
as $$
declare
  pr      public.proposals;
  a       public.actas;
  v_si    int;
  v_no    int;
  v_abs   int;
  outcome text;
begin
  select * into pr from public.proposals where id = p_proposal;
  if pr.id is null then
    raise exception 'Propuesta no encontrada';
  end if;
  if not public.is_board(pr.community_id) and pr.author_id <> auth.uid() then
    raise exception 'Solo el autor o la junta pueden cerrar la votación';
  end if;

  update public.proposals
    set status = 'cerrada', closed_at = now()
    where id = p_proposal;

  select
    count(*) filter (where choice = 'si'),
    count(*) filter (where choice = 'no'),
    count(*) filter (where choice = 'abstencion')
    into v_si, v_no, v_abs
    from public.votes where proposal_id = p_proposal;

  outcome := case
    when v_si > v_no then 'Aprobada'
    when v_no > v_si then 'Rechazada'
    else 'Sin mayoría (empate)'
  end;

  insert into public.actas (community_id, proposal_id, title, body,
                            result_si, result_no, result_abstencion)
  values (
    pr.community_id, pr.id, pr.title,
    format('%s. Resultado de la votación: Sí %s · No %s · Abstenciones %s.',
           outcome, v_si, v_no, v_abs),
    v_si, v_no, v_abs
  )
  returning * into a;

  return a;
end;
$$;

grant execute on function public.close_proposal(uuid) to authenticated;

-- ============================================================================
-- Done. Remember to disable "Confirm email" in Auth settings for the demo
-- (Dashboard → Authentication → Providers → Email) so signups log in instantly.
-- ============================================================================
