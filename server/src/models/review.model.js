const mongoose = require('mongoose');
const Recipe = require('./recipe.model');

const reviewSchema = new mongoose.Schema({
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at most 5']
    },
    comment: {
        type: String,
        required: [true, 'Comment is required'],
        maxlength: [500, 'Comment cannot exceed 500 characters']
    },
}, 
{ timestamps: true }
);


// one user can only review a recipe once
reviewSchema.index({ recipe: 1, user: 1 }, { unique: true });

//after saving a review, recalculate the average rating for the recipe
reviewSchema.post('save', async function() {
    const stats = await mongoose.model('Review').aggregate([
        { $match: {recipe: this.recipe} },
        {
            $group: {
                _id: '$recipe',
                avgRating: { $avg: '$rating' },
                count: { $sum: 1},
            },
        },
    ]);

    if (stats.length > 0) {
        await Recipe.findByIdAndUpdate(this.recipe, {
            averageRating: Math.round(stats[0].avgRating * 10) / 10, //round to 1 decimal place
            reviewCount: stats[0].count,
        });
    }   
});

//after deleting a review, recalculate the average rating for the recipe
reviewSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        const stats = await mongoose.model('Review').aggregate([
            { $match: {recipe: doc.recipe} },
            {
                $group: {
                    _id: '$recipe',
                    avgRating: { $avg: '$rating' },
                    count: { $sum: 1},
                },
            },
        ]);

        await Recipe.findByIdAndUpdate(doc.recipe, {
            averageRating: stats.length > 0 ? Math.round(stats[0].avgRating * 10) / 10 : 0, //if no reviews left, set to 0
            reviewCount: stats.length > 0 ? stats[0].count : 0,
        });
    }
});

module.exports = mongoose.model('Review', reviewSchema);