const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllUsers,
  toggleChefVerification,
  changeUserRole,
  deleteUser,
  getAllRecipesAdmin,
  toggleRecipePublish,
  deleteRecipeAdmin,
} = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

// all admin routes require login AND admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/verify', toggleChefVerification);
router.put('/users/:id/role', changeUserRole);
router.delete('/users/:id', deleteUser);
router.get('/recipes', getAllRecipesAdmin);
router.put('/recipes/:id/publish', toggleRecipePublish);
router.delete('/recipes/:id', deleteRecipeAdmin);

module.exports = router;