-- Applied to Supabase project ekkpnoidcdpsxkwrvshy as migration auth_profile_pending_activation.
-- All new Auth accounts are provisioned as inactive Staff until an administrator verifies and activates them.
create or replace function private.handle_new_auth_user()
returns trigger language plpgsql security definer
set search_path = pg_catalog, public
as $function$
declare v_org_id uuid;
begin
  select id into v_org_id from public.organizations order by created_at asc limit 1;
  if v_org_id is null then
    raise exception 'Cannot create employee profile: no organization is configured.';
  end if;
  insert into public.profiles (id, org_id, full_name, email, role, department, active)
  values (
    new.id,
    v_org_id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(coalesce(new.email, ''), '@', 1)),
    new.email,
    'staff',
    coalesce(nullif(new.raw_user_meta_data ->> 'department', ''), 'General'),
    false
  )
  on conflict (id) do nothing;
  return new;
end;
$function$;
revoke all on function private.handle_new_auth_user() from public, anon, authenticated;
