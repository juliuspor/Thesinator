alter table public.future_sessions
  add column if not exists finalization_status text not null default 'queued'
    check (finalization_status in ('queued', 'preparing', 'ready', 'failed')),
  add column if not exists finalization_stage_label text,
  add column if not exists finalization_progress integer not null default 0
    check (finalization_progress between 0 and 100),
  add column if not exists finalization_error text;

create index if not exists idx_future_sessions_finalization_status
  on public.future_sessions (finalization_status);

alter table public.future_session_futures
  add column if not exists swarm_impact jsonb,
  add column if not exists display_rank integer,
  add column if not exists swarm_impact_status text not null default 'queued'
    check (swarm_impact_status in ('queued', 'preparing', 'ready', 'failed'));

update public.future_session_futures
set display_rank = rank
where display_rank is null;

alter table public.future_session_futures
  alter column display_rank set not null;

create index if not exists idx_future_session_futures_display_rank
  on public.future_session_futures (future_session_id, source, display_rank);

create index if not exists idx_future_session_futures_swarm_impact_status
  on public.future_session_futures (future_session_id, swarm_impact_status);
