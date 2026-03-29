import { Link } from 'react-router-dom';
import { toggleBookmarkApi } from '../../api/bookmark.api';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { useState } from 'react';

const RecipeCard = ({ recipe, onBookmarkToggle }) => {
  const { isAuthenticated } = useAuth();
  const [bookmarking, setBookmarking] = useState(false);

  const handleBookmark = async (e) => {
    e.preventDefault(); // prevent navigating to recipe page
    if (!isAuthenticated) {
      toast.error('Please login to bookmark recipes');
      return;
    }
    try {
      setBookmarking(true);
      const res = await toggleBookmarkApi(recipe._id);
      const { bookmarked } = res.data.data;
      toast.success(bookmarked ? 'Bookmarked!' : 'Bookmark removed');
      if (onBookmarkToggle) onBookmarkToggle(recipe._id, bookmarked);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setBookmarking(false);
    }
  };

  return (
    <Link
      to={`/recipes/${recipe._id}`}
      className="card hover:shadow-md transition-shadow duration-200
                 group block"
    >
      {/* image */}
      <div className="relative h-48 bg-gray-100 rounded-t-xl overflow-hidden">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105
                       transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-300" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* category badge */}
        <span className="absolute top-3 left-3 bg-white text-gray-700
                         text-xs font-medium px-2.5 py-1 rounded-full
                         shadow-sm">
          {recipe.category}
        </span>

        {/* bookmark button */}
        <button
          onClick={handleBookmark}
          disabled={bookmarking}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full
                     flex items-center justify-center shadow-sm
                     hover:bg-primary-50 transition-colors"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* content */}
      <div className="p-4">
        {/* author */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-primary-100 flex
                          items-center justify-center text-primary-600
                          text-xs font-semibold flex-shrink-0">
            {recipe.author?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-gray-500 truncate">
            {recipe.author?.name}
          </span>
          {recipe.author?.isVerifiedChef && (
            <span className="badge-verified">
              ✓ Verified
            </span>
          )}
        </div>

        {/* title */}
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2
                       group-hover:text-primary-500 transition-colors">
          {recipe.title}
        </h3>

        {/* description */}
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {recipe.description}
        </p>

        {/* meta row */}
        <div className="flex items-center justify-between text-xs
                        text-gray-400">
          <div className="flex items-center gap-3">
            {/* time */}
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {(recipe.prepTime || 0) + (recipe.cookTime || 0)} min
            </span>
            {/* difficulty */}
            <span className={`font-medium ${
              recipe.difficulty === 'Easy' ? 'text-green-500' :
              recipe.difficulty === 'Medium' ? 'text-yellow-500' :
              'text-red-500'
            }`}>
              {recipe.difficulty}
            </span>
          </div>
          {/* rating */}
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-yellow-400 fill-current"
              viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{recipe.averageRating?.toFixed(1) || '0.0'}</span>
            <span>({recipe.totalReviews || 0})</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;