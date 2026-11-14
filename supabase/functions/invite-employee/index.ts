import { createClient } from "npm:@supabase/supabase-js@2.119.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}

function readNamedKey(variable: string, fallbackVariable?: string): string {
  const raw = Deno.env.get(variable);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "string") return parsed;
      if (parsed && typeof parsed === "object") {
        if (typeof parsed.default === "string") return parsed.default;
        const first = Object.values(parsed).find(value => typeof value === "string");
        if (typeof first === "string") return first;
      }
    } catch {
      // Some older project runtimes expose a single key instead of a JSON map.
      return raw;
    }
  }
  return fallbackVariable ? (Deno.env.get(fallbackVariable) ?? "") : "";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  try {
    const url = Deno.env.get("SUPABASE_URL") ?? "";
    const publishableKey = readNamedKey("SUPABASE_PUBLISHABLE_KEYS", "SUPABASE_ANON_KEY");
    const secretKey = readNamedKey("SUPABASE_SECRET_KEYS", "SUPABASE_SERVICE_ROLE_KEY");

    if (!url || !publishableKey || !secretKey) {
      console.error("Invite function is missing required Supabase runtime configuration.");
      return json({ error: "Employee invitations are not configured. Contact the system administrator." }, 503);
    }

    const authorization = req.headers.get("Authorization") ?? "";
    const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
    if (!tokenMatch) return json({ error: "Authentication required." }, 401);

    // Caller client keeps the user's JWT, so this authorization check is subject to RLS.
    const callerClient = createClient(url, publishableKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data: authData, error: authError } = await callerClient.auth.getUser(tokenMatch[1]);
    if (authError || !authData.user) return json({ error: "Your session is invalid or expired." }, 401);

    const { data: callerProfile, error: profileError } = await callerClient
      .from("profiles")
      .select("id,org_id,role,active")
      .eq("id", authData.user.id)
      .maybeSingle();

    if (profileError || !callerProfile || !callerProfile.active || callerProfile.role !== "admin") {
      return json({ error: "Only an active agency administrator can invite employees." }, 403);
    }

    const body = await req.json().catch(() => null);
    const email = String(body?.email ?? "").trim().toLowerCase();
    const fullName = String(body?.full_name ?? "").trim();
    const department = String(body?.department ?? "General").trim();
    const appRole = String(body?.role ?? "Digital_Marketer");

    const permittedRoles = new Set(["Team_Lead", "Digital_Marketer", "Designer", "HR"]);
    if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Enter a valid employee email address." }, 400);
    }
    if (!fullName || fullName.length > 100 || !department || department.length > 80) {
      return json({ error: "Enter a valid employee name and department." }, 400);
    }
    if (!permittedRoles.has(appRole)) {
      return json({ error: "This role cannot be assigned through employee invitations." }, 400);
    }

    // The elevated key is used only after the caller has been authenticated and checked as admin.
    const adminClient = createClient(url, secretKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      data: {
        full_name: fullName,
        department,
        designation: appRole
      }
    });

    if (inviteError || !inviteData.user) {
      console.error("Employee invitation failed:", inviteError?.message ?? "No user was returned.");
      return json({ error: "Could not send this invitation. Check whether the email is already registered." }, 409);
    }

    const databaseRole = appRole === "Team_Lead" ? "manager" : "staff";
    const { data: employeeProfile, error: updateError } = await adminClient
      .from("profiles")
      .update({
        role: databaseRole,
        designation: appRole,
        department,
        active: true,
        full_name: fullName,
        email
      })
      .eq("id", inviteData.user.id)
      .eq("org_id", callerProfile.org_id)
      .select("id,full_name,email,role,designation,department,active")
      .single();

    if (updateError || !employeeProfile) {
      console.error("Invited employee profile could not be activated:", updateError?.message ?? "Profile not found.");
      return json({
        error: "The invitation was created, but profile activation failed. Ask an administrator to review the employee profile."
      }, 500);
    }

    return json({
      success: true,
      message: "Employee invitation sent.",
      employee: employeeProfile
    }, 201);
  } catch (error) {
    console.error("Unexpected employee invitation error:", error instanceof Error ? error.message : "Unknown error");
    return json({ error: "The invitation could not be completed. Please try again." }, 500);
  }
});
