const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviewsByRecipe,
  deleteReview,
} = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/:recipeId', getReviewsByRecipe);         // public
router.post('/', protect, createReview);              // protected
router.delete('/:id', protect, deleteReview);         // protected

module.exports = router;