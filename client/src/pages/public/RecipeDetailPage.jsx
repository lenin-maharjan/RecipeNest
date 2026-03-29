// const RecipeDetailPage = () => <div>Recipe Detail Page</div>;
// export default RecipeDetailPage;

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../../components/common/Layout';
import Spinner from '../../components/common/Spinner';
import StarRating from '../../components/recipe/StarRating';
import VerifiedBadge from '../../components/chef/VerifiedBadge';
import Button from '../../components/common/Button';
import { getRecipeByIdApi, deleteRecipeApi } from '../../api/recipe.api';
import { getReviewsApi, createReviewApi, deleteReviewApi } from '../../api/review.api';
import { toggleBookmarkApi, checkBookmarkApi } from '../../api/bookmark.api';
import useAuth from '../../hooks/useAuth';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // review form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  // fetch recipe + reviews + bookmark status
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [recipeRes, reviewsRes] = await Promise.all([
          getRecipeByIdApi(id),
          getReviewsApi(id),
        ]);
        setRecipe(recipeRes.data.data.recipe);
        setReviews(reviewsRes.data.data.reviews);

        // check bookmark status if logged in
        if (isAuthenticated) {
          const bmRes = await checkBookmarkApi(id);
          setBookmarked(bmRes.data.data.bookmarked);
        }
      } catch {
        toast.error('Recipe not found');
        navigate('/recipes');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isAuthenticated]);

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to bookmark');
      return;
    }
    try {
      const res = await toggleBookmarkApi(id);
      setBookmarked(res.data.data.bookmarked);
      toast.success(res.data.data.bookmarked
        ? 'Recipe bookmarked!' : 'Bookmark removed');
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }
    try {
      setSubmitting(true);
      const res = await createReviewApi({
        recipeId: id, rating, comment,
      });
      setReviews((prev) => [res.data.data.review, ...prev]);
      // update recipe average rating
      setRecipe((prev) => ({
        ...prev,
        averageRating: (
          (prev.averageRating * prev.totalReviews + rating) /
          (prev.totalReviews + 1)
        ).toFixed(1),
        totalReviews: prev.totalReviews + 1,
      }));
      setRating(0);
      setComment('');
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReviewApi(reviewId);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      toast.success('Review deleted');
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const handleDeleteRecipe = async () => {
    if (!window.confirm('Delete this recipe? This cannot be undone.')) return;
    try {
      await deleteRecipeApi(id);
      toast.success('Recipe deleted');
      navigate('/my-recipes');
    } catch {
      toast.error('Failed to delete recipe');
    }
  };

  const isOwner = user?._id === recipe?.author?._id;
  const hasReviewed = reviews.some((r) => r.user?._id === user?._id);

  if (loading) return <Spinner />;
  if (!recipe) return null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500
                     hover:text-gray-700 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
              strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* hero image */}
        {recipe.image && (
          <div className="h-72 rounded-2xl overflow-hidden mb-8">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-primary-100 text-primary-700 text-sm
                               font-medium px-3 py-1 rounded-full">
                {recipe.category}
              </span>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                recipe.difficulty === 'Easy'
                  ? 'bg-green-100 text-green-700'
                  : recipe.difficulty === 'Medium'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {recipe.difficulty}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {recipe.title}
            </h1>
            <p className="text-gray-500">{recipe.description}</p>
          </div>

          {/* actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleBookmark}
              className={`p-2.5 rounded-xl border transition-colors ${
                bookmarked
                  ? 'bg-primary-50 border-primary-300 text-primary-600'
                  : 'border-gray-200 text-gray-400 hover:border-primary-300'
              }`}
            >
              <svg className="w-5 h-5" fill={bookmarked ? 'currentColor' : 'none'}
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>

            {isOwner && (
              <>
                <Link to={`/recipes/edit/${recipe._id}`}>
                  <Button variant="secondary">Edit</Button>
                </Link>
                <Button variant="danger" onClick={handleDeleteRecipe}>
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        {/* stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Prep Time', value: `${recipe.prepTime} min` },
            { label: 'Cook Time', value: `${recipe.cookTime} min` },
            { label: 'Total Time', value: `${recipe.totalTime} min` },
            { label: 'Servings', value: recipe.servings },
          ].map((s) => (
            <div key={s.label}
              className="card p-4 text-center">
              <p className="text-2xl font-bold text-primary-500">
                {s.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* author */}
        <Link
          to={`/chef/${recipe.author?._id}`}
          className="card p-4 flex items-center gap-4 mb-8
                     hover:shadow-md transition-shadow block"
        >
          <div className="w-12 h-12 rounded-full bg-primary-100 flex
                          items-center justify-center text-primary-600
                          text-xl font-bold flex-shrink-0">
            {recipe.author?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900">
                {recipe.author?.name}
              </span>
              {recipe.author?.isVerifiedChef && <VerifiedBadge />}
            </div>
            <p className="text-sm text-gray-500 capitalize">
              {recipe.author?.role}
            </p>
          </div>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* ingredients */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Ingredients
            </h2>
            <ul className="space-y-2">
              {recipe.ingredients?.map((ing, i) => (
                <li key={i}
                  className="flex items-center justify-between
                             py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-700">{ing.name}</span>
                  <span className="text-gray-500 font-medium text-sm
                                   bg-gray-50 px-2 py-0.5 rounded">
                    {ing.amount}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* rating summary */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Rating
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold text-primary-500">
                {Number(recipe.averageRating).toFixed(1)}
              </span>
              <div>
                <StarRating
                  value={Math.round(recipe.averageRating)}
                  readonly
                  size="lg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {recipe.totalReviews} review
                  {recipe.totalReviews !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* instructions */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Instructions
          </h2>
          <ol className="space-y-6">
            {recipe.instructions?.map((inst) => (
              <li key={inst.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-500
                                text-white flex items-center justify-center
                                text-sm font-bold flex-shrink-0 mt-0.5">
                  {inst.step}
                </div>
                <p className="text-gray-700 leading-relaxed pt-1">
                  {inst.text}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* reviews section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Reviews ({recipe.totalReviews})
          </h2>

          {/* submit review form */}
          {isAuthenticated && !isOwner && !hasReviewed && (
            <form
              onSubmit={handleSubmitReview}
              className="card p-6 mb-6"
            >
              <h3 className="font-semibold text-gray-900 mb-4">
                Write a Review
              </h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Your rating</p>
                <StarRating
                  value={rating}
                  onChange={setRating}
                  size="lg"
                />
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this recipe..."
                rows={3}
                className="input-field resize-none mb-4"
              />
              <Button type="submit" loading={submitting}>
                Submit Review
              </Button>
            </form>
          )}

          {hasReviewed && (
            <div className="bg-green-50 border border-green-200
                            rounded-xl p-4 mb-6 text-green-700 text-sm">
              You have already reviewed this recipe.
            </div>
          )}

          {/* reviews list */}
          {reviews.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No reviews yet. Be the first!
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="card p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-100
                                      flex items-center justify-center
                                      text-primary-600 font-semibold
                                      text-sm flex-shrink-0">
                        {review.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {review.user?.name}
                        </p>
                        <StarRating
                          value={review.rating}
                          readonly
                          size="sm"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">
                        {new Date(review.createdAt)
                          .toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                      </span>
                      {user?._id === review.user?._id && (
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-xs text-red-400
                                     hover:text-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default RecipeDetailPage;