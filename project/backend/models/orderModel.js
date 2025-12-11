const fs = require('fs').promises;
const path = require('path');
const { v4: uuid } = require('uuid');

const dataPath = path.join(__dirname, '..', 'data', 'orders.json');

const save = async (order) => {
  const data = await fs.readFile(dataPath, 'utf8');
  const orders = JSON.parse(data);
  const newOrder = { id: uuid(), ...order };
  orders.push(newOrder);
  await fs.writeFile(dataPath, JSON.stringify(orders, null, 2));
  return newOrder;
};

module.exports = { save };
