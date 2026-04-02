const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

/**
 * POST / — Create Review
 * 1. Verify user_id and order_id match a real order in Supabase.
 * 2. Verify product_id exists in that order's items array.
 * 3. Check no existing review from this user for this product.
 */
router.post('/', async (req, res) => {
  try {
    const { user_id, product_id, order_id, rating, comment } = req.body;

    // 1. Verify user and order match
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('items')
      .eq('id', order_id)
      .eq('user_id', user_id)
      .single();

    if (orderErr || !order) {
      return res.status(403).json({ error: "Invalid order or customer mismatch." });
    }

    // 2. Verify product exists in that order
    const hasProduct = order.items.some(item => item.id === parseInt(product_id));
    if (!hasProduct) {
      return res.status(400).json({ error: "Product not found in this order." });
    }

    // 3. Check for existing review
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', user_id)
      .eq('product_id', product_id)
      .single();

    if (existingReview) {
      return res.status(400).json({ error: "You have already reviewed this product." });
    }

    // 4. Insert review
    const { data, error } = await supabase
      .from('reviews')
      .insert([{ user_id, product_id, order_id, rating, comment, is_approved: false }])
      .select();

    if (error) throw error;
    res.status(201).json({ success: true, message: "Review submitted for approval" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /:productId — Get Approved Reviews
 */
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { data, error } = await supabase
      .from('reviews')
      .select('id, rating, comment, created_at, user_id')
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
