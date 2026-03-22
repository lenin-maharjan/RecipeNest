const Recipe = require('../models/recipe.model');
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

    // pagination
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Recipe.countDocuments(filter);

    const recipes = await Recipe.find(filter)
      .populate('author', 'name role isVerifiedChef avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // filter by verified chef after populate if needed
    const results =
      verifiedOnly === 'true'
        ? recipes.filter((r) => r.author.isVerifiedChef)
        : recipes;

    sendSuccess(res, 200, 'Recipes fetched', {
      recipes: results,
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
    const recipe = await Recipe.create({
      ...req.body,
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

    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // new: return updated doc, runValidators: recheck schema
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