import { useState, useEffect } from 'react';
import { getRecipeByIdApi } from '../api/recipe.api';
import { getReviewsApi } from '../api/review.api';
import toast from 'react-hot-toast';

const useRecipe = (recipeId) => {
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!recipeId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const recipeRes = await getRecipeByIdApi(recipeId);
        setRecipe(recipeRes.data.data.recipe);

        // fetch reviews for this recipe
        const reviewsRes = await getReviewsApi(recipeId);
        setReviews(reviewsRes.data.data.reviews);
      } catch (error) {
        toast.error('Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  // add a new review to the list
  const addReview = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  // remove a review from the list
  const removeReview = (reviewId) => {
    setReviews((prev) => prev.filter((r) => r._id !== reviewId));
  };

  return {
    recipe,
    reviews,
    loading,
    addReview,
    removeReview,
  };
};

export default useRecipe;
