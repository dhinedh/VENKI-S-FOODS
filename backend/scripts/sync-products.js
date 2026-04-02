const fs = require('fs');
const path = require('path');
const supabase = require('../lib/supabase');

// Load the static products
const productsPath = path.join(__dirname, '../../frontend/src/data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const syncProducts = async () => {


  
  console.log(`\n🚀 Migrating ${products.length} products to Supabase...`);

  try {
    // 1. Sync Products Table
    for (const prod of products) {
      console.log(`👉 Syncing: ${prod.name}...`);
      
      const productData = {
        id: prod.id,
        name: prod.name,
        category: prod.category,
        price: prod.price,
        image: prod.image,
        description: prod.description || '',
        weight: prod.weight || '250g',
        is_veg: prod.is_veg ?? true,
        tags: prod.tags || []
      };

      const { data, error } = await supabase
        .from('products')
        .upsert(productData, { onConflict: 'id' })
        .select();

      if (error) throw error;

      // 2. Sync Stock Table (default to some stock if not exists)
      const { error: stockError } = await supabase
        .from('stock')
        .upsert({ 
          product_id: prod.id, 
          quantity: 20 // Default stock for migration
        }, { onConflict: 'product_id' });

      if (stockError) throw stockError;
    }

    console.log("\n✅ Migration Successful! Your database is now synced with products.json.");

  } catch (err) {
    console.error("\n❌ Migration Failed:", err.message);
  }
};

syncProducts();
