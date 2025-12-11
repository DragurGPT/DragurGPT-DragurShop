const orderModel = require('../models/orderModel');

function validateOrderPayload(body) {
  const { customer, items, total } = body;
  if (!customer || !customer.name || !customer.email || !customer.address) {
    return 'Customer information is incomplete.';
  }
  if (!Array.isArray(items) || items.length === 0) {
    return 'Cart is empty.';
  }
  const hasInvalidItem = items.some((item) => !item.id || !item.quantity || item.quantity <= 0 || !item.price);
  if (hasInvalidItem) {
    return 'One or more cart items are invalid.';
  }
  if (typeof total !== 'number' || total <= 0) {
    return 'Total must be a positive number.';
  }
  return null;
}

async function checkout(req, res, next) {
  try {
    const validationError = validateOrderPayload(req.body);
    if (validationError) {
      return res.status(400).json({ status: 'error', message: validationError });
    }

    const order = await orderModel.addOrder({
      customer: req.body.customer,
      items: req.body.items,
      total: req.body.total,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      status: 'success',
      message: 'Order placed successfully',
      orderId: order.id,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkout,
};
