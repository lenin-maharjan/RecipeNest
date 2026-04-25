const User = require('../models/user.model');
const Recipe = require('../models/recipe.model');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// GET /api/users/chefs — get public chefs list with recipe stats
const getChefs = async (req, res) => {
  try {
    const { search, verifiedOnly, page = 1, limit = 12 } = req.query;

    const filter = { role: 'chef' };
    if (verifiedOnly === 'true') filter.isVerifiedChef = true;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(filter);

    const chefs = await User.find(filter)
      .select('name bio avatar role isVerifiedChef createdAt')
      .sort({ isVerifiedChef: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const chefIds = chefs.map((chef) => chef._id);
    const statsRows = await Recipe.aggregate([
      { $match: { author: { $in: chefIds }, isPublished: true } },
      {
        $group: {
          _id: '$author',
          recipeCount: { $sum: 1 },
          totalReviews: { $sum: '$totalReviews' },
          avgRating: { $avg: '$averageRating' },
        },
      },
    ]);

    const statsByChefId = new Map(
      statsRows.map((row) => [row._id.toString(), row])
    );

    const chefsWithStats = chefs.map((chef) => {
      const stats = statsByChefId.get(chef._id.toString());
      return {
        ...chef,
        stats: {
          recipeCount: stats?.recipeCount || 0,
          totalReviews: stats?.totalReviews || 0,
          avgRating: Number((stats?.avgRating || 0).toFixed(1)),
        },
      };
    });

    sendSuccess(res, 200, 'Chefs fetched', {
      chefs: chefsWithStats,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// GET /api/users/:id — get public profile (anyone can view)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      'name bio avatar role isVerifiedChef createdAt'
    );

    if (!user) return sendError(res, 404, 'User not found');

    // get their public recipes too
    const recipes = await Recipe.find({
      author: req.params.id,
      isPublished: true,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    sendSuccess(res, 200, 'Profile fetched', { user, recipes });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// PUT /api/users/profile — update own profile (protected)
const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;

    // only allow updating safe fields — never role or isVerifiedChef here
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, avatar },
      { returnDocument: 'after', runValidators: true }
    ).select('-password');

    sendSuccess(res, 200, 'Profile updated', { user: updated });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// PUT /api/users/change-password — change own password (protected)
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // fetch user with password
    const user = await User.findById(req.user._id).select('+password');

    // verify current password is correct
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return sendError(res, 401, 'Current password is incorrect');

    // set new password — pre save hook will hash it
    user.password = newPassword;
    await user.save();

    sendSuccess(res, 200, 'Password changed successfully', {});
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

module.exports = { getChefs, getUserProfile, updateProfile, changePassword };