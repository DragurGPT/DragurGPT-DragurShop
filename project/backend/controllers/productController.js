const productModel = require('../models/productModel');

async function getProducts(req, res, next) {
  try {
    const products = await productModel.getAllProducts();
    res.json({ status: 'success', data: products });
  } catch (error) {
    next(error);
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await productModel.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
    res.json({ status: 'success', data: product });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts,
  getProduct,
};
