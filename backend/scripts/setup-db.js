const { Client } = require('pg');
require('dotenv').config();

/**
 * setup-db.js
 * Automatically builds the database schema in Supabase.
 * - Creates products table
 * - Creates stock table
 * - Creates delivery_settings table
 */
const setupDatabase = async () => {
    // 1. Get Project Settings
    const projectRef = process.env.SUPABASE_URL?.split('//')[1].split('.')[0];
    const password = process.env.SUPABASE_DB_PASSWORD;

    if (!projectRef) {
        console.error("❌ Error: Missing SUPABASE_URL in .env");
        process.exit(1);
    }

    if (!password) {
        console.error("\n❌ Error: Missing SUPABASE_DB_PASSWORD in .env");
        console.log("👉 Please go to Supabase Dashboard > Settings > Database and find/reset your password.");
        console.log("👉 Then add it to your .env file: SUPABASE_DB_PASSWORD=your_password\n");
        process.exit(1);
    }

    // 2. Build connection string
    const connectionString = `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`;
    const client = new Client({ connectionString });

    console.log(`\n🚀 Attempting to connect to Supabase project [${projectRef}]...`);

    try {
        await client.connect();
        console.log("✅ Connected to Postgres database.");

        console.log("👉 Building schemas...");

        // 0. Ensure extensions exist
        await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
        console.log(" - pgcrypto extension OK");

        // 1. Products
        await client.query(`
            CREATE TABLE IF NOT EXISTS public.products (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                price DECIMAL NOT NULL,
                image TEXT,
                description TEXT,
                weight TEXT DEFAULT '250g',
                is_veg BOOLEAN DEFAULT true,
                is_available BOOLEAN DEFAULT true,
                tags TEXT[] DEFAULT '{}',
                created_at TIMESTAMPTZ DEFAULT now(),
                updated_at TIMESTAMPTZ DEFAULT now()
            );
        `);
        console.log(" - products table OK");
        
        // 1b. Ensure is_available column exists for existing products table
        await client.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='is_available') THEN
                    ALTER TABLE public.products ADD COLUMN is_available BOOLEAN DEFAULT true;
                END IF;
                UPDATE public.products SET is_available = true WHERE is_available IS NULL;
            END $$;
        `);

        // 2. Stock
        await client.query(`
            CREATE TABLE IF NOT EXISTS public.stock (
                product_id TEXT PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
                quantity INTEGER DEFAULT 0,
                updated_at TIMESTAMPTZ DEFAULT now()
            );
        `);
        console.log(" - stock table OK");

        // 3. Orders
        await client.query(`
            CREATE TABLE IF NOT EXISTS public.orders (
                id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
                user_id UUID,
                customer_name TEXT,
                customer_email TEXT,
                customer_phone TEXT,
                address TEXT,
                items JSONB,
                subtotal DECIMAL,
                delivery_charge DECIMAL,
                delivery_slot TEXT,
                delivery_type TEXT,
                total_price DECIMAL,
                status TEXT DEFAULT 'pending',
                payment_status TEXT DEFAULT 'unpaid',
                payment_method TEXT,
                tracking_note TEXT,
                created_at TIMESTAMPTZ DEFAULT now(),
                updated_at TIMESTAMPTZ DEFAULT now()
            );
        `);
        // 3b. Ensure missing columns exist in existing orders table
        await client.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='items') THEN
                    ALTER TABLE public.orders ADD COLUMN items JSONB;
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='subtotal') THEN
                    ALTER TABLE public.orders ADD COLUMN subtotal DECIMAL;
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='delivery_charge') THEN
                    ALTER TABLE public.orders ADD COLUMN delivery_charge DECIMAL;
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='delivery_slot') THEN
                    ALTER TABLE public.orders ADD COLUMN delivery_slot TEXT;
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='delivery_type') THEN
                    ALTER TABLE public.orders ADD COLUMN delivery_type TEXT;
                END IF;
                
                -- Ensure id column has the default value generator
                ALTER TABLE public.orders ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
            END $$;
        `);

        // 4. Order Items
        await client.query(`
            CREATE TABLE IF NOT EXISTS public.order_items (
                id SERIAL PRIMARY KEY,
                order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
                product_id TEXT,
                product_name TEXT,
                quantity INTEGER,
                price DECIMAL
            );
        `);
        console.log(" - order_items table OK");

        // 5. Reviews
        await client.query(`
            CREATE TABLE IF NOT EXISTS public.reviews (
                id SERIAL PRIMARY KEY,
                product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
                user_id UUID,
                user_name TEXT,
                rating INTEGER,
                comment TEXT,
                is_approved BOOLEAN DEFAULT false,
                created_at TIMESTAMPTZ DEFAULT now()
            );
        `);
        console.log(" - reviews table OK");

        // 6. Delivery Settings
        await client.query(`
            CREATE TABLE IF NOT EXISTS public.delivery_settings (
                id INTEGER PRIMARY KEY DEFAULT 1,
                min_order_amount DECIMAL DEFAULT 0,
                delivery_charge DECIMAL DEFAULT 50,
                free_above DECIMAL DEFAULT 1500
            );
        `);
        await client.query(`
            INSERT INTO public.delivery_settings (id, min_order_amount, delivery_charge, free_above)
            VALUES (1, 0, 50, 1500) ON CONFLICT (id) DO UPDATE 
            SET min_order_amount = 0;
        `);
        console.log(" - delivery settings OK (Min Order: ₹0)");


        console.log("\n🎊 Database Bootstrapped Successfully! 🎊");
        console.log("👉 Now run 'node scripts/sync-products.js' to migrate your data.");

    } catch (err) {
        console.error("\n❌ Setup Failed:", err.message);
        if (err.message.includes("password authentication failed")) {
            console.log("⚠️  Tip: Double check your SUPABASE_DB_PASSWORD in .env");
        }
    } finally {
        await client.end();
    }
};

setupDatabase();
