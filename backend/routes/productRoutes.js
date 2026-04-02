const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminAuth = require('../middleware/adminAuth');
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct,
  deleteProduct,
  addReview, 
  getReviews 
} = require('../controllers/productController');

// Multer Config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, '/tmp'), // use system tmp
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Standard Routes
router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/:id/reviews', getReviews);
router.post('/:id/review', addReview);

// Protected Admin Routes (Middle Ring)
router.post('/', adminAuth, upload.single('image'), createProduct);
router.patch('/:id', adminAuth, upload.single('image'), updateProduct);
router.delete('/:id', adminAuth, deleteProduct);

module.exports = router;

