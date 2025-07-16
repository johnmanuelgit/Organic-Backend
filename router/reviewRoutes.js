const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const middleware = require("../middleware/auth");


router.get("/:id/reviews", reviewController.getProductReviews);
router.post("/:id/reviews", middleware, reviewController.addReview);

module.exports = router;
