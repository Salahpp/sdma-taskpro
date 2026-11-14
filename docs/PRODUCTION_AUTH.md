# SDMA TaskPro — Production Authentication Setup

## Implemented authentication

SDMA TaskPro now uses Supabase Auth for login and session restoration. The browser client in `js/supabase-client.js` contains only the project's **publishable** key. Never add a service-role or secret key to this repository or browser code.

The app uses:
- `supabase.auth.signInWithPassword({ email, password })` for login.
- `supabase.auth.getUser()` to validate a persisted session with Supabase Auth.
- `supabase.auth.onAuthStateChange()` for sign-in, sign-out, and refresh events.
- `supabase.auth.updateUser({ password })` to change a password.
- `supabase.auth.signOut({ scope: "local" })` to end the current browser session.

The SDK manages token persistence/refresh and automatically attaches the current access token to Supabase Data API requests. The app no longer authenticates by comparing passwords with a local JavaScript array or storing a complete password-bearing user object as `sdma_current_user`.

## Employee profiles and roles

Each `public.profiles` record is linked to `auth.users.id`. The `auth_profile_bootstrap` migration adds a department field and creates a profile whenever a new Auth user is created.

New accounts are always assigned `role = 'staff'`; client-supplied user metadata is never used to grant privileges.

| Database role | TaskPro UI role |
|---|---|
| `admin` | CEO |
| `manager` | Team Lead |
| `staff` | Digital Marketer / Designer |

The existing PostgreSQL RLS policies and `private.auth_org()`, `private.auth_role()`, `private.is_admin()`, and `private.is_manager()` helpers are the authorization boundary. UI checks only control navigation.

## One-time owner bootstrap

1. In Supabase Dashboard → Authentication → Users, create or invite the real owner account. Do not reuse the former demo credentials.
2. The database trigger creates an inactive Staff profile.
3. In Supabase SQL Editor, replace the placeholder email and run:

```sql
update public.profiles p
set role = 'admin',
    department = 'Management',
    active = true,
    updated_at = now()
from auth.users u
where p.id = u.id
  and lower(u.email) = lower('OWNER_EMAIL_HERE');
```

4. Confirm exactly the expected profile was updated and test the admin login.
5. Create or invite employees in Supabase Auth. Their Staff profiles start inactive. While signed in as admin, activate the employee in the Staff screen (and assign manager only when appropriate). The public Auth self-signup setting should also be disabled for an invitation-only employee portal.

Disable public self-sign-up in Supabase Auth settings when accounts should be invitation-only.

## Important remaining work

The authentication foundation and database profile bootstrap are connected, and the existing Supabase database has RLS enabled on operational tables. However, several current TaskPro UI collections (clients, projects, tasks, attendance, reports, payroll, and content) still load from browser localStorage/default data. Those modules have **not yet been migrated to their corresponding Supabase tables** in this change. Do not treat locally stored records as production-protected until each module uses Supabase queries and its RLS policy.

The documented `/v1/auth/login` and Bearer-token REST examples are future API blueprints, not a custom REST server implemented by this repository.
