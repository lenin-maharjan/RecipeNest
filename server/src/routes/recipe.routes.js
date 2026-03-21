const express = require('express');
const router = express.Router();
const {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getMyRecipes,
} = require('../controllers/recipe.controller');
const { protect } = require('../middleware/auth.middleware');

// public routes
router.get('/', getAllRecipes);
router.get('/my', protect, getMyRecipes);  // put before /:id or it gets swallowed
router.get('/:id', getRecipeById);

// protected routes
router.post('/', protect, createRecipe);
router.put('/:id', protect, updateRecipe);
router.delete('/:id', protect, deleteRecipe);

module.exports = router;