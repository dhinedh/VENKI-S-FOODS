const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const adminAuth = require('../middleware/adminAuth');
const { notifyCustomer } = require('../utils/whatsapp');

// All routes require adminAuth middleware.
router.use(adminAuth);

/**
 * GET /orders — Filterable History
 */
router.get('/orders', async (req, res) => {
  try {
    const { status } = req.query;
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH /orders/:id — Status Update with WhatsApp Notify
 */
router.patch('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, tracking_note } = req.body;

    const validStatuses = [
      'pending', 'confirmed', 'preparing', 'out_for_delivery', 
      'ready_for_pickup', 'delivered', 'cancelled'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status: ${status}` });
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status, tracking_note, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Call notifyCustomer after update
    await notifyCustomer(id, status, tracking_note);

    res.json({ success: true, order: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH /stock/:productId — Stock Update
 */
router.patch('/stock/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const { data, error } = await supabase
      .from('stock')
      .upsert({ 
        product_id: productId, 
        quantity: parseInt(quantity), 
        updated_at: new Date() 
      }, { onConflict: 'product_id' })
      .select();


    if (error) throw error;
    res.json({ success: true, stock: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /reviews — Pending Reviews Only
 */
router.get('/reviews', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', false)
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH /reviews/:id — Approval Toggle
 */
router.patch('/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_approved } = req.body;

    const { data, error } = await supabase
      .from('reviews')
      .update({ is_approved })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json({ success: true, review: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /dashboard — Parallel Summary Stats (Ultimate Edition)
 */
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayOrders, pendingOrders, todayRevenue, totalProducts, lowStock, totalRevenue] = await Promise.all([
      // 1. Count orders created today
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', today.toISOString()),
      
      // 2. Count orders with status=pending
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending'),

      // 3. Today's Revenue
      supabase
        .from('orders')
        .select('total_price')
        .gte('created_at', today.toISOString())
        .neq('status', 'cancelled'),

      // 4. Total Products
      supabase
        .from('products')
        .select('id', { count: 'exact', head: true }),

      // 5. Low Stock Count (< 10)
      supabase
        .from('stock')
        .select('product_id', { count: 'exact', head: true })
        .lt('quantity', 10),

      // 6. All-time Revenue
      supabase
        .from('orders')
        .select('total_price')
        .neq('status', 'cancelled')
    ]);

    const revToday = (todayRevenue.data && todayRevenue.data.length > 0) 
      ? todayRevenue.data.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0) 
      : 0;
    const revTotal = (totalRevenue.data && totalRevenue.data.length > 0)
      ? totalRevenue.data.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0) 
      : 0;


    res.json({
      today_orders: todayOrders.count || 0,
      pending_orders: pendingOrders.count || 0,
      today_revenue: revToday,
      total_products: totalProducts.count || 0,
      low_stock_count: lowStock.count || 0,
      total_revenue: revTotal
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
