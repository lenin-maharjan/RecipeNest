const Bookmark = require('../models/bookmark.model');
const Recipe = require('../models/recipe.model');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// POST /api/bookmarks — add bookmark (toggle style)
const toggleBookmark = async (req, res) => {
  try {
    const { recipeId } = req.body;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return sendError(res, 404, 'Recipe not found');

    // check if already bookmarked
    const existing = await Bookmark.findOne({
      user: req.user._id,
      recipe: recipeId,
    });

    if (existing) {
      // already bookmarked — remove it
      await Bookmark.findByIdAndDelete(existing._id);
      return sendSuccess(res, 200, 'Bookmark removed', { bookmarked: false });
    }

    // not bookmarked yet — add it
    await Bookmark.create({ user: req.user._id, recipe: recipeId });
    sendSuccess(res, 201, 'Recipe bookmarked', { bookmarked: true });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// GET /api/bookmarks — get all bookmarks for logged in user
const getMyBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate({
        path: 'recipe',
        populate: { path: 'author', select: 'name isVerifiedChef avatar' },
      })
      .sort({ createdAt: -1 });

    sendSuccess(res, 200, 'Bookmarks fetched', { bookmarks });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// GET /api/bookmarks/check/:recipeId — check if a recipe is bookmarked
const checkBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      user: req.user._id,
      recipe: req.params.recipeId,
    });
    sendSuccess(res, 200, 'Checked', { bookmarked: !!bookmark });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const removeBookmark = async (req, res) => {
  try {
    await Bookmark.findOneAndDelete({
      user: req.user._id,
      recipe: req.params.recipeId,
    });
    sendSuccess(res, 200, 'Bookmark removed', {});
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

module.exports = { toggleBookmark, getMyBookmarks, checkBookmark, removeBookmark };