const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const { 
  createOrder, 
  validateCoupon,
  getOrdersByUser, 
  getOrderById, 
  getAllOrders, 
  updateOrderStatus 
} = require('../controllers/orderController');

router.post('/', createOrder);
router.post('/validate-coupon', validateCoupon);
router.get('/', adminAuth, getAllOrders); 
router.get('/user/:userId', getOrdersByUser);
router.get('/history/:userId', getOrdersByUser); // Alias for legacy/frontend compatibility
router.get('/:id', getOrderById);
router.get('/:id/track', getOrderById); // Alias for tracking
router.patch('/:id/status', adminAuth, updateOrderStatus); 

module.exports = router;
