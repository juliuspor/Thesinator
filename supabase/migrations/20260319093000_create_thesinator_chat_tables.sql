create extension if not exists pgcrypto;

create table if not exists public.thesinator_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  client_token text,
  status text not null default 'active' check (status in ('active', 'completed', 'failed')),
  current_question_index integer not null default 0 check (current_question_index between 0 and 6),
  context_snapshot jsonb not null default '{
    "goal_type": null,
    "target_industry": [],
    "preferred_cities": [],
    "remote_ok": null,
    "future_vision": null,
    "paid_required": null,
    "duration_months": null,
    "nda_ok": null,
    "publish_required": null,
    "existing_ideas": [],
    "refined_interests": [],
    "depth_preference": null
  }'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint thesinator_sessions_owner_check check (
    (user_id is not null and client_token is null)
    or (user_id is null and client_token is not null)
  )
);

create table if not exists public.thesinator_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.thesinator_sessions (id) on delete cascade,
  role text not null check (role in ('assistant', 'user')),
  question_id integer check (question_id between 1 and 7),
  input_mode text check (input_mode in ('mcq', 'text', 'speech')),
  content text not null check (length(trim(content)) > 0),
  created_at timestamptz not null default now(),
  constraint thesinator_messages_role_mode_check check (
    (role = 'user' and input_mode is not null)
    or (role = 'assistant' and input_mode is null)
  )
);

create index if not exists idx_thesinator_sessions_user_id
  on public.thesinator_sessions (user_id);

create index if not exists idx_thesinator_sessions_client_token
  on public.thesinator_sessions (client_token);

create index if not exists idx_thesinator_messages_session_created
  on public.thesinator_messages (session_id, created_at);

create or replace function public.set_thesinator_sessions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_thesinator_sessions_updated_at on public.thesinator_sessions;

create trigger trg_thesinator_sessions_updated_at
before update on public.thesinator_sessions
for each row
execute function public.set_thesinator_sessions_updated_at();

alter table public.thesinator_sessions enable row level security;
alter table public.thesinator_messages enable row level security;

drop policy if exists "thesinator sessions select own" on public.thesinator_sessions;
create policy "thesinator sessions select own"
  on public.thesinator_sessions
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "thesinator sessions insert own" on public.thesinator_sessions;
create policy "thesinator sessions insert own"
  on public.thesinator_sessions
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "thesinator sessions update own" on public.thesinator_sessions;
create policy "thesinator sessions update own"
  on public.thesinator_sessions
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "thesinator sessions delete own" on public.thesinator_sessions;
create policy "thesinator sessions delete own"
  on public.thesinator_sessions
  for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "thesinator messages select own" on public.thesinator_messages;
create policy "thesinator messages select own"
  on public.thesinator_messages
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.thesinator_sessions s
      where s.id = thesinator_messages.session_id
      and s.user_id = auth.uid()
    )
  );

drop policy if exists "thesinator messages insert own" on public.thesinator_messages;
create policy "thesinator messages insert own"
  on public.thesinator_messages
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.thesinator_sessions s
      where s.id = thesinator_messages.session_id
      and s.user_id = auth.uid()
    )
  );

grant select, insert, update, delete on public.thesinator_sessions to authenticated;
grant select, insert, update, delete on public.thesinator_messages to authenticated;
