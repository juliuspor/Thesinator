alter table public.future_sessions
  add column if not exists swarm_status text not null default 'queued'
    check (swarm_status in ('queued', 'preparing', 'running', 'ready', 'failed')),
  add column if not exists swarm_stage_label text,
  add column if not exists swarm_progress integer not null default 0
    check (swarm_progress between 0 and 100),
  add column if not exists swarm_simulation_id text,
  add column if not exists swarm_prepare_task_id text,
  add column if not exists swarm_runner_status text,
  add column if not exists swarm_error text;

create index if not exists idx_future_sessions_swarm_status
  on public.future_sessions (swarm_status);
