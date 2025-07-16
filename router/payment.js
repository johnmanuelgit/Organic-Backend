const express = require("express");
const paymentcontroller = require("../controllers/payment.controller");
const router = express.Router();
const middleware = require("../middleware/auth");

router.post("/create-order", middleware, paymentcontroller.payments);

module.exports = router;
