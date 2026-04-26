import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../../components/common/Layout';
import { getRecipeByIdApi, deleteRecipeApi } from '../../api/recipe.api';
import { getReviewsApi, createReviewApi, deleteReviewApi } from '../../api/review.api';
import { toggleBookmarkApi, checkBookmarkApi } from '../../api/bookmark.api';
import useAuth from '../../hooks/useAuth';

const TINTS = ['#FAEBC0','#FDE8D5','#E4EFE7','#F0E8F0','#E8EEF5'];

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // review form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

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
  }, [id, isAuthenticated, navigate]);

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
    if (comment.trim().length < 10) {
      toast.error('Comment must be at least 10 characters');
      return;
    }
    try {
      setSubmitting(true);
      const res = await createReviewApi({
        recipeId: id, rating, comment,
      });
      setReviews((prev) => [res.data.data.review, ...prev]);
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
      const reviewToDelete = reviews.find(r => r._id === reviewId);
      await deleteReviewApi(reviewId);
      
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      
      if (reviewToDelete) {
        setRecipe(prev => {
          const newTotal = Math.max(0, prev.totalReviews - 1);
          let newAvg = 0;
          if (newTotal > 0) {
            const sum = (prev.averageRating * prev.totalReviews) - reviewToDelete.rating;
            newAvg = (sum / newTotal).toFixed(1);
          }
          return { ...prev, totalReviews: newTotal, averageRating: newAvg };
        });
      }
      toast.success('Review deleted');
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const handleDeleteRecipe = async () => {
    try {
      await deleteRecipeApi(id);
      toast.success('Recipe deleted');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to delete recipe');
    }
  };

  const currentUserId = user?.id || user?._id;
  const isOwner = currentUserId === recipe?.author?._id;
  const hasReviewed = reviews.some((r) => r.user?._id === currentUserId);
  const canReview = isAuthenticated && !isOwner && !hasReviewed;

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20">
          <span className="inline-block w-5 h-5 border-2 border-paprika border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }
  if (!recipe) return null;

  const recipeNumber = Number.isFinite(Number(recipe.recipeIndex))
    ? Number(recipe.recipeIndex)
    : null;
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0
    ? (reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviewCount).toFixed(1)
    : Number(recipe.averageRating || 0).toFixed(1);

  return (
    <Layout>
      <div className="page-enter">
        {/* HEADER */}
        <div className="bg-parchment border-b border-linen">
          <div className="max-w-5xl mx-auto px-6 py-10">
            <div className="editorial-label mb-3">
              {recipe.category}
              {recipeNumber !== null && (
                <> · Recipe no. {String(recipeNumber).padStart(3,'0')}</>
              )}
            </div>
            <h1 className="font-heading text-4xl md:text-5xl max-w-2xl leading-tight mb-4">
              {recipe.title}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500">by {recipe.author?.name}</span>
              {recipe.author?.isVerifiedChef && <span className="badge-verified">✓ Verified</span>}
              <span className="text-linen mx-1">·</span>
              <span className="text-paprika font-medium text-sm">★ {averageRating}</span>
              <span className="text-gray-400 text-sm">({reviewCount} reviews)</span>
              <span className="text-linen mx-1">·</span>
              <span className="text-gray-400 text-sm">{recipe.prepTime} min</span>
              <span className="text-linen mx-1">·</span>
              <span className="text-gray-400 text-sm">{recipe.difficulty}</span>
            </div>
          </div>
        </div>

        {/* TWO-COLUMN BODY */}
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* LEFT */}
            <div>
              {/* Recipe image or tinted placeholder */}
              <div className="h-56 rounded-xl overflow-hidden relative"
                style={{ background: TINTS[0] }}>
                {recipe.image ? (
                  <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="font-heading text-5xl italic text-gray-900 opacity-10 select-none">
                      {recipe.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-4 mb-8">
                <button onClick={handleBookmark}
                  className="border border-linen text-gray-700 rounded-lg py-2.5 flex-1 hover:bg-parchment transition-colors text-sm">
                  {bookmarked ? '★ Bookmarked' : '☆ Bookmark'}
                </button>
                <button onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copied to clipboard');
                }}
                  className="border border-linen text-gray-700 rounded-lg py-2.5 flex-1 hover:bg-parchment transition-colors text-sm">
                  Share
                </button>
              </div>

              {/* INGREDIENTS */}
              <div className="editorial-label mb-3 pb-2 border-b border-linen">Ingredients</div>
              {recipe.ingredients?.map((ing, i) => (
                <div key={i} className="flex items-center gap-3 py-2
                  border-b border-gray-100 last:border-0">
                  <div className="w-1 h-1 rounded-full bg-paprika shrink-0" />
                  <span className="text-sm font-medium text-paprika min-w-[52px]">
                    {ing.amount}
                  </span>
                  <span className="text-sm text-gray-800">{ing.name}</span>
                </div>
              ))}

              {/* TOOLS */}
              {recipe.toolsUsed?.length > 0 && (
                <div className="mt-6 pt-5 border-t border-linen">
                  <div className="editorial-label mb-3">Tools required</div>
                  <div className="flex flex-wrap gap-1.5">
                    {recipe.toolsUsed.map(t => (
                      <span key={t} className="text-xs text-gray-500 border border-linen
                        rounded px-2.5 py-1">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-2">
              <div className="editorial-label mb-6 pb-2 border-b border-linen">Method</div>
              {recipe.instructions?.map((step, i) => (
                <div key={i}>
                  <div className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-peach flex items-center
                      justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-paprika">{i+1}</span>
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed flex-1">
                      {step.text ?? step}
                    </p>
                  </div>
                  {i < (recipe.instructions?.length || 0) - 1 && (
                    <div className="border-t border-gray-100 my-5 ml-10" />
                  )}
                </div>
              ))}

              {/* Owner actions */}
              {isOwner && (
                <div className="flex gap-3 mt-10 pt-8 border-t border-linen">
                  <Link to={`/recipes/edit/${id}`}
                    className="border border-linen text-gray-700 text-sm px-5 py-2.5
                      rounded-lg hover:bg-parchment transition-colors">
                    Edit recipe
                  </Link>
                  {confirmDelete ? (
                    <div className="flex gap-1">
                      <button onClick={handleDeleteRecipe}
                        className="text-xs bg-red-500 text-white px-3 py-2.5 rounded-lg">Yes, delete</button>
                      <button onClick={() => setConfirmDelete(false)}
                        className="text-xs border border-linen text-gray-500 px-3 py-2.5 rounded-lg">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(true)}
                      className="border border-red-100 text-red-600 text-sm px-5 py-2.5
                        rounded-lg hover:bg-red-50 transition-colors">
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* REVIEWS */}
          <div className="mt-16 pt-12 border-t border-linen">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-heading text-2xl">What people say</h2>
              <span className="editorial-label">{reviewCount} reviews</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {reviews.map(r => (
                <div key={r._id} className="bg-stone-50 rounded-xl p-5 relative group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-peach flex items-center
                        justify-center text-paprika text-xs font-medium">
                        {r.user?.name?.[0]}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{r.user?.name}</div>
                        <div className="editorial-label text-xs">
                          {new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <span className="text-paprika text-sm">
                      {'★'.repeat(r.rating)}<span className="text-linen">{'☆'.repeat(5-r.rating)}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{r.comment}</p>
                  
                  {currentUserId === r.user?._id && (
                    <button onClick={() => handleDeleteReview(r._id)} 
                      className="absolute top-4 right-4 text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Write review form */}
            {canReview && (
              <div className="bg-stone-50 rounded-xl p-6 max-w-lg">
                <div className="editorial-label mb-4">Leave a review</div>
                <form onSubmit={handleSubmitReview}>
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button" onClick={() => setRating(n)}
                        className={`text-2xl leading-none transition-colors
                          ${n <= rating ? 'text-paprika' : 'text-linen'}`}>★</button>
                    ))}
                  </div>
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3} placeholder="Share your honest thoughts..."
                    className="w-full border border-linen rounded-lg px-4 py-3 text-sm
                      bg-white focus:outline-none focus:border-sand resize-none" 
                  />
                  <button type="submit" disabled={submitting}
                    className="mt-3 bg-paprika text-white text-sm font-medium
                      px-5 py-2.5 rounded-lg hover:bg-red-800 transition-colors flex items-center gap-2">
                    {submitting && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    {submitting ? 'Submitting...' : 'Submit review'}
                  </button>
                </form>
              </div>
            )}

            {hasReviewed && (
              <div className="bg-peach/30 border border-peach text-red-900 rounded-xl p-4 text-sm inline-block">
                You have already reviewed this recipe.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RecipeDetailPage;