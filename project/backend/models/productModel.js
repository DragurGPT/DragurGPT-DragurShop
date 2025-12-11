const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'products.json');

const findAll = async () => {
  const data = await fs.readFile(dataPath, 'utf8');
  return JSON.parse(data);
};

const findById = async (id) => {
  const products = await findAll();
  return products.find((product) => product.id === id);
};

module.exports = { findAll, findById };
