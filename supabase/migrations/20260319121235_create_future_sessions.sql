create table if not exists public.future_sessions (
  id uuid primary key default gen_random_uuid(),
  thesinator_session_id uuid not null unique references public.thesinator_sessions (id) on delete cascade,
  status text not null default 'ready' check (status in ('preparing', 'ready', 'failed')),
  selected_future_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.future_session_futures (
  id uuid primary key default gen_random_uuid(),
  future_session_id uuid not null references public.future_sessions (id) on delete cascade,
  source text not null check (source in ('matched', 'generated')),
  rank integer not null check (rank between 1 and 20),
  topic_id uuid references public.topics (id) on delete set null,
  title text not null,
  saved boolean not null default false,
  preview_status text not null default 'ready' check (preview_status in ('queued', 'preparing', 'ready', 'failed')),
  deep_status text not null default 'queued' check (deep_status in ('queued', 'preparing', 'ready', 'failed')),
  card jsonb not null default '{}'::jsonb,
  detail jsonb,
  map_nodes jsonb,
  suggested_prompts jsonb not null default '[]'::jsonb,
  seed_text text,
  mirofish_simulation_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (future_session_id, rank)
);

create table if not exists public.future_session_messages (
  id uuid primary key default gen_random_uuid(),
  future_id uuid not null references public.future_session_futures (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null check (length(trim(content)) > 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_future_sessions_thesinator_session_id
  on public.future_sessions (thesinator_session_id);

create index if not exists idx_future_session_futures_future_session_id
  on public.future_session_futures (future_session_id);

create index if not exists idx_future_session_futures_saved
  on public.future_session_futures (future_session_id, saved);

create index if not exists idx_future_session_messages_future_id_created_at
  on public.future_session_messages (future_id, created_at);

drop trigger if exists trg_future_sessions_updated_at on public.future_sessions;
create trigger trg_future_sessions_updated_at
before update on public.future_sessions
for each row
execute function public.set_updated_at();

drop trigger if exists trg_future_session_futures_updated_at on public.future_session_futures;
create trigger trg_future_session_futures_updated_at
before update on public.future_session_futures
for each row
execute function public.set_updated_at();

grant select, insert, update, delete on public.future_sessions to service_role;
grant select, insert, update, delete on public.future_session_futures to service_role;
grant select, insert, update, delete on public.future_session_messages to service_role;
