-- Applied to Supabase project ekkpnoidcdpsxkwrvshy as migration auth_profile_bootstrap.
-- New Auth accounts receive a least-privilege staff profile. Role elevation is admin-only.
alter table public.profiles add column if not exists department text not null default 'General';

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
    new.id, v_org_id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(coalesce(new.email, ''), '@', 1)),
    new.email, 'staff',
    coalesce(nullif(new.raw_user_meta_data ->> 'department', ''), 'General'),
    true
  )
  on conflict (id) do nothing;
  return new;
end;
$function$;

revoke all on function private.handle_new_auth_user() from public, anon, authenticated;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function private.handle_new_auth_user();

create or replace function private.sync_auth_user_email()
returns trigger language plpgsql security definer
set search_path = pg_catalog, public
as $function$
begin
  if new.email is distinct from old.email then
    update public.profiles set email = new.email, updated_at = now() where id = new.id;
  end if;
  return new;
end;
$function$;

revoke all on function private.sync_auth_user_email() from public, anon, authenticated;
drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated after update of email on auth.users
for each row when (old.email is distinct from new.email)
execute function private.sync_auth_user_email();

insert into public.profiles (id, org_id, full_name, email, role, department, active)
select u.id, o.id,
  coalesce(nullif(u.raw_user_meta_data ->> 'full_name', ''), split_part(coalesce(u.email, ''), '@', 1)),
  u.email, 'staff', coalesce(nullif(u.raw_user_meta_data ->> 'department', ''), 'General'), true
from auth.users u
cross join lateral (select id from public.organizations order by created_at asc limit 1) o
on conflict (id) do nothing;
