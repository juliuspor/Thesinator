create or replace function public.refresh_topic_search_documents()
returns void
language sql
as $$
  update public.topics t
  set
    search_document = public.topic_search_document(t.id),
    updated_at = now()
  where t.id is not null;
$$;
