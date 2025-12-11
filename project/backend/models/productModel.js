const path = require('path');
const fs = require('fs-extra');

const productsPath = path.join(__dirname, '..', 'data', 'products.json');

async function getAllProducts() {
  const data = await fs.readJson(productsPath);
  return data;
}

async function getProductById(id) {
  const products = await getAllProducts();
  return products.find((p) => p.id === Number(id));
}

module.exports = {
  getAllProducts,
  getProductById,
};
