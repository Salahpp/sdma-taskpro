/* SDMA TaskPro — Supabase Auth and employee profile adapter. */
(function () {
  "use strict";
  const client = window.SDMA_SUPABASE;
  const PROFILE_COLUMNS = "id,org_id,full_name,email,role,designation,department,active";
  const DB_TO_APP_ROLE = { admin: "CEO", manager: "Team_Lead", staff: "Digital_Marketer" };
  const APP_TO_DB_ROLE = { CEO: "admin", Team_Lead: "manager", Digital_Marketer: "staff", Designer: "staff", HR: "staff" };

  function mapProfile(profile) {
    const name = profile.full_name || profile.email || "Employee";
    const avatar = name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase();
    const role = profile.role === "admin"
      ? "CEO"
      : profile.role === "manager"
        ? "Team_Lead"
        : (["Designer", "HR"].includes(profile.designation) ? profile.designation : "Digital_Marketer");
    return {
      id: profile.id,
      name,
      email: profile.email || "",
      role,
      authRole: profile.role,
      department: profile.department || "General",
      avatar: avatar || "ST",
      status: profile.active ? "Active" : "Inactive",
      baseSalary: 0
    };
  }

  async function getSessionContext(authUser) {
    if (!client || !authUser) throw new Error("No authenticated Supabase user.");
    const { data: profile, error: profileError } = await client
      .from("profiles").select(PROFILE_COLUMNS).eq("id", authUser.id).maybeSingle();
    if (profileError) throw profileError;
    if (!profile || !profile.active) throw new Error("This account has no active employee profile. Ask an administrator to activate it.");

    const { data: profiles, error: profilesError } = await client
      .from("profiles").select(PROFILE_COLUMNS).eq("org_id", profile.org_id).order("full_name", { ascending: true });
    if (profilesError) throw profilesError;
    const mapped = (profiles || []).map(mapProfile);
    return { user: mapped.find(item => item.id === profile.id) || mapProfile(profile), users: mapped };
  }

  async function signIn(email, password) {
    if (!client) throw new Error("Supabase is not configured. Contact your administrator.");
    const { data, error } = await client.auth.signInWithPassword({
      email: String(email || "").trim().toLowerCase(),
      password: String(password || "")
    });
    if (error) throw new Error("Email or password is incorrect.");
    try {
      return await getSessionContext(data.user);
    } catch (profileError) {
      await client.auth.signOut({ scope: "local" }).catch(() => {});
      throw profileError;
    }
  }

  async function getCurrentContext() {
    if (!client) throw new Error("Supabase is not configured. Contact your administrator.");
    const { data, error } = await client.auth.getUser();
    if (error) {
      await client.auth.signOut({ scope: "local" }).catch(() => {});
      return null;
    }
    if (!data.user) return null;
    try {
      return await getSessionContext(data.user);
    } catch (profileError) {
      await client.auth.signOut({ scope: "local" }).catch(() => {});
      throw profileError;
    }
  }

  async function signOut() {
    if (!client) return;
    const { error } = await client.auth.signOut({ scope: "local" });
    if (error) throw error;
  }

  function onAuthStateChange(callback) {
    if (!client) return { data: { subscription: { unsubscribe: function () {} } } };
    return client.auth.onAuthStateChange((event, session) => {
      window.setTimeout(() => callback(event, session ? session.user : null), 0);
    });
  }

  async function changePassword(email, currentPassword, newPassword) {
    if (!client) throw new Error("Supabase is not configured.");
    const { error: verifyError } = await client.auth.signInWithPassword({
      email: String(email || "").trim().toLowerCase(),
      password: String(currentPassword || "")
    });
    if (verifyError) throw new Error("Current password is incorrect.");
    const { error } = await client.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return true;
  }

  async function inviteEmployee(employee) {
    if (!client) throw new Error("Supabase is not configured.");
    const { data, error } = await client.functions.invoke("invite-employee", {
      body: {
        email: String(employee.email || "").trim().toLowerCase(),
        full_name: String(employee.name || "").trim(),
        department: String(employee.department || "General").trim(),
        role: String(employee.role || "Digital_Marketer")
      }
    });
    if (error) throw new Error(error.message || "Could not send employee invitation.");
    if (!data || !data.success) throw new Error(data?.error || "Could not send employee invitation.");
    return data.employee;
  }

  async function updateProfile(id, updates) {
    if (!client) throw new Error("Supabase is not configured.");
    const payload = {
      full_name: String(updates.name || "").trim(),
      department: String(updates.department || "General").trim(),
      role: APP_TO_DB_ROLE[updates.role || "Digital_Marketer"] || "staff",
      designation: ["Designer", "HR", "Team_Lead"].includes(updates.role) ? updates.role : (updates.role === "CEO" ? "CEO" : "Digital_Marketer"),
      active: updates.status === "Active"
    };
    const { data, error } = await client.from("profiles").update(payload).eq("id", id).select(PROFILE_COLUMNS).single();
    if (error) throw error;
    return mapProfile(data);
  }

  window.SDMAAuth = {
    isConfigured: !!client,
    signIn,
    getSessionContext,
    getCurrentContext,
    signOut,
    onAuthStateChange,
    changePassword,
    inviteEmployee,
    updateProfile
  };
})();
