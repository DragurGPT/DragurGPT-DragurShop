const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve frontend static files
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// API routes
app.use('/api/products', productRoutes);
app.use('/api/checkout', checkoutRoutes);

// Fallback to index
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`NEO-WEAR server running on http://localhost:${PORT}`);
});
