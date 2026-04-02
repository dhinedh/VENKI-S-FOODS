const fs = require('fs');
const path = require('path');
const supabase = require('../lib/supabase');

async function syncProducts() {
  try {
    console.log('--- Starting Product Synchronization ---');

    // 1. Read products from frontend JSON
    const jsonPath = path.join(__dirname, '../../frontend/src/data/products.json');
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`Could not find products.json at: ${jsonPath}`);
    }

    const productsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`Loaded ${productsData.length} products from JSON.`);

    for (const product of productsData) {
      console.log(`Processing: ${product.name}...`);

      // 1. Map ID (Sluggify if needed, or use numeric if consistent)
      // The JSON has numeric IDs, but the DB might expect slug-based or UUIDs.
      // Let's use the name-based slug for better SEO/URLs as seen in the controller.
      const slugId = product.name.toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');

      // 2. Prepare Data for Upsert
      const productToUpsert = {
        id: slugId,
        name: product.name,
        category: product.category,
        price: parseFloat(product.price),
        description: product.description,
        weight: product.weight,
        image: product.image,
        is_veg: product.is_veg,
        tags: product.tags || [],
        is_available: product.is_available ?? true
      };

      // 3. Upsert to Products table
      const { data, error } = await supabase
        .from('products')
        .upsert(productToUpsert, { onConflict: 'id' })
        .select();

      if (error) {
        console.error(`- Error upserting product ${product.name}:`, error.message);
        continue;
      }

      console.log(`- Successfully synced: ${product.name} (ID: ${slugId})`);

      // 4. Ensure Stock entry exists (default to 100 if missing)
      const { error: stockError } = await supabase
        .from('stock')
        .upsert({ 
          product_id: slugId, 
          quantity: 100, 
          updated_at: new Date() 
        }, { onConflict: 'product_id' });

      if (stockError) {
        console.error(`- Error updating stock for ${product.name}:`, stockError.message);
      }
    }

    console.log('--- Synchronization Complete ---');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

syncProducts();
