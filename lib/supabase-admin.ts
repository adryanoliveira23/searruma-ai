import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://fkmjxfcbuppampdbvbuo.supabase.co";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrbWp4ZmNidXBwYW1wZGJ2YnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDMwOTM2NywiZXhwIjoyMDg1ODg1MzY3fQ.0LuuA03HMREgNZdmKXv5UxGdr9fMC-kcQzcEVnNoAoM";

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    "Supabase Admin credentials missing. Admin client will be unavailable.",
  );
}

// Admin client for server-side usage only
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
