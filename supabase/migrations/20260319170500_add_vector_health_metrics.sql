create or replace function public.get_thesinator_vector_health()
returns table (
  topics_total bigint,
  topics_with_embedding bigint,
  topics_embedding_coverage double precision,
  profiles_total bigint,
  profiles_with_embedding bigint,
  profiles_embedding_coverage double precision,
  matches_total bigint,
  matches_used_vector bigint,
  matches_used_vector_rate double precision,
  completed_sessions_total bigint,
  completed_sessions_with_vector bigint,
  completed_sessions_with_vector_rate double precision
)
language sql
security definer
set search_path = public
as $$
  with topic_stats as (
    select
      count(*)::bigint as total,
      count(*) filter (where embedding is not null)::bigint as with_embedding
    from public.topics
  ),
  profile_stats as (
    select
      count(*)::bigint as total,
      count(*) filter (where embedding is not null)::bigint as with_embedding
    from public.thesinator_search_profiles
  ),
  match_stats as (
    select
      count(*)::bigint as total,
      count(*) filter (where coalesce(reason ->> 'used_vector', 'false') = 'true')::bigint as used_vector
    from public.thesinator_topic_matches
  ),
  session_stats as (
    select
      count(*) filter (where s.status = 'completed')::bigint as total_completed,
      count(distinct s.id) filter (
        where s.status = 'completed'
          and coalesce(m.reason ->> 'used_vector', 'false') = 'true'
      )::bigint as completed_with_vector
    from public.thesinator_sessions s
    left join public.thesinator_topic_matches m on m.session_id = s.id
  )
  select
    t.total as topics_total,
    t.with_embedding as topics_with_embedding,
    case
      when t.total = 0 then 0::double precision
      else t.with_embedding::double precision / t.total::double precision
    end as topics_embedding_coverage,
    p.total as profiles_total,
    p.with_embedding as profiles_with_embedding,
    case
      when p.total = 0 then 0::double precision
      else p.with_embedding::double precision / p.total::double precision
    end as profiles_embedding_coverage,
    m.total as matches_total,
    m.used_vector as matches_used_vector,
    case
      when m.total = 0 then 0::double precision
      else m.used_vector::double precision / m.total::double precision
    end as matches_used_vector_rate,
    s.total_completed as completed_sessions_total,
    s.completed_with_vector as completed_sessions_with_vector,
    case
      when s.total_completed = 0 then 0::double precision
      else s.completed_with_vector::double precision / s.total_completed::double precision
    end as completed_sessions_with_vector_rate
  from topic_stats t
  cross join profile_stats p
  cross join match_stats m
  cross join session_stats s;
$$;

grant execute on function public.get_thesinator_vector_health() to service_role;
