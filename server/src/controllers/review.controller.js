const Review = require('../models/review.model');
const Recipe = require('../models/recipe.model');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// POST /api/reviews — create review
const createReview = async (req, res) => {
  try {
    const { recipeId, rating, comment } = req.body;

    // check recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return sendError(res, 404, 'Recipe not found');

    // chef cannot review their own recipe
    if (recipe.author.toString() === req.user._id.toString()) {
      return sendError(res, 400, 'You cannot review your own recipe');
    }

    // check if already reviewed — the unique index handles this
    // but we catch it here for a clean error message
    const existing = await Review.findOne({
      recipe: recipeId,
      user: req.user._id,
    });
    if (existing) return sendError(res, 400, 'You have already reviewed this recipe');

    const review = await Review.create({
      recipe: recipeId,
      user: req.user._id,
      rating,
      comment,
    });

    // populate user info for immediate response
    await review.populate('user', 'name avatar');

    sendSuccess(res, 201, 'Review submitted', { review });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// GET /api/reviews/:recipeId — get all reviews for a recipe
const getReviewsByRecipe = async (req, res) => {
  try {
    const reviews = await Review.find({ recipe: req.params.recipeId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    sendSuccess(res, 200, 'Reviews fetched', { reviews });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// GET /api/reviews/count — get total reviews across the platform
const getReviewCount = async (req, res) => {
  try {
    const total = await Review.countDocuments();
    sendSuccess(res, 200, 'Review count fetched', { total });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// DELETE /api/reviews/:id — delete review (owner only)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return sendError(res, 404, 'Review not found');

    if (review.user.toString() !== req.user._id.toString()) {
      return sendError(res, 403, 'Not authorised to delete this review');
    }

    await Review.findOneAndDelete({ _id: req.params.id });
    sendSuccess(res, 200, 'Review deleted', {});
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

module.exports = { createReview, getReviewsByRecipe, deleteReview, getReviewCount };