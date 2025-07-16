const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const middleware = require("../middleware/auth");

router.post("/orders/cod", middleware, orderController.placeCodOrder);
router.post("/orders/online", middleware, orderController.confirmOnlinePayment);
router.get("/orders", middleware, orderController.getAllOrders);
router.put("/orders/:id/status", middleware, orderController.updateOrderStatus);

module.exports = router;
