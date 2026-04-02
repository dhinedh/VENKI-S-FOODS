dotenv.config({ path: path.join(__dirname, '../.env') });
    try {
        console.log("🚀 Starting database seeding...");

        // 1. Read the products.json file from the frontend
        const productsPath = path.join(__dirname, '../../frontend/src/data/products.json');
        if (!fs.existsSync(productsPath)) {
            throw new Error(`Critical Error: products.json not found at ${productsPath}`);
        }
        
        const productsRaw = fs.readFileSync(productsPath, 'utf8');
        const products = JSON.parse(productsRaw);

        console.log(`📦 Found ${products.length} products in JSON. Migrating to Supabase...`);

        for (const product of products) {
            // Generate the same slug ID as the controller
            // Or use the numeric ID if we want to keep it simple?
            // The controller uses name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            // Let's stick to the controller's logic for consistency.
            const slugId = product.name.toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '');

            console.log(`Syncing: ${product.name} (${slugId})`);

            // Upsert Product
            const { data: upsertedProduct, error: productError } = await supabase
                .from('products')
                .upsert({
                    id: slugId,
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    description: product.description,
                    weight: product.weight,
                    image: product.image,
                    is_veg: product.is_veg,
                    tags: product.tags
                }, { onConflict: 'id' })
                .select();

            if (productError) {
                console.error(`❌ Failed to sync ${product.name}:`, productError.message);
                continue;
            }

            // Also initialize stock if it doesn't exist
            const { error: stockError } = await supabase
                .from('stock')
                .upsert({
                    product_id: slugId,
                    quantity: 100, // Default stock for seeded products
                    updated_at: new Date()
                }, { onConflict: 'product_id' });

            if (stockError) {
                console.error(`⚠️ Stock initialization failed for ${slugId}:`, stockError.message);
            }
        }

        console.log("✅ Seeding complete. All products are now in the database.");
        process.exit(0);

    } catch (err) {
        console.error("❌ Seeding failed:", err.message);
        process.exit(1);
    }
};

seedProducts();
