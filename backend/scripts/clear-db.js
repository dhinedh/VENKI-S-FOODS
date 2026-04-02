const { Client } = require('pg');
require('dotenv').config();

/**
 * clear-db.js
 * Wipes all demo data from the database.
 * Use with caution!
 */
const clearDatabase = async () => {
    const projectRef = process.env.SUPABASE_URL?.split('//')[1].split('.')[0];
    const password = process.env.SUPABASE_DB_PASSWORD;

    if (!projectRef || !password) {
        console.error("❌ Error: Missing credentials in .env");
        process.exit(1);
    }

    const connectionString = `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`;
    const client = new Client({ connectionString });

    console.log(`\n🚨 WARNING: Attempting to WIPE all data in [${projectRef}]...`);

    try {
        await client.connect();
        console.log("✅ Connected.");

        console.log("👉 Clearing tables...");
        
        // Disable triggers to avoid FK issues during bulk delete if necessary, 
        // though TRUNCATE CASCADE is cleaner.
        await client.query('TRUNCATE public.reviews, public.order_items, public.orders, public.stock, public.products RESTART IDENTITY CASCADE;');

        console.log("✅ All products, stock, orders, and reviews have been removed.");
        console.log("\n🎊 Database is now clean and ready for your real products! 🎊");

    } catch (err) {
        console.error("\n❌ Wipe Failed:", err.message);
    } finally {
        await client.end();
    }
};

clearDatabase();
