-- Applied to Supabase project ekkpnoidcdpsxkwrvshy as migration profile_designation.
-- designation is a TaskPro display role; authorization continues to use profiles.role.
alter table public.profiles
  add column if not exists designation text not null default 'Digital_Marketer';

update public.profiles
set designation = case
  when role = 'admin' then 'CEO'
  when role = 'manager' then 'Team_Lead'
  when designation is null or designation = '' then 'Digital_Marketer'
  else designation
end;
