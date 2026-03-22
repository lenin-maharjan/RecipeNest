const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  changePassword,
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/:id', getUserProfile);                    // public
router.put('/profile', protect, updateProfile);        // protected
router.put('/change-password', protect, changePassword); // protected

module.exports = router;