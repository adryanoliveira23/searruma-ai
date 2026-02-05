import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://amufvgzrxeipylqmcfvx.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_cO-3U4wg8kqXvcxJrLHayg_7WcLJIS6";

// Client for client-side/public usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
