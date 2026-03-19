create extension if not exists vector;

create or replace function public.make_source_id(p_prefix text, p_entity_id uuid)
returns text
language plpgsql
immutable
as $$
declare
  suffix text;
  suffix_num bigint;
  compact_uuid text;
begin
  suffix := right(p_entity_id::text, 12);

  if suffix ~ '^[0-9]+$' then
    suffix_num := suffix::bigint;
    if suffix_num between 1 and 9999 then
      return lower(p_prefix) || '-' || lpad(suffix_num::text, 2, '0');
    end if;
  end if;

  compact_uuid := replace(p_entity_id::text, '-', '');
  return lower(p_prefix) || '-' || substr(compact_uuid, 1, 12);
end;
$$;

create or replace function public.populate_source_id()
returns trigger
language plpgsql
as $$
declare
  prefix text := coalesce(TG_ARGV[0], 'entity');
begin
  if new.source_id is null or length(trim(new.source_id)) = 0 then
    new.source_id := public.make_source_id(prefix, new.id);
  end if;

  new.source_id := lower(trim(new.source_id));
  return new;
end;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.universities (
  id uuid primary key,
  source_id text unique,
  name text not null,
  country text not null,
  website text,
  domains text[] not null default '{}'::text[],
  about text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fields (
  id uuid primary key,
  source_id text unique,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.study_programs (
  id uuid primary key,
  source_id text unique,
  university_id uuid not null references public.universities (id) on delete cascade,
  name text not null,
  degree text not null check (degree in ('bsc', 'msc', 'phd')),
  about text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.companies (
  id uuid primary key,
  source_id text unique,
  name text not null,
  description text,
  industry text,
  size text,
  website text,
  domains text[] not null default '{}'::text[],
  about text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.supervisors (
  id uuid primary key,
  source_id text unique,
  university_id uuid not null references public.universities (id) on delete cascade,
  title text,
  first_name text not null,
  last_name text not null,
  email text unique,
  research_interests text[] not null default '{}'::text[],
  objectives text[] not null default '{}'::text[],
  about text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experts (
  id uuid primary key,
  source_id text unique,
  company_id uuid not null references public.companies (id) on delete cascade,
  title text,
  first_name text not null,
  last_name text not null,
  email text unique,
  offer_interviews boolean,
  objectives text[] not null default '{}'::text[],
  about text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.topics (
  id uuid primary key,
  source_id text unique,
  title text not null,
  description text not null,
  type text not null check (type in ('topic', 'job')),
  status text not null default 'open',
  company_id uuid references public.companies (id) on delete set null,
  university_id uuid references public.universities (id) on delete set null,
  location_city text,
  remote_ok boolean,
  duration_months integer check (duration_months is null or duration_months between 1 and 24),
  paid boolean,
  nda_required boolean,
  publish_allowed boolean,
  employment text check (employment in ('yes', 'no', 'open')),
  employment_type text check (employment_type in ('internship', 'working_student', 'graduate_program', 'direct_entry')),
  workplace_type text check (workplace_type in ('on_site', 'hybrid', 'remote')),
  degrees text[] not null default '{}'::text[],
  search_document text,
  embedding vector(1536),
  embedding_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint topics_host_xor check (num_nonnulls(company_id, university_id) = 1)
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  source_id text unique,
  auth_user_id uuid references auth.users (id) on delete set null,
  first_name text not null,
  last_name text not null,
  email text not null unique,
  degree text not null check (degree in ('bsc', 'msc', 'phd')),
  study_program_id uuid not null references public.study_programs (id) on delete restrict,
  university_id uuid not null references public.universities (id) on delete restrict,
  skills text[] not null default '{}'::text[],
  objectives text[] not null default '{}'::text[],
  about text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.thesis_projects (
  id uuid primary key default gen_random_uuid(),
  source_id text unique,
  title text not null,
  description text,
  motivation text,
  state text not null check (state in ('proposed', 'applied', 'withdrawn', 'rejected', 'agreed', 'in_progress', 'canceled', 'completed')),
  student_id uuid not null references public.students (id) on delete cascade,
  topic_id uuid references public.topics (id) on delete set null,
  company_id uuid references public.companies (id) on delete set null,
  university_id uuid references public.universities (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.supervisor_fields (
  supervisor_id uuid not null references public.supervisors (id) on delete cascade,
  field_id uuid not null references public.fields (id) on delete cascade,
  primary key (supervisor_id, field_id)
);

create table if not exists public.expert_fields (
  expert_id uuid not null references public.experts (id) on delete cascade,
  field_id uuid not null references public.fields (id) on delete cascade,
  primary key (expert_id, field_id)
);

create table if not exists public.topic_fields (
  topic_id uuid not null references public.topics (id) on delete cascade,
  field_id uuid not null references public.fields (id) on delete cascade,
  primary key (topic_id, field_id)
);

create table if not exists public.topic_supervisors (
  topic_id uuid not null references public.topics (id) on delete cascade,
  supervisor_id uuid not null references public.supervisors (id) on delete cascade,
  primary key (topic_id, supervisor_id)
);

create table if not exists public.topic_experts (
  topic_id uuid not null references public.topics (id) on delete cascade,
  expert_id uuid not null references public.experts (id) on delete cascade,
  primary key (topic_id, expert_id)
);

create table if not exists public.student_fields (
  student_id uuid not null references public.students (id) on delete cascade,
  field_id uuid not null references public.fields (id) on delete cascade,
  primary key (student_id, field_id)
);

create table if not exists public.project_supervisors (
  project_id uuid not null references public.thesis_projects (id) on delete cascade,
  supervisor_id uuid not null references public.supervisors (id) on delete cascade,
  primary key (project_id, supervisor_id)
);

create table if not exists public.project_experts (
  project_id uuid not null references public.thesis_projects (id) on delete cascade,
  expert_id uuid not null references public.experts (id) on delete cascade,
  primary key (project_id, expert_id)
);

create table if not exists public.thesinator_search_profiles (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.thesinator_sessions (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  context_snapshot jsonb not null,
  transcript_text text not null,
  profile_document text not null,
  embedding vector(1536),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.thesinator_topic_matches (
  session_id uuid not null references public.thesinator_sessions (id) on delete cascade,
  topic_id uuid not null references public.topics (id) on delete cascade,
  rank integer not null check (rank > 0),
  vector_score double precision not null,
  structured_score double precision not null,
  final_score double precision not null,
  reason jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  primary key (session_id, topic_id),
  unique (session_id, rank)
);

create index if not exists idx_universities_source_id on public.universities (source_id);
create index if not exists idx_fields_source_id on public.fields (source_id);
create index if not exists idx_study_programs_source_id on public.study_programs (source_id);
create index if not exists idx_companies_source_id on public.companies (source_id);
create index if not exists idx_supervisors_source_id on public.supervisors (source_id);
create index if not exists idx_experts_source_id on public.experts (source_id);
create index if not exists idx_topics_source_id on public.topics (source_id);
create index if not exists idx_topics_type on public.topics (type);
create index if not exists idx_topics_status on public.topics (status);
create index if not exists idx_topics_company_id on public.topics (company_id);
create index if not exists idx_topics_university_id on public.topics (university_id);
create index if not exists idx_topics_embedding on public.topics using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index if not exists idx_students_source_id on public.students (source_id);
create index if not exists idx_projects_source_id on public.thesis_projects (source_id);
create index if not exists idx_search_profiles_session_id on public.thesinator_search_profiles (session_id);
create index if not exists idx_topic_matches_session_rank on public.thesinator_topic_matches (session_id, rank);

create trigger trg_universities_source_id
before insert or update on public.universities
for each row
execute function public.populate_source_id('uni');

create trigger trg_fields_source_id
before insert or update on public.fields
for each row
execute function public.populate_source_id('field');

create trigger trg_study_programs_source_id
before insert or update on public.study_programs
for each row
execute function public.populate_source_id('program');

create trigger trg_companies_source_id
before insert or update on public.companies
for each row
execute function public.populate_source_id('company');

create trigger trg_supervisors_source_id
before insert or update on public.supervisors
for each row
execute function public.populate_source_id('supervisor');

create trigger trg_experts_source_id
before insert or update on public.experts
for each row
execute function public.populate_source_id('expert');

create trigger trg_topics_source_id
before insert or update on public.topics
for each row
execute function public.populate_source_id('topic');

create trigger trg_students_source_id
before insert or update on public.students
for each row
execute function public.populate_source_id('student');

create trigger trg_thesis_projects_source_id
before insert or update on public.thesis_projects
for each row
execute function public.populate_source_id('project');

create trigger trg_universities_updated_at
before update on public.universities
for each row
execute function public.set_updated_at();

create trigger trg_fields_updated_at
before update on public.fields
for each row
execute function public.set_updated_at();

create trigger trg_study_programs_updated_at
before update on public.study_programs
for each row
execute function public.set_updated_at();

create trigger trg_companies_updated_at
before update on public.companies
for each row
execute function public.set_updated_at();

create trigger trg_supervisors_updated_at
before update on public.supervisors
for each row
execute function public.set_updated_at();

create trigger trg_experts_updated_at
before update on public.experts
for each row
execute function public.set_updated_at();

create trigger trg_topics_updated_at
before update on public.topics
for each row
execute function public.set_updated_at();

create trigger trg_students_updated_at
before update on public.students
for each row
execute function public.set_updated_at();

create trigger trg_thesis_projects_updated_at
before update on public.thesis_projects
for each row
execute function public.set_updated_at();

create trigger trg_thesinator_search_profiles_updated_at
before update on public.thesinator_search_profiles
for each row
execute function public.set_updated_at();

alter table public.universities
  alter column source_id set not null;
alter table public.fields
  alter column source_id set not null;
alter table public.study_programs
  alter column source_id set not null;
alter table public.companies
  alter column source_id set not null;
alter table public.supervisors
  alter column source_id set not null;
alter table public.experts
  alter column source_id set not null;
alter table public.topics
  alter column source_id set not null;
alter table public.students
  alter column source_id set not null;
alter table public.thesis_projects
  alter column source_id set not null;

create or replace function public.topic_search_document(p_topic_id uuid)
returns text
language sql
stable
as $$
  select concat_ws(
    E'\n',
    t.title,
    t.description,
    coalesce(t.type, ''),
    coalesce(t.status, ''),
    coalesce(array_to_string(t.degrees, ', '), ''),
    coalesce(c.name, ''),
    coalesce(c.industry, ''),
    coalesce(u.name, ''),
    coalesce(u.country, ''),
    coalesce((
      select string_agg(distinct f.name, ', ')
      from public.topic_fields tf
      join public.fields f on f.id = tf.field_id
      where tf.topic_id = t.id
    ), ''),
    coalesce((
      select string_agg(distinct e.first_name || ' ' || e.last_name, ', ')
      from public.topic_experts te
      join public.experts e on e.id = te.expert_id
      where te.topic_id = t.id
    ), ''),
    coalesce((
      select string_agg(distinct s.first_name || ' ' || s.last_name, ', ')
      from public.topic_supervisors ts
      join public.supervisors s on s.id = ts.supervisor_id
      where ts.topic_id = t.id
    ), '')
  )
  from public.topics t
  left join public.companies c on c.id = t.company_id
  left join public.universities u on u.id = t.university_id
  where t.id = p_topic_id;
$$;

create or replace function public.refresh_topic_search_documents()
returns void
language sql
as $$
  update public.topics t
  set
    search_document = public.topic_search_document(t.id),
    updated_at = now();
$$;

create or replace function public.upsert_thesinator_search_profile(
  p_session_id uuid,
  p_user_id uuid,
  p_context_snapshot jsonb,
  p_transcript_text text,
  p_profile_document text,
  p_embedding float8[]
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.thesinator_search_profiles (
    session_id,
    user_id,
    context_snapshot,
    transcript_text,
    profile_document,
    embedding
  )
  values (
    p_session_id,
    p_user_id,
    p_context_snapshot,
    p_transcript_text,
    p_profile_document,
    case when p_embedding is null then null else p_embedding::vector end
  )
  on conflict (session_id)
  do update set
    user_id = excluded.user_id,
    context_snapshot = excluded.context_snapshot,
    transcript_text = excluded.transcript_text,
    profile_document = excluded.profile_document,
    embedding = excluded.embedding,
    updated_at = now();
end;
$$;

create or replace function public.set_topic_embedding(
  p_topic_id uuid,
  p_embedding float8[]
)
returns void
language sql
security definer
set search_path = public
as $$
  update public.topics
  set
    embedding = p_embedding::vector,
    embedding_updated_at = now(),
    updated_at = now()
  where id = p_topic_id;
$$;

create or replace function public.refresh_session_top_topics(
  p_session_id uuid,
  p_limit integer default 5
)
returns table (
  rank integer,
  topic_id uuid,
  title text,
  final_score double precision,
  vector_score double precision,
  structured_score double precision,
  reason jsonb
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_limit integer := greatest(1, least(coalesce(p_limit, 5), 20));
begin
  if not exists (select 1 from public.thesinator_sessions where id = p_session_id) then
    raise exception 'Session % does not exist', p_session_id;
  end if;

  delete from public.thesinator_topic_matches where session_id = p_session_id;

  insert into public.thesinator_topic_matches (
    session_id,
    topic_id,
    rank,
    vector_score,
    structured_score,
    final_score,
    reason
  )
  with session_context as (
    select
      s.id as session_id,
      s.context_snapshot,
      p.embedding as profile_embedding,
      nullif(lower(trim(s.context_snapshot ->> 'goal_type')), '') as goal_type,
      case
        when jsonb_typeof(s.context_snapshot -> 'duration_months') = 'number'
          then (s.context_snapshot ->> 'duration_months')::integer
        else null
      end as duration_months,
      case
        when jsonb_typeof(s.context_snapshot -> 'paid_required') = 'boolean'
          then (s.context_snapshot ->> 'paid_required')::boolean
        else null
      end as paid_required,
      case
        when jsonb_typeof(s.context_snapshot -> 'nda_ok') = 'boolean'
          then (s.context_snapshot ->> 'nda_ok')::boolean
        else null
      end as nda_ok,
      case
        when jsonb_typeof(s.context_snapshot -> 'publish_required') = 'boolean'
          then (s.context_snapshot ->> 'publish_required')::boolean
        else null
      end as publish_required,
      case
        when jsonb_typeof(s.context_snapshot -> 'remote_ok') = 'boolean'
          then (s.context_snapshot ->> 'remote_ok')::boolean
        else null
      end as remote_ok,
      coalesce(
        array(
          select lower(trim(value))
          from jsonb_array_elements_text(coalesce(s.context_snapshot -> 'target_industry', '[]'::jsonb)) value
          where trim(value) <> ''
        ),
        '{}'::text[]
      ) as target_industry,
      coalesce(
        array(
          select lower(trim(value))
          from jsonb_array_elements_text(coalesce(s.context_snapshot -> 'preferred_cities', '[]'::jsonb)) value
          where trim(value) <> ''
        ),
        '{}'::text[]
      ) as preferred_cities,
      coalesce(
        array(
          select lower(trim(value))
          from jsonb_array_elements_text(coalesce(s.context_snapshot -> 'refined_interests', '[]'::jsonb)) value
          where trim(value) <> ''
        ),
        '{}'::text[]
      ) as refined_interests
    from public.thesinator_sessions s
    left join public.thesinator_search_profiles p on p.session_id = s.id
    where s.id = p_session_id
  ),
  candidates as (
    select
      t.id as topic_id,
      t.title,
      t.type,
      t.duration_months,
      t.paid,
      t.nda_required,
      t.publish_allowed,
      t.remote_ok,
      c.name as company_name,
      c.industry as company_industry,
      t.location_city,
      sc.goal_type,
      sc.duration_months as desired_duration,
      sc.paid_required,
      sc.nda_ok,
      sc.publish_required,
      sc.remote_ok as remote_preference,
      sc.target_industry,
      sc.preferred_cities,
      sc.refined_interests,
      case
        when sc.profile_embedding is not null and t.embedding is not null
          then greatest(0::double precision, 1 - (sc.profile_embedding <=> t.embedding))
        else 0::double precision
      end as vector_score,
      case
        when sc.goal_type is null then true
        else lower(t.type) = sc.goal_type
      end as goal_type_match,
      case
        when cardinality(sc.target_industry) = 0 then false
        else exists (
          select 1
          from unnest(sc.target_industry) as i(val)
          where
            lower(coalesce(c.industry, '')) like '%' || i.val || '%'
            or lower(coalesce(c.name, '')) like '%' || i.val || '%'
        )
      end as industry_match,
      case
        when cardinality(sc.preferred_cities) = 0 then false
        else exists (
          select 1
          from unnest(sc.preferred_cities) as city(val)
          where lower(coalesce(t.location_city, '')) like '%' || city.val || '%'
        )
      end as city_match,
      case
        when sc.remote_ok is true then coalesce(t.remote_ok, false)
        else false
      end as remote_match,
      case
        when cardinality(sc.refined_interests) = 0 then false
        else exists (
          select 1
          from unnest(sc.refined_interests) as ri(val)
          where
            lower(coalesce(t.title, '')) like '%' || ri.val || '%'
            or lower(coalesce(t.description, '')) like '%' || ri.val || '%'
            or exists (
              select 1
              from public.topic_fields tf
              join public.fields f on f.id = tf.field_id
              where tf.topic_id = t.id
                and lower(f.name) like '%' || ri.val || '%'
            )
        )
      end as interest_match,
      case
        when sc.duration_months is null or t.duration_months is null then false
        when abs(t.duration_months - sc.duration_months) <= 1 then true
        else false
      end as duration_match
    from session_context sc
    join public.topics t on true
    left join public.companies c on c.id = t.company_id
    where
      (sc.goal_type is null or lower(t.type) = sc.goal_type)
      and (sc.duration_months is null or t.duration_months is null or abs(t.duration_months - sc.duration_months) <= 2)
      and (sc.paid_required is distinct from true or coalesce(t.paid, false) = true)
      and (sc.nda_ok is distinct from false or coalesce(t.nda_required, false) = false)
      and (sc.publish_required is distinct from true or coalesce(t.publish_allowed, false) = true)
  ),
  scored as (
    select
      c.topic_id,
      c.title,
      c.vector_score,
      least(
        1::double precision,
        (
          (case when c.goal_type_match then 0.20 else 0 end) +
          (case when c.industry_match then 0.20 else 0 end) +
          (case when c.city_match then 0.15 else 0 end) +
          (case when c.remote_match then 0.10 else 0 end) +
          (case when c.interest_match then 0.25 else 0 end) +
          (case when c.duration_match then 0.10 else 0 end)
        )::double precision
      ) as structured_score,
      jsonb_build_object(
        'goal_type_match', c.goal_type_match,
        'industry_match', c.industry_match,
        'city_match', c.city_match,
        'remote_match', c.remote_match,
        'interest_match', c.interest_match,
        'duration_match', c.duration_match,
        'target_industry', c.target_industry,
        'preferred_cities', c.preferred_cities,
        'refined_interests', c.refined_interests
      ) as reason
    from candidates c
  ),
  ranked as (
    select
      row_number() over (order by ((0.70 * s.vector_score) + (0.30 * s.structured_score)) desc, s.topic_id) as rank,
      s.topic_id,
      s.title,
      ((0.70 * s.vector_score) + (0.30 * s.structured_score))::double precision as final_score,
      s.vector_score,
      s.structured_score,
      s.reason
    from scored s
    order by ((0.70 * s.vector_score) + (0.30 * s.structured_score)) desc, s.topic_id
    limit v_limit
  )
  select
    p_session_id,
    r.topic_id,
    r.rank,
    r.vector_score,
    r.structured_score,
    r.final_score,
    r.reason
  from ranked r;

  return query
  select
    m.rank,
    m.topic_id,
    t.title,
    m.final_score,
    m.vector_score,
    m.structured_score,
    m.reason
  from public.thesinator_topic_matches m
  join public.topics t on t.id = m.topic_id
  where m.session_id = p_session_id
  order by m.rank
  limit v_limit;
end;
$$;

create or replace function public.get_top_thesis_topics(
  p_session_id uuid,
  p_limit integer default 5
)
returns table (
  rank integer,
  topic_id uuid,
  title text,
  final_score double precision,
  vector_score double precision,
  structured_score double precision,
  reason jsonb
)
language sql
security invoker
set search_path = public
as $$
  select
    m.rank,
    m.topic_id,
    t.title,
    m.final_score,
    m.vector_score,
    m.structured_score,
    m.reason
  from public.thesinator_topic_matches m
  join public.topics t on t.id = m.topic_id
  where m.session_id = p_session_id
  order by m.rank
  limit greatest(1, least(coalesce(p_limit, 5), 20));
$$;

grant execute on function public.refresh_topic_search_documents() to service_role;
grant execute on function public.upsert_thesinator_search_profile(uuid, uuid, jsonb, text, text, float8[]) to service_role;
grant execute on function public.set_topic_embedding(uuid, float8[]) to service_role;
grant execute on function public.refresh_session_top_topics(uuid, integer) to service_role;
grant execute on function public.get_top_thesis_topics(uuid, integer) to anon, authenticated;

alter table public.universities enable row level security;
alter table public.fields enable row level security;
alter table public.study_programs enable row level security;
alter table public.companies enable row level security;
alter table public.supervisors enable row level security;
alter table public.experts enable row level security;
alter table public.topics enable row level security;
alter table public.students enable row level security;
alter table public.thesis_projects enable row level security;
alter table public.supervisor_fields enable row level security;
alter table public.expert_fields enable row level security;
alter table public.topic_fields enable row level security;
alter table public.topic_supervisors enable row level security;
alter table public.topic_experts enable row level security;
alter table public.student_fields enable row level security;
alter table public.project_supervisors enable row level security;
alter table public.project_experts enable row level security;
alter table public.thesinator_search_profiles enable row level security;
alter table public.thesinator_topic_matches enable row level security;

create policy "universities read public"
  on public.universities
  for select
  to anon, authenticated
  using (true);

create policy "fields read public"
  on public.fields
  for select
  to anon, authenticated
  using (true);

create policy "study programs read public"
  on public.study_programs
  for select
  to anon, authenticated
  using (true);

create policy "companies read public"
  on public.companies
  for select
  to anon, authenticated
  using (true);

create policy "supervisors read public"
  on public.supervisors
  for select
  to anon, authenticated
  using (true);

create policy "experts read public"
  on public.experts
  for select
  to anon, authenticated
  using (true);

create policy "topics read public"
  on public.topics
  for select
  to anon, authenticated
  using (true);

create policy "students read public"
  on public.students
  for select
  to anon, authenticated
  using (true);

create policy "thesis projects read public"
  on public.thesis_projects
  for select
  to anon, authenticated
  using (true);

create policy "supervisor fields read public"
  on public.supervisor_fields
  for select
  to anon, authenticated
  using (true);

create policy "expert fields read public"
  on public.expert_fields
  for select
  to anon, authenticated
  using (true);

create policy "topic fields read public"
  on public.topic_fields
  for select
  to anon, authenticated
  using (true);

create policy "topic supervisors read public"
  on public.topic_supervisors
  for select
  to anon, authenticated
  using (true);

create policy "topic experts read public"
  on public.topic_experts
  for select
  to anon, authenticated
  using (true);

create policy "student fields read public"
  on public.student_fields
  for select
  to anon, authenticated
  using (true);

create policy "project supervisors read public"
  on public.project_supervisors
  for select
  to anon, authenticated
  using (true);

create policy "project experts read public"
  on public.project_experts
  for select
  to anon, authenticated
  using (true);

create policy "thesinator search profiles select own"
  on public.thesinator_search_profiles
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.thesinator_sessions s
      where s.id = thesinator_search_profiles.session_id
        and s.user_id = auth.uid()
    )
  );

create policy "thesinator topic matches select own"
  on public.thesinator_topic_matches
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.thesinator_sessions s
      where s.id = thesinator_topic_matches.session_id
        and s.user_id = auth.uid()
    )
  );

grant select on public.universities to anon, authenticated;
grant select on public.fields to anon, authenticated;
grant select on public.study_programs to anon, authenticated;
grant select on public.companies to anon, authenticated;
grant select on public.supervisors to anon, authenticated;
grant select on public.experts to anon, authenticated;
grant select on public.topics to anon, authenticated;
grant select on public.students to anon, authenticated;
grant select on public.thesis_projects to anon, authenticated;
grant select on public.supervisor_fields to anon, authenticated;
grant select on public.expert_fields to anon, authenticated;
grant select on public.topic_fields to anon, authenticated;
grant select on public.topic_supervisors to anon, authenticated;
grant select on public.topic_experts to anon, authenticated;
grant select on public.student_fields to anon, authenticated;
grant select on public.project_supervisors to anon, authenticated;
grant select on public.project_experts to anon, authenticated;
grant select on public.thesinator_search_profiles to authenticated;
grant select on public.thesinator_topic_matches to authenticated;
