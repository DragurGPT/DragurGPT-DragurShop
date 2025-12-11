const path = require('path');
const fs = require('fs-extra');

const ordersPath = path.join(__dirname, '..', 'data', 'orders.json');

async function getOrders() {
  const data = await fs.readJson(ordersPath);
  return Array.isArray(data) ? data : [];
}

async function addOrder(order) {
  const orders = await getOrders();
  const enrichedOrder = { ...order, id: `ORD-${Date.now()}` };
  orders.push(enrichedOrder);
  await fs.writeJson(ordersPath, orders, { spaces: 2 });
  return enrichedOrder;
}

module.exports = {
  addOrder,
  getOrders,
};
