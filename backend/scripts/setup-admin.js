const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const setupAdmin = async (email, password) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  
  console.log(`\n🚀 Initializing Admin Setup for: ${email}`);

  try {
    // 1. Attempt Public Signup (since service_role is likely missing/anon)
    console.log("👉 Step 1: Attempting public registration...");
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: 'admin', full_name: 'Heritage Admin' },
        emailRedirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/auth/callback`
      }
    });

    if (signUpError) {
      if (signUpError.status === 400 && signUpError.message.includes('already registered')) {
        console.log("✅ User already exists. Proceed to login for verification.");
      } else if (signUpError.message.includes('invalid')) {
        console.error("❌ Invalid Email: Supabase rejected this domain. Try a @gmail.com or @outlook.com address.");
        return;
      } else {
        throw signUpError;
      }
    } else {
      console.log("🎉 Signup request sent successfully!");
    }

    // 2. Instructions for the user
    console.log("\n--------------------------------------------------");
    console.log("NEXT STEPS:");
    console.log("1. CHECK YOUR EMAIL for the verification link.");
    console.log("2. CLICK the link to activate your account.");
    console.log("3. LOG IN at the website using these credentials.");
    console.log("--------------------------------------------------\n");

    console.log("MOCK COMMAND FOR SQL DASHBOARD (Optional Bypass):");
    console.log(`If you have access to the SQL Editor, run this to verify instantly:`);
    console.log(`UPDATE auth.users SET email_confirmed_at = now(), raw_user_meta_data = '{"role":"admin"}' WHERE email = '${email}';`);

  } catch (err) {
    console.error("\n❌ Setup Failed:", err.message);
  }
};

// --- CONFIGURATION ---
// I'm using a generic domain to avoid Supabase domain filters
const ADMIN_EMAIL = "admin.venkis@gmail.com"; 
const ADMIN_PASS = "AdminHeritage2024!"; 

setupAdmin(ADMIN_EMAIL, ADMIN_PASS);
