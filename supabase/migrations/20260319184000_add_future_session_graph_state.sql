alter table public.future_sessions
  add column if not exists graph_status text not null default 'queued'
    check (graph_status in ('queued', 'preparing', 'ready', 'failed')),
  add column if not exists graph_stage_label text,
  add column if not exists graph_progress integer not null default 0
    check (graph_progress between 0 and 100),
  add column if not exists mirofish_project_id text,
  add column if not exists graph_task_id text,
  add column if not exists graph_id text,
  add column if not exists graph_error text;

create index if not exists idx_future_sessions_graph_status
  on public.future_sessions (graph_status);
