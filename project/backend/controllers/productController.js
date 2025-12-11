const Product = require('../models/productModel');

// Return all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products', error);
    res.status(500).json({ success: false, message: 'Failed to load products' });
  }
};

// Return a single product by id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product', error);
    res.status(500).json({ success: false, message: 'Failed to load product' });
  }
};

module.exports = { getAllProducts, getProductById };
