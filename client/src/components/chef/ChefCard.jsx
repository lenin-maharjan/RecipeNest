import { Link } from 'react-router-dom';
import VerifiedBadge from './VerifiedBadge';

const ChefCard = ({ chef }) => {
  const recipeCount = chef?.recipes?.length || 0;
  const totalReviews = chef?.recipes?.reduce(
    (sum, r) => sum + (r.totalReviews || 0), 0
  ) || 0;
  const avgRating = recipeCount > 0
    ? (
        chef.recipes.reduce(
          (sum, r) => sum + (r.averageRating || 0), 0
        ) / recipeCount
      ).toFixed(1)
    : '0.0';

  return (
    <Link
      to={`/chefs/${chef._id}`}
      className="card hover:shadow-md transition-shadow duration-200
                 group block"
    >
      {/* avatar section */}
      <div className="h-32 bg-gradient-to-r from-primary-400 to-primary-500
                      flex items-center justify-center rounded-t-xl">
        <div className="w-20 h-20 rounded-full bg-white
                        flex items-center justify-center
                        text-primary-500 text-3xl font-bold shadow-md
                        group-hover:scale-110 transition-transform duration-300">
          {chef?.name?.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* content */}
      <div className="p-6">
        {/* name and badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-500
                           transition-colors line-clamp-2">
              {chef?.name}
            </h3>
          </div>
          {chef?.isVerified && <VerifiedBadge size="sm" />}
        </div>

        {/* role badge */}
        <div className="mb-3">
          <span className="inline-block bg-orange-100 text-orange-700
                           text-xs font-medium px-2.5 py-1 rounded-full
                           capitalize">
            {chef?.role}
          </span>
        </div>

        {/* bio */}
        {chef?.bio && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {chef.bio}
          </p>
        )}

        {/* stats */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-lg font-bold text-primary-500">
              {recipeCount}
            </p>
            <p className="text-xs text-gray-500 mt-1">Recipes</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary-500">
              {totalReviews}
            </p>
            <p className="text-xs text-gray-500 mt-1">Reviews</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary-500">
              {avgRating}
            </p>
            <p className="text-xs text-gray-500 mt-1">Rating</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ChefCard;
