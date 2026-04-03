const supabase = require('../lib/supabase');

const cloudinary = require('../config/cloudinary');

const getProducts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, category, price, stock, description, weight, is_available } = req.body;
    let imageUrl = '';

    // If there's a file, upload it optimally to Cloudinary's fast CDN
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'pickles',
        transformation: [
          { width: 800, crop: 'scale' },
          { fetch_format: 'auto', quality: 'auto' }
        ]
      });
      imageUrl = result.secure_url;
    }

    // Generate slug-based ID from name
    const id = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    // 1. Insert Product (stock is in separate table)
    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert([{ 
        id, 
        name, 
        category, 
        price: parseFloat(price), 
        description, 
        weight, 
        is_available: is_available !== undefined ? is_available : true,
        image: imageUrl 
      }])
      .select();
    
    if (productError) throw productError;

    // 2. Initialize Stock entry
    const { error: stockError } = await supabase
      .from('stock')
      .upsert({ 
        product_id: id, 
        quantity: parseInt(stock || 0), 
        updated_at: new Date() 
      }, { onConflict: 'product_id' });

    if (stockError) {
       console.error("Stock initialization failed for:", id, stockError.message);
    }

    res.status(201).json(productData[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { id: product_id } = req.params;
    const { user_id, rating, comment, user_name } = req.body;

    // 1. Double-Ring Verification: Check if user actually bought this product
    const { data: purchaseRecord, error: purchaseErr } = await supabase
      .from('orders')
      .select('id, status, order_items(product_id)')
      .eq('user_id', user_id)
      .eq('status', 'delivered'); // Only delivered orders can be reviewed

    if (purchaseErr) throw purchaseErr;

    const hasPurchased = purchaseRecord.some(order => 
      order.order_items.some(item => item.product_id === product_id)
    );

    if (!hasPurchased) {
      return res.status(403).json({ error: "Only verified buyers who received the product can leave a review." });
    }

    // 2. Submit review (hidden until admin approval)
    const { data, error } = await supabase
      .from('reviews')
      .insert([{ 
        product_id, 
        user_id, 
        user_name,
        rating, 
        comment, 
        is_approved: false // Admin must approve in Middle Ring
      }])
      .select();

    if (error) throw error;
    res.status(201).json({ message: "Review submitted! It will appear after admin approval.", review: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const { id: product_id } = req.params;
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', product_id)
      .eq('is_approved', true) // Security: Only show approved reviews
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, description, weight, is_veg, tags, is_available } = req.body;
    let updateData = { name, category, price: parseFloat(price), description, weight, is_veg, is_available };
    
    if (tags) {
      updateData.tags = Array.isArray(tags) ? tags : [tags];
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'pickles',
        transformation: [{ width: 800, crop: 'scale' }, { fetch_format: 'auto', quality: 'auto' }]
      });
      updateData.image = result.secure_url;
    }

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getReviews
};

