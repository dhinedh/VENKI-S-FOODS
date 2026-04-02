import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables! Check your frontend/.env file.");
}

// Initialise Supabase with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
// This is only for auth and session management — not for direct DB access as per spec.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
