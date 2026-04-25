const express = require('express');
const router = express.Router();
const {
  toggleBookmark,
  getMyBookmarks,
  checkBookmark,
  removeBookmark,
} = require('../controllers/bookmark.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getMyBookmarks);
router.get('/check/:recipeId', protect, checkBookmark);
router.post('/', protect, toggleBookmark);
router.delete('/:recipeId', protect, removeBookmark);

module.exports = router;