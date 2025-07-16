const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const middleware = require('../middleware/auth');

// GET all reviews for a product
router.get('/:id/reviews', reviewController.getProductReviews);

// POST a new review
router.post('/:id/reviews',middleware, reviewController.addReview);

module.exports = router;
