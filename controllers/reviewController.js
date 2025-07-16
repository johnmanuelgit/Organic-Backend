const Review = require("../models/Review");

exports.getProductReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ productId: id }).sort({
      createdAt: -1,
    });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, userName, userImageUrl } = req.body;

    if (!rating || !comment || !userName) {
      return res
        .status(400)
        .json({ message: "Rating, comment, and userName are required" });
    }

    const review = new Review({
      productId: id,
      rating,
      comment,
      userName,
      userImageUrl,
    });

    await review.save();
    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
