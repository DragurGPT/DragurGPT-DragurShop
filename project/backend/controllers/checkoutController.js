const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// Validate and save order
const submitOrder = async (req, res) => {
  try {
    const { items, customer } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Validate products
    const products = await Product.findAll();
    const invalidItem = items.find(
      (item) => !item.id || !item.quantity || !products.find((p) => p.id === item.id)
    );

    if (invalidItem) {
      return res.status(400).json({ success: false, message: 'Invalid cart items' });
    }

    const orderTotal = items.reduce((total, item) => {
      const product = products.find((p) => p.id === item.id);
      return total + product.price * item.quantity;
    }, 0);

    const order = await Order.save({
      items,
      customer: customer || { name: 'Guest', email: 'guest@example.com' },
      total: orderTotal,
      placedAt: new Date().toISOString(),
    });

    res.status(201).json({ success: true, message: 'Order received', data: order });
  } catch (error) {
    console.error('Error during checkout', error);
    res.status(500).json({ success: false, message: 'Failed to process checkout' });
  }
};

module.exports = { submitOrder };
