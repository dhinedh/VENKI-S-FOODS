const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase credentials in environment variables.");
}

// Initialise Supabase client using SUPABASE_URL and SUPABASE_SERVICE_KEY
// Export single client instance for backend administrative use.
const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;
