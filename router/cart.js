const express = require("express");
const cartcontroller = require("../controllers/cart.controller");
const router = express.Router();
const middleware = require("../middleware/auth");

router.get("/:userId", middleware, cartcontroller.getcart);
router.post("/", middleware, cartcontroller.cartadditems);
router.put("/update", middleware, cartcontroller.itemsquantityupdate);
router.delete(
  "/:userId/item/:itemName",
  middleware,
  cartcontroller.removeitems
);
router.delete("/:userId", middleware, cartcontroller.clearcart);

module.exports = router;
