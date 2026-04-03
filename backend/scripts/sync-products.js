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
      
      // Generate slug-based ID (Harmonized with Controller)
      const slugId = prod.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

      const productData = {
        id: slugId, // Use SLUG instead of numeric ID
        name: prod.name,
        category: prod.category,
        price: prod.price,
        image: prod.image,
        description: prod.description || '',
        weight: prod.weight || '250g',
        is_veg: prod.is_veg ?? true,
        is_available: prod.is_available ?? true,
        tags: prod.tags || []
      };

      const { data, error } = await supabase
        .from('products')
        .upsert(productData, { onConflict: 'id' })
        .select();

      if (error) throw error;

      // 2. Cleanup: If we're using slugs, we should delete the old numeric ID
      if (String(prod.id).match(/^\d+$/)) {
        await supabase
          .from('products')
          .delete()
          .eq('id', String(prod.id));
          
        await supabase
          .from('stock')
          .delete()
          .eq('product_id', String(prod.id));
      }

      // 3. Sync Stock Table
      const { error: stockError } = await supabase
        .from('stock')
        .upsert({ 
          product_id: slugId, 
          quantity: 20 
        }, { onConflict: 'product_id' });

      if (stockError) throw stockError;
    }

    console.log("\n✅ Migration Successful! Your database is now synced with products.json.");

  } catch (err) {
    console.error("\n❌ Migration Failed:", err.message);
  }
};

syncProducts();
