const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST: COD
router.post('/orders/cod', orderController.placeCodOrder);

// POST: Razorpay
router.post('/orders/online', orderController.confirmOnlinePayment);
router.get('/orders', orderController.getAllOrders);
router.put('/orders/:id/status', orderController.updateOrderStatus);


module.exports = router;

