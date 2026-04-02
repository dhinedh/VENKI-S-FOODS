const supabase = require('../lib/supabase');

const createAdmin = async (email, password) => {
  try {
    console.log(`Creating heritage admin: ${email}...`);
    
    const { data: { user }, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'admin' }
    });

    if (error) {
      if (error.status === 422) {
        console.log("Admin account already exists or rate limited. Update it to 'admin' role anyway...");
      } else {
        throw error;
      }
    }

    if (user) {
      console.log(`\n🎉 Success! Heritage Admin Created:\nID: ${user.id}\nRole: admin`);
    } else {
      // If user exists, let's just make sure they ARE an admin
      const { data: userToUpdate } = await supabase.auth.admin.listUsers();
      const existingUser = userToUpdate.users.find(u => u.email === email);
      if (existingUser) {
        await supabase.auth.admin.updateUserById(existingUser.id, {
          user_metadata: { role: 'admin' }
        });
        console.log(`\n🎉 Success! Existing user role updated to 'admin' for: ${email}`);
      }
    }

  } catch (err) {
    console.error("\n❌ Setup Failed:", err.message);
  }
};

// --- CONFIGURATION ---
const ADMIN_EMAIL = "admin@venkisfoods.com";
const ADMIN_PASS = "AdminHeritage2024!"; 

createAdmin(ADMIN_EMAIL, ADMIN_PASS);
