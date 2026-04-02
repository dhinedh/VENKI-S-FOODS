const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const createAdminPublic = async (email, password) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  
  try {
    console.log(`🚀 Attempting public registration for Admin Heritage Account: ${email}...`);
    
    // Using public signUp because service_role key is missing/invalid
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: 'admin', full_name: 'Heritage Admin' },
        emailRedirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/auth/callback`
      }
    });

    if (error) {
      if (error.status === 400 && error.message.includes('already registered')) {
        console.log("✅ Account already exists in the system.");
      } else {
        throw error;
      }
    } else {
      console.log(`\n🎉 Success! Registration link sent to: ${email}`);
      console.log(`👉 Please Check your Email to confirm the Heritage Admin account.`);
    }

  } catch (err) {
    console.error("\n❌ Setup Failed:", err.message);
  }
};

const ADMIN_EMAIL = "admin@venkisfoods.com";
const ADMIN_PASS = "AdminHeritage2024!"; 

createAdminPublic(ADMIN_EMAIL, ADMIN_PASS);
