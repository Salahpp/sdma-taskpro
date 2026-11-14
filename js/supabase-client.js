/* SDMA TaskPro — public Supabase client configuration. Never place a service-role key here. */
(function () {
  "use strict";
  const SUPABASE_URL = "https://ekkpnoidcdpsxkwrvshy.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_hr8LcntubU5L1ncYqcGBlg_48FIrzRM";
  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    console.error("Supabase JavaScript SDK failed to load.");
    window.SDMA_SUPABASE = null;
    return;
  }
  window.SDMA_SUPABASE = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
  });
})();
