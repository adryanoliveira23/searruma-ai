import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://fkmjxfcbuppampdbvbuo.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrbWp4ZmNidXBwYW1wZGJ2YnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMDkzNjcsImV4cCI6MjA4NTg4NTM2N30.OakbKmtfNXbcYqLgoQN08G24htsWqlPaI_WnygvoPuY";

// Client for client-side/public usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
