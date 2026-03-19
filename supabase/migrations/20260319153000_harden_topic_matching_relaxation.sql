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
  with base_context as (
    select
      s.id as session_id,
      s.context_snapshot,
      p.embedding as profile_embedding,
      nullif(lower(trim(s.context_snapshot ->> 'goal_type')), '') as goal_type_raw,
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
  session_context as (
    select
      bc.*,
      case
        when bc.goal_type_raw in ('industry_collaboration', 'job', 'career', 'employment') then 'job'
        when bc.goal_type_raw in ('topic', 'research', 'academia', 'thesis') then 'topic'
        else null
      end as primary_type,
      case
        when bc.goal_type_raw = 'industry_collaboration' then 'topic'
        else null
      end as fallback_type
    from base_context bc
  ),
  stage_definitions as (
    select *
    from (
      values
        (1, 'primary'::text, 2::integer, true, true, true),
        (2, 'both'::text, 2::integer, true, true, true),
        (3, 'none'::text, 2::integer, true, true, true),
        (4, 'none'::text, 4::integer, true, true, true),
        (5, 'none'::text, null::integer, true, true, true),
        (6, 'none'::text, null::integer, true, true, false),
        (7, 'none'::text, null::integer, true, false, false),
        (8, 'none'::text, null::integer, false, false, false)
    ) as cfg(stage, type_mode, duration_tolerance, enforce_paid, enforce_nda, enforce_publish)
  ),
  stage_candidates as (
    select
      cfg.stage,
      cfg.type_mode,
      cfg.duration_tolerance,
      cfg.enforce_paid,
      cfg.enforce_nda,
      cfg.enforce_publish,
      t.id as topic_id,
      t.title,
      t.duration_months,
      t.paid,
      t.nda_required,
      t.publish_allowed,
      t.remote_ok as topic_remote_ok,
      t.type as topic_type,
      t.location_city,
      t.description,
      c.name as company_name,
      c.industry as company_industry,
      sc.primary_type,
      sc.fallback_type,
      sc.duration_months as desired_duration,
      sc.paid_required,
      sc.nda_ok,
      sc.publish_required,
      sc.remote_ok as remote_preference,
      sc.target_industry,
      sc.preferred_cities,
      sc.refined_interests,
      (sc.profile_embedding is not null and t.embedding is not null) as has_vector,
      case
        when sc.profile_embedding is not null and t.embedding is not null
          then greatest(0::double precision, 1 - (sc.profile_embedding <=> t.embedding))
        else 0::double precision
      end as vector_score,
      case
        when sc.primary_type is null then true
        when lower(t.type) = sc.primary_type then true
        when sc.fallback_type is not null and lower(t.type) = sc.fallback_type then true
        else false
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
    cross join stage_definitions cfg
    join public.topics t on true
    left join public.companies c on c.id = t.company_id
    where
      (
        cfg.type_mode = 'none'
        or sc.primary_type is null
        or (cfg.type_mode = 'primary' and lower(t.type) = sc.primary_type)
        or (
          cfg.type_mode = 'both'
          and (
            lower(t.type) = sc.primary_type
            or (sc.fallback_type is not null and lower(t.type) = sc.fallback_type)
          )
        )
      )
      and (
        cfg.duration_tolerance is null
        or sc.duration_months is null
        or t.duration_months is null
        or abs(t.duration_months - sc.duration_months) <= cfg.duration_tolerance
      )
      and (
        cfg.enforce_paid is false
        or sc.paid_required is distinct from true
        or coalesce(t.paid, false) = true
      )
      and (
        cfg.enforce_nda is false
        or sc.nda_ok is distinct from false
        or coalesce(t.nda_required, false) = false
      )
      and (
        cfg.enforce_publish is false
        or sc.publish_required is distinct from true
        or coalesce(t.publish_allowed, false) = true
      )
  ),
  stage_counts as (
    select
      stage,
      count(*)::integer as candidate_count
    from stage_candidates
    group by stage
  ),
  selected_stage as (
    select
      cfg.stage,
      cfg.type_mode,
      cfg.duration_tolerance,
      cfg.enforce_paid,
      cfg.enforce_nda,
      cfg.enforce_publish,
      coalesce(sc.candidate_count, 0)::integer as candidate_count
    from stage_definitions cfg
    left join stage_counts sc on sc.stage = cfg.stage
    where cfg.stage = coalesce(
      (select min(stage) from stage_counts where candidate_count >= v_limit),
      (select max(stage) from stage_definitions)
    )
    limit 1
  ),
  scored as (
    select
      c.topic_id,
      c.title,
      c.vector_score,
      c.has_vector,
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
      c.goal_type_match,
      c.industry_match,
      c.city_match,
      c.remote_match,
      c.interest_match,
      c.duration_match,
      c.target_industry,
      c.preferred_cities,
      c.refined_interests,
      ss.stage as relaxation_stage,
      ss.candidate_count as total_candidates,
      ss.type_mode,
      ss.duration_tolerance,
      ss.enforce_paid,
      ss.enforce_nda,
      ss.enforce_publish
    from stage_candidates c
    join selected_stage ss on ss.stage = c.stage
  ),
  ranked as (
    select
      row_number() over (
        order by
          (
            case
              when s.has_vector
                then ((0.70 * s.vector_score) + (0.30 * s.structured_score))
              else s.structured_score
            end
          ) desc,
          s.topic_id
      ) as rank,
      s.topic_id,
      s.title,
      (
        case
          when s.has_vector
            then ((0.70 * s.vector_score) + (0.30 * s.structured_score))
          else s.structured_score
        end
      )::double precision as final_score,
      s.vector_score,
      s.structured_score,
      jsonb_build_object(
        'goal_type_match', s.goal_type_match,
        'industry_match', s.industry_match,
        'city_match', s.city_match,
        'remote_match', s.remote_match,
        'interest_match', s.interest_match,
        'duration_match', s.duration_match,
        'target_industry', s.target_industry,
        'preferred_cities', s.preferred_cities,
        'refined_interests', s.refined_interests,
        'used_vector', s.has_vector,
        'relaxation_stage', s.relaxation_stage,
        'total_candidates', s.total_candidates,
        'filters', jsonb_build_object(
          'type_mode', s.type_mode,
          'duration_tolerance', s.duration_tolerance,
          'paid_enforced', s.enforce_paid,
          'nda_enforced', s.enforce_nda,
          'publish_enforced', s.enforce_publish
        )
      ) as reason
    from scored s
    order by final_score desc, s.topic_id
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
