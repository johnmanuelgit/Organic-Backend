const express = require("express");
const router = express.Router();
const productController = require("../controllers/shop.controller");
const multer = require("multer");
const path = require("path");
const middleware = require("../middleware/auth");


const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });


router.post("/", upload.single("image"),middleware, productController.createProduct);
router.get("/:id", productController.getProduct);
router.put("/:id", upload.single("image"),middleware, productController.updateProduct);
router.delete("/:id",middleware, productController.deleteProduct);
router.get("/", productController.getAllProducts);

module.exports = router;
