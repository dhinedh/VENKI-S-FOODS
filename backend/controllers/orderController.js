const supabase = require('../lib/supabase');
const fs = require('fs');
const path = require('path');
const { notifyAdmin } = require('../utils/whatsapp');

const PRODUCTS_DATA_PATH = path.join(__dirname, '../data/products.json');

// --- Helper: Validate Coupon ---
const validateCouponLogic = async (code, subtotal) => {
  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .single();
  
  if (error || !coupon) return { error: "Invalid coupon" };

  if (new Date(coupon.expires_at) < new Date()) return { error: "Coupon expired" };
  if (coupon.used_count >= coupon.max_uses) return { error: "Coupon usage limit reached" };
  if (subtotal < coupon.min_order_amount) return { error: `Min order ₹${coupon.min_order_amount} required` };

  let discount = coupon.discount_type === 'percent' ? (subtotal * coupon.discount_value) / 100 : coupon.discount_value;
  return { valid: true, discount, coupon };
};

// --- Controllers ---

const createOrder = async (req, res) => {
  try {
    const { 
      user_id, customer_name, customer_phone, delivery_type, 
      address, delivery_slot, items, coupon_code 
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
    const validatedItems = [];

    for (const item of items) {
      const productInfo = productsData.find(p => p.id === item.id);
      if (!productInfo) return res.status(400).json({ error: `Product ${item.id} not found.` });
      
      const itemSubtotal = productInfo.price * item.qty;
      subtotal += itemSubtotal;
      validatedItems.push({ ...productInfo, qty: item.qty, total: itemSubtotal });

      // Stock check
      const { data: stockData } = await supabase.from('stock').select('quantity').eq('product_id', item.id).single();
      if (!stockData || stockData.quantity < item.qty) {
        return res.status(400).json({ error: `Insufficient stock for ${productInfo.name}` });
      }
    }

    // 3. Min Order Validation
    if (subtotal < settings.min_order_amount) {
      return res.status(400).json({ error: `Minimum order amount is ₹${settings.min_order_amount}` });
    }

    // 4. Delivery Charge
    let delivery_charge = (delivery_type === 'delivery' && subtotal < settings.free_above) ? settings.delivery_charge : 0;

    // 5. Coupon
    let discount = 0;
    if (coupon_code) {
      const v = await validateCouponLogic(coupon_code, subtotal);
      if (v.error) return res.status(400).json({ error: v.error });
      discount = v.discount;
      // Increment usage
      await supabase.from('coupons').update({ used_count: v.coupon.used_count + 1 }).eq('code', coupon_code);
    }

    const total_price = subtotal + delivery_charge - discount;

    // 6. Insert Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id, customer_name, customer_phone, delivery_type,
        address, delivery_slot, items: validatedItems, subtotal,
        delivery_charge, discount, total_price, coupon_code,
        status: 'pending'
      }])
      .select().single();

    if (orderError) throw orderError;

    // 7. Deduct Stock
    for (const item of items) {
      const { data: s } = await supabase.from('stock').select('quantity').eq('product_id', item.id).single();
      await supabase.from('stock').update({ quantity: Math.max(0, s.quantity - item.qty) }).eq('product_id', item.id);
    }

    // 8. WhatsApp Notify
    try { await notifyAdmin(order); } catch (e) { console.error("Notify failed", e); }

    res.status(201).json({ success: true, order_id: order.id, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const validateCoupon = async (req, res) => {
  const { code, subtotal } = req.body;
  const result = await validateCouponLogic(code, subtotal);
  if (result.error) return res.status(400).json({ error: result.error });
  res.json(result);
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
  validateCoupon, 
  getOrdersByUser, 
  getOrderById, 
  getAllOrders, 
  updateOrderStatus 
};
