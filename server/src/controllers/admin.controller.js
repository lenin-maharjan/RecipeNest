const User = require('../models/user.model');
const Recipe = require('../models/recipe.model');
const Review = require('../models/review.model');
const Bookmark = require('../models/bookmark.model');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// GET /api/admin/stats — dashboard overview
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalRecipes, totalReviews, verifiedChefs] =
      await Promise.all([
        User.countDocuments(),
        Recipe.countDocuments(),
        Review.countDocuments(),
        User.countDocuments({ isVerifiedChef: true }),
      ]);

    sendSuccess(res, 200, 'Stats fetched', {
      totalUsers,
      totalRecipes,
      totalReviews,
      verifiedChefs,
    });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// GET /api/admin/users — get all users
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;

    let filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(filter);

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    sendSuccess(res, 200, 'Users fetched', {
      users,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// PUT /api/admin/users/:id/verify — verify or unverify a chef
const toggleChefVerification = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, 'User not found');

    if (user.role !== 'chef') {
      return sendError(res, 400, 'User is not a chef');
    }

    // flip the verification status
    user.isVerifiedChef = !user.isVerifiedChef;
    await user.save();

    sendSuccess(
      res,
      200,
      `Chef ${user.isVerifiedChef ? 'verified' : 'unverified'} successfully`,
      {
        user: {
          _id: user._id,
          name: user.name,
          isVerifiedChef: user.isVerifiedChef,
        },
      }
    );
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// PUT /api/admin/users/:id/role — change user role
const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'chef', 'admin'].includes(role)) {
      return sendError(res, 400, 'Invalid role');
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { returnDocument: 'after' }
    ).select('-password');

    if (!user) return sendError(res, 404, 'User not found');

    sendSuccess(res, 200, 'Role updated', { user });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// DELETE /api/admin/users/:id — delete a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, 'User not found');

    // prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return sendError(res, 400, 'You cannot delete your own account');
    }

    await User.findByIdAndDelete(req.params.id);

    // also delete all their recipes and reviews properly
    const userRecipes = await Recipe.find({ author: req.params.id });
    const recipeIds = userRecipes.map(r => r._id);

    await Bookmark.deleteMany({ recipe: { $in: recipeIds } });
    await Review.deleteMany({ recipe: { $in: recipeIds } });

    await Recipe.deleteMany({ author: req.params.id });
    await Review.deleteMany({ user: req.params.id });
    await Bookmark.deleteMany({ user: req.params.id });

    sendSuccess(res, 200, 'User deleted', {});
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// GET /api/admin/recipes — get all recipes including unpublished
const getAllRecipesAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    let filter = {};
    if (search) filter.title = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Recipe.countDocuments(filter);

    const recipes = await Recipe.find(filter)
      .populate('author', 'name email role isVerifiedChef')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    sendSuccess(res, 200, 'Recipes fetched', {
      recipes,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// PUT /api/admin/recipes/:id/publish — toggle recipe publish status
const toggleRecipePublish = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return sendError(res, 404, 'Recipe not found');

    recipe.isPublished = !recipe.isPublished;
    await recipe.save();

    sendSuccess(
      res,
      200,
      `Recipe ${recipe.isPublished ? 'published' : 'unpublished'}`,
      { recipe }
    );
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// DELETE /api/admin/recipes/:id — admin force delete any recipe
const deleteRecipeAdmin = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return sendError(res, 404, 'Recipe not found');

    await Recipe.findByIdAndDelete(req.params.id);
    await Review.deleteMany({ recipe: req.params.id });
    await Bookmark.deleteMany({ recipe: req.params.id });

    sendSuccess(res, 200, 'Recipe deleted by admin', {});
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

module.exports = {
  getStats,
  getAllUsers,
  toggleChefVerification,
  changeUserRole,
  deleteUser,
  getAllRecipesAdmin,
  toggleRecipePublish,
  deleteRecipeAdmin,
};