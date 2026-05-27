-- 0002 — Auto-attribue le rôle admin au compte d'Ivan à l'inscription/connexion.
-- Évite l'étape manuelle "coller du SQL dans Supabase" pour devenir admin.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, display_name)
  values (
    new.id,
    case when lower(new.email) = 'guiaivan688@gmail.com' then 'admin'::user_role
         else 'client'::user_role end,
    new.raw_user_meta_data->>'display_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
