const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviewsByRecipe,
  deleteReview,
  getReviewCount,
  getMyReviewCount,
  getMyRecipeReviewCount,
} = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validateReview } = require('../middleware/validate.middleware');

router.get('/count', getReviewCount);                    // public
router.get('/my-count', protect, getMyReviewCount);      // protected
router.get('/my-recipe-count', protect, getMyRecipeReviewCount); // protected
router.get('/:recipeId', getReviewsByRecipe);               // public
router.post('/', protect, authorize('user', 'chef'), validateReview, createReview);  // authenticated users
router.delete('/:id', protect, deleteReview);               // protected

module.exports = router;
