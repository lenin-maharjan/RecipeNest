const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviewsByRecipe,
  deleteReview,
  getReviewCount,
} = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validateReview } = require('../middleware/validate.middleware');

router.get('/count', getReviewCount);                    // public
router.get('/:recipeId', getReviewsByRecipe);               // public
router.post('/', protect, authorize('user', 'chef'), validateReview, createReview);  // authenticated users
router.delete('/:id', protect, deleteReview);               // protected

module.exports = router;
