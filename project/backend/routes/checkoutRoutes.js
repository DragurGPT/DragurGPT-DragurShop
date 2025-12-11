const express = require('express');
const router = express.Router();
const { submitOrder } = require('../controllers/checkoutController');

router.post('/', submitOrder);

module.exports = router;
