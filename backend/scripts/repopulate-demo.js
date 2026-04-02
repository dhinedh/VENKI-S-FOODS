const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const products = [
  {
    id: 'avakaya-mango-classic',
    name: "Grandmother's Classic Avakaya",
    category: "Pickles",
    price: 349,
    weight: "500g",
    is_veg: true,
    description: "The crown jewel of Andhra pickles. Made with premium 'Pedda Rasalu' mangoes, cold-pressed sesame oil, and hand-ground Guntur chillies. Aged for 30 days in ceramic jars.",
    image: "https://images.unsplash.com/photo-1589135398349-59da3907d67a?auto=format&fit=crop&q=80&w=800",
    tags: ["Signature", "Spicy", "Best Seller"]
  },
  {
    id: 'prawn-pickle-godavari',
    name: "Godavari Coastal Prawn Pickle",
    category: "Meat Specials",
    price: 689,
    weight: "250g",
    is_veg: false,
    description: "Fresh catch-of-the-day prawns from the Godavari belt. Deep-fried to a golden crunch and marinated in a secret blend of coastal spices and ginger-garlic paste.",
    image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&q=80&w=800",
    tags: ["Seafood", "Premium", "Coastal"]
  },
  {
    id: 'gongura-thokku-heritage',
    name: "Heritage Gongura Thokku",
    category: "Pickles",
    price: 299,
    weight: "300g",
    is_veg: true,
    description: "Tangy Roselle leaves (Gongura) slow-cooked with roasted spices. A traditional staple that perfectly balances sourness with a spicy kick.",
    image: "https://images.unsplash.com/photo-1547514107-1bc38676230f?auto=format&fit=crop&q=80&w=800",
    tags: ["Tangy", "Traditional"]
  },
  {
    id: 'chicken-pickle-andhra',
    name: "Andhra Style Spicy Chicken Pickle",
    category: "Meat Specials",
    price: 549,
    weight: "500g",
    is_veg: false,
    description: "Tender, succulent boneless chicken chunks infused with a rich, fiery masala. A high-protein accompaniment that stays fresh for months.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800",
    tags: ["Non-Veg", "Protein Rich"]
  },
  {
    id: 'velulli-garlic-paste',
    name: "Velulli (Garlic) Heritage Paste",
    category: "Pickles",
    price: 249,
    weight: "250g",
    is_veg: true,
    description: "Pungent garlic cloves salt-cured and blended with sun-dried red chillies. A bold, immunity-boosting flavor that pairs well with hot rice and ghee.",
    image: "https://images.unsplash.com/photo-1599481238640-4c1288750d7a?auto=format&fit=crop&q=80&w=800",
    tags: ["Immunity", "Bold"]
  }
];

const repopulate = async () => {
  console.log("🚀 Starting Bulk Import of 'Heritage Starter Set'...");

  for (const product of products) {
    console.log(`👉 Importing: ${product.name}...`);
    
    // 1. Insert Product
    const { error: pError } = await supabase
      .from('products')
      .upsert(product, { onConflict: 'id' });

    if (pError) {
      console.error(`❌ Failed to import product: ${product.name}`, pError.message);
      continue;
    }

    // 2. Initialize Stock (Default 50 units)
    const { error: sError } = await supabase
      .from('stock')
      .upsert({ product_id: product.id, quantity: 50 }, { onConflict: 'product_id' });

    if (sError) {
      console.error(`❌ Failed to init stock for: ${product.name}`, sError.message);
    }
  }

  console.log("\n✅ Bulk Import Successful! Your store is now ready for business. 🎊");
};

repopulate();
