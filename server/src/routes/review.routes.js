const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviewsByRecipe,
  deleteReview,
} = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validateReview } = require('../middleware/validate.middleware');

router.get('/:recipeId', getReviewsByRecipe);               // public
router.post('/', protect, authorize('user'), validateReview, createReview);  // non-chef only
router.delete('/:id', protect, deleteReview);               // protected

module.exports = router;
