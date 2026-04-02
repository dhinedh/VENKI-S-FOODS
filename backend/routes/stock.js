const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const adminAuth = require('../middleware/adminAuth');

/**
 * GET / — Get All Stock (Admin Only)
 */
router.get('/', adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('stock')
      .select('*');

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /:productId — Get Stock for one product
 */
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { data, error } = await supabase
      .from('stock')
      .select('quantity, updated_at')
      .eq('product_id', productId)
      .single();

    if (error || !data) return res.status(404).json({ error: "Stock not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
