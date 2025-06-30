const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// GET all reviews for a product
router.get('/:id/reviews', reviewController.getProductReviews);

// POST a new review
router.post('/:id/reviews', reviewController.addReview);

module.exports = router;
