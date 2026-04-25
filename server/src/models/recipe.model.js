const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    ingredients: [
      {
        name: { type: String, required: true },
        amount: { type: String, required: true },
      },
    ],
    instructions: [
      {
        step: { type: Number, required: true },
        text: { type: String, required: true },
      },
    ],
    toolsUsed: [{ type: String, trim: true }],
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Breakfast',
        'Lunch',
        'Dinner',
        'Dessert',
        'Snack',
        'Beverage',
        'Other',
      ],
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },
    prepTime: { type: Number, default: 0 },   // in minutes
    cookTime: { type: Number, default: 0 },   // in minutes
    servings: { type: Number, default: 1 },
    image: { type: String, default: '' },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Virtual field — totalTime calculated on the fly
recipeSchema.virtual('totalTime').get(function () {
  return this.prepTime + this.cookTime;
});

recipeSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Recipe', recipeSchema);