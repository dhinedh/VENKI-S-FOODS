const supabase = require('../lib/supabase');
const fs = require('fs');
const path = require('path');
const { notifyAdminViaNtfy } = require('../utils/ntfy');

const PRODUCTS_DATA_PATH = path.join(__dirname, '../data/products.json');

// --- Controllers ---

const createOrder = async (req, res) => {
  try {
    const { 
      user_id, customer_name, customer_phone, delivery_type, 
      address, delivery_slot, items 
    } = req.body;

    // 1. Fetch delivery settings
    const { data: settings, error: settingsErr } = await supabase
      .from('delivery_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (settingsErr) throw settingsErr;

    // 2. Validate items & calculate subtotal (Inner Ring Security)
    const productsData = JSON.parse(fs.readFileSync(PRODUCTS_DATA_PATH, 'utf8'));
    let subtotal = 0;
    let totalGrams = 0;
    const validatedItems = [];

    for (const item of items) {
      const productInfo = productsData.find(p => String(p.id) === String(item.id));
      if (!productInfo) {
        console.warn(`[Order Validation Failed] Product not found: ${item.id}`);
        return res.status(400).json({ error: `Product ${item.id} not found.` });
      }
      
      const itemSubtotal = productInfo.price * item.qty;
      subtotal += itemSubtotal;
      
      let weightStr = (productInfo.weight || "0").toString().toLowerCase().trim();
      let grams = 0;
      if (weightStr.includes('kg')) {
        grams = parseFloat(weightStr.replace(/[^\d.]/g, '')) * 1000;
      } else {
        grams = parseFloat(weightStr.replace(/[^\d.]/g, ''));
      }
      totalGrams += (isNaN(grams) ? 0 : grams) * item.qty;

      validatedItems.push({ ...productInfo, qty: item.qty, total: itemSubtotal });

      // Stock check
      const { data: stockData } = await supabase.from('stock').select('quantity').eq('product_id', item.id).single();
      if (!stockData || stockData.quantity < item.qty) {
        console.warn(`[Order Validation Failed] Insufficient stock for ${productInfo.name}: Requested ${item.qty}, available ${stockData?.quantity || 0}`);
        return res.status(400).json({ error: `Insufficient stock for ${productInfo.name}` });
      }
    }

    // 4. Delivery Charge (₹50 per 1 kg or part thereof, FREE if >= 1000)
    let delivery_charge = (subtotal >= 1000 || delivery_type === 'pickup')
      ? 0 
      : Math.max(1, Math.ceil(totalGrams / 1000)) * 50;

    const total_price = subtotal + Number(delivery_charge);

    // 6. Insert Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id, customer_name, customer_phone, delivery_type,
        address, delivery_slot, items: validatedItems, subtotal,
        delivery_charge, total_price,
        status: 'pending'
      }])
      .select().single();

    if (orderError) throw orderError;

    // 7. Deduct Stock
    for (const item of items) {
      const { data: s } = await supabase.from('stock').select('quantity').eq('product_id', item.id).single();
      await supabase.from('stock').update({ quantity: Math.max(0, s.quantity - item.qty) }).eq('product_id', item.id);
    }

    // 8. Instant Push Notification
    try { await notifyAdminViaNtfy(order); } catch (e) { console.error("Notify failed", e); }

    res.status(201).json({ success: true, order_id: order.id, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders').select('*').eq('id', req.params.id).single();
    if (error || !data) return res.status(404).json({ error: "Order not found" });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getOrdersByUser = async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders')
      .select('*')
      .eq('user_id', req.params.userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getAllOrders = async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders').update({ status: req.body.status }).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { 
  createOrder, 
  getOrdersByUser, 
  getOrderById, 
  getAllOrders, 
  updateOrderStatus 
};
