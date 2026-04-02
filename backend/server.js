const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const path = require('path');

// 1. Load dotenv
dotenv.config();

const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviews');
const stockRoutes = require('./routes/stock');
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');


const app = express();
const PORT = process.env.PORT || 5000;

// 3. CORS & Parsing
app.use(cors({
  origin: true, // Allow current browser origin in dev
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);


// 4. Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// 5. Error Handler (Last)
app.use(errorHandler);

// 6. Express Listener
app.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT}`);
  
  // 7. Keep-Alive Ping (Every 14 minutes)
  const BACKEND_URL = process.env.BACKEND_URL;
  if (BACKEND_URL) {
    // Wait 30 seconds before starting pings to ensure server is fully bound
    setTimeout(() => {
      setInterval(async () => {
        try {
          const url = `${BACKEND_URL}/api/health`;
          console.log(`[Keep-Alive] Pinging ${url}...`);
          await fetch(url);
        } catch (err) {
          console.error(`[Keep-Alive Error] ${err.message}`);
        }
      }, 14 * 60 * 1000); 
    }, 30000);
  }
});
