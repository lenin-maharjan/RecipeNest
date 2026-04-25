const Recipe = require('../models/recipe.model');
const Upload = require('../models/upload.model');
const User = require('../models/user.model');
const Review = require('../models/review.model');
const Bookmark = require('../models/bookmark.model');
const cloudinary = require('../config/cloudinary');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// GET /api/recipes — get all recipes (public)
const getAllRecipes = async (req, res) => {
  try {
    const {
      category,
      difficulty,
      minRating,
      search,
      verifiedOnly,
      authorSearch,
      page = 1,
      limit = 10,
    } = req.query;

    // build filter object dynamically
    let filter = { isPublished: true };

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (minRating) filter.averageRating = { $gte: Number(minRating) };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // DB-level verified chef filter — run BEFORE paginating
    if (verifiedOnly === 'true') {
      const chefIds = await User.find({
        role: 'chef',
        isVerifiedChef: true,
      }).select('_id');
      filter.author = { $in: chefIds.map((u) => u._id) };
    }

    // author name search — intersects with verifiedOnly filter if both active
    if (authorSearch) {
      const matchingAuthors = await User.find({
        name: { $regex: authorSearch, $options: 'i' },
      }).select('_id');
      const authorIds = matchingAuthors.map((u) => u._id);

      if (filter.author && filter.author.$in) {
        // both filters active — intersect the two ID sets
        const verifiedSet = new Set(
          filter.author.$in.map((id) => id.toString())
        );
        filter.author = {
          $in: authorIds.filter((id) => verifiedSet.has(id.toString())),
        };
      } else {
        filter.author = { $in: authorIds };
      }
    }

    // pagination
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Recipe.countDocuments(filter);

    const recipes = await Recipe.find(filter)
      .populate('author', 'name role isVerifiedChef avatar')
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

// GET /api/recipes/:id — get single recipe (public)
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      'author',
      'name role isVerifiedChef avatar bio'
    );

    if (!recipe) return sendError(res, 404, 'Recipe not found');

    sendSuccess(res, 200, 'Recipe fetched', { recipe });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// POST /api/recipes — create recipe (protected)
const createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, instructions, prepTime, cookTime, servings, image, category, difficulty, toolsUsed } = req.body;
    const recipe = await Recipe.create({
      title, description, ingredients, instructions, prepTime, cookTime, servings, image, category, difficulty, toolsUsed,
      author: req.user._id, // always set from token — never trust client
    });

    sendSuccess(res, 201, 'Recipe created', { recipe });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// PUT /api/recipes/:id — update recipe (protected + owner only)
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return sendError(res, 404, 'Recipe not found');

    // ownership check — only the author can edit
    if (recipe.author.toString() !== req.user._id.toString()) {
      return sendError(res, 403, 'Not authorised to update this recipe');
    }

    const { title, description, ingredients, instructions, prepTime, cookTime, servings, image, category, difficulty, toolsUsed } = req.body;

    // clean up old image if replacing
    if (image && recipe.image && image !== recipe.image) {
      const oldUpload = await Upload.findOne({ url: recipe.image });
      if (oldUpload) {
        await cloudinary.uploader.destroy(oldUpload.publicId);
        await Upload.findByIdAndDelete(oldUpload._id);
      }
    }

    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      { title, description, ingredients, instructions, prepTime, cookTime, servings, image, category, difficulty, toolsUsed },
      { returnDocument: 'after', runValidators: true } // use returnDocument instead of deprecated new
    );

    sendSuccess(res, 200, 'Recipe updated', { recipe: updated });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// DELETE /api/recipes/:id — delete recipe (protected + owner or admin)
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return sendError(res, 404, 'Recipe not found');

    // owner OR admin can delete
    const isOwner = recipe.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return sendError(res, 403, 'Not authorised to delete this recipe');
    }

    await Recipe.findByIdAndDelete(req.params.id);

    await Review.deleteMany({ recipe: req.params.id });
    await Bookmark.deleteMany({ recipe: req.params.id });

    if (recipe.image) {
      const uploadRecord = await Upload.findOne({ url: recipe.image });
      if (uploadRecord) {
        await cloudinary.uploader.destroy(uploadRecord.publicId);
        await Upload.findByIdAndDelete(uploadRecord._id);
      }
    }

    sendSuccess(res, 200, 'Recipe deleted', {});
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// GET /api/recipes/my — get logged in user's own recipes
const getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.user._id }).sort({
      createdAt: -1,
    });
    sendSuccess(res, 200, 'Your recipes fetched', { recipes });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// POST /api/recipes/upload — upload recipe image
const uploadRecipeImage = async (req, res) => {
  try {
    if (!req.file) return sendError(res, 400, 'No image file provided');
    
     // save upload record to MongoDB
    const uploadRecord = await Upload.create({
      url: req.file.secure_url || req.file.path,
      publicId: req.file.filename || req.file.public_id,
      uploadedBy: req.user._id,
    });

    // cloudinary url is automatically set by multer-storage-cloudinary
    sendSuccess(res, 200, 'Image uploaded', {
      imageUrl: req.file.secure_url || req.file.path || req.file.url,
    });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getMyRecipes,
  uploadRecipeImage,
};