import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Prevent the app from crashing if keys are missing during dev
const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.error('Supabase client failed to initialize: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing from .env');
}

export default supabase;
