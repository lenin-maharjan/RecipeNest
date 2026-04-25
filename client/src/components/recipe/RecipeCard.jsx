import { Link } from 'react-router-dom';
import { toggleBookmarkApi } from '../../api/bookmark.api';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

const TINTS = ['#FAEBC0','#FDE8D5','#E4EFE7','#F0E8F0','#E8EEF5'];

const RecipeCard = ({ recipe, isBookmarked = false, onBookmarkToggle, index = 0 }) => {
  const { isAuthenticated } = useAuth();
  const [bookmarking, setBookmarking] = useState(false);
  const [localBookmarked, setLocalBookmarked] = useState(isBookmarked);

  useEffect(() => {
    setLocalBookmarked(isBookmarked);
  }, [isBookmarked]);

  if (!recipe) return null;

  const handleBookmark = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please login to bookmark');
    try {
      setBookmarking(true);
      const res = await toggleBookmarkApi(recipe._id);
      const { bookmarked } = res.data.data;
      setLocalBookmarked(bookmarked);
      toast.success(bookmarked ? 'Bookmarked!' : 'Bookmark removed');
      if (onBookmarkToggle) onBookmarkToggle(recipe._id, bookmarked);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setBookmarking(false);
    }
  };

  return (
    <div className="relative">
      <Link to={`/recipes/${recipe._id}`}
        className="bg-white border border-linen rounded-xl overflow-hidden
          block hover:-translate-y-0.5 hover:border-sand transition-all duration-200 group">

        <div className="h-44 relative overflow-hidden flex items-center justify-center"
          style={{ background: TINTS[index % TINTS.length] }}>
          {recipe.image
            ? <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
            : <span className="font-heading text-5xl italic text-gray-900 opacity-10 select-none">
                {recipe.category}
              </span>
          }
          {recipe.author?.isVerifiedChef && (
            <span className="badge-verified absolute top-3 left-3">✓ Verified</span>
          )}
          <span className="absolute top-3 right-3 font-heading text-xs text-gray-900
            opacity-15 select-none" aria-hidden="true">
            {String(index + 1).padStart(2,'0')}
          </span>
        </div>

        <div className="p-5">
          <div className="editorial-label mb-1.5">
            {recipe.category} · {recipe.prepTime} min
          </div>
          <h3 className="font-heading text-lg leading-snug line-clamp-2 mb-3">
            {recipe.title}
          </h3>
          <div className="border-t border-linen mb-3" />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">{recipe.author?.name}</span>
            <span className="text-sm text-paprika font-medium">
              ★ {recipe.averageRating?.toFixed(1) ?? '—'}
            </span>
          </div>
          <div className="flex gap-1.5 mt-2.5 flex-wrap">
            <span className="text-xs text-gray-400 border border-linen rounded-sm px-2 py-0.5">
              {recipe.totalReviews} reviews
            </span>
            {recipe.difficulty && (
              <span className="text-xs text-gray-400 border border-linen rounded-sm px-2 py-0.5">
                {recipe.difficulty}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Bookmark button */}
      <button
        onClick={handleBookmark}
        disabled={bookmarking}
        className="absolute top-3 right-10 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-parchment hover:scale-110 transition-all disabled:opacity-60 z-10 border border-linen"
      >
        <svg className={`w-4 h-4 ${localBookmarked ? 'text-paprika' : 'text-gray-400'}`} fill={localBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={localBookmarked ? 0 : 2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>
    </div>
  );
};

export default RecipeCard;