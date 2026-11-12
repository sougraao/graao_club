-- Authenticated curriculum preview. Does not publish lessons or expose video keys.
-- Private definer reads draft metadata; public RPC remains security invoker.
create or replace function private.academy_catalog()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  result jsonb;
begin
  if auth.uid() is null or not exists (
    select 1 from public.profiles p where p.id = auth.uid() and not p.banned
  ) then
    raise exception 'Entre na sua conta para consultar a Academia.' using errcode = '42501';
  end if;

  select coalesce(jsonb_agg(course order by position, slug), '[]'::jsonb) into result
  from (
    select t.position, t.slug, jsonb_build_object(
      'id', t.slug, 'name', t.name, 'summary', t.description,
      'tagline', coalesce(t.curriculum->>'tagline', ''),
      'status', 'em-preparacao',
      'audience', coalesce(t.curriculum->>'audience', ''),
      'notice', coalesce(t.curriculum->>'notice', ''),
      'prerequisites', coalesce(t.curriculum->'prerequisites', '[]'::jsonb),
      'projects', coalesce(t.curriculum->'projects', '[]'::jsonb),
      'durationMinutes', (select coalesce(sum(l.duration_s),0)/60 from public.lessons l join public.modules m on m.id=l.module_id where m.trail_id=t.id),
      'modules', coalesce((select jsonb_agg(jsonb_build_object(
        'id', m.id, 'number', m.position, 'title', m.title, 'objective', m.description,
        'level', coalesce((select cm->>'level' from jsonb_array_elements(t.curriculum->'modules') cm where (cm->>'number')::int=m.position limit 1), ''),
        'lessons', coalesce((select jsonb_agg(jsonb_build_object(
          'id', l.id, 'number', l.position, 'title', l.title,
          'durationMinutes', coalesce(l.duration_s,0)/60, 'text', l.description,
          'material', l.planned_material, 'status', 'em-preparacao'
        ) order by l.position, l.id) from public.lessons l where l.module_id=m.id), '[]'::jsonb)
      ) order by m.position, m.id) from public.modules m where m.trail_id=t.id), '[]'::jsonb)
    ) as course
    from public.trails t
    where t.curriculum->>'status' = 'em-preparacao'
  ) catalog;
  return result;
end;
$$;
revoke all on function private.academy_catalog() from public, anon;
grant execute on function private.academy_catalog() to authenticated;

create or replace function public.academy_catalog()
returns jsonb language sql stable security invoker set search_path = '' as $$
  select private.academy_catalog();
$$;
revoke all on function public.academy_catalog() from public, anon;
grant execute on function public.academy_catalog() to authenticated;
comment on function public.academy_catalog() is 'Authenticated preview of planned curricula. Excludes video keys, billing and user data; does not grant lesson access.';
