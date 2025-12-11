const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const productRoutes = require('./routes/productRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Global middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve shared frontend assets so the API works during local dev
app.use('/assets', express.static(path.join(__dirname, '..', 'frontend', 'assets')));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/checkout', checkoutRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('API error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`NEO-WEAR API running on http://localhost:${PORT}`);
});
