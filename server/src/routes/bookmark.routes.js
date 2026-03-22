const express = require('express');
const router = express.Router();
const {
  toggleBookmark,
  getMyBookmarks,
  checkBookmark,
} = require('../controllers/bookmark.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getMyBookmarks);
router.get('/check/:recipeId', protect, checkBookmark);
router.post('/', protect, toggleBookmark);

module.exports = router;