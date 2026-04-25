import { Link } from 'react-router-dom';
import VerifiedBadge from './VerifiedBadge';

const ChefCard = ({ chef }) => {
  const recipeCount = chef?.stats?.recipeCount ?? chef?.recipes?.length ?? 0;
  const totalReviews = chef?.stats?.totalReviews ?? (
    chef?.recipes?.reduce((sum, r) => sum + (r.totalReviews || 0), 0) || 0
  );
  const avgRating = chef?.stats?.avgRating !== undefined
    ? Number(chef.stats.avgRating).toFixed(1)
    : recipeCount > 0
      ? (
          chef.recipes.reduce(
            (sum, r) => sum + (r.averageRating || 0), 0
          ) / recipeCount
        ).toFixed(1)
      : '0.0';

  return (
    <Link
      to={`/chefs/${chef._id}`}
      className="bg-white border border-linen rounded-xl overflow-hidden
                 hover:shadow-sm transition-shadow duration-200 group block"
    >
      {/* avatar section */}
      <div className="h-28 bg-gradient-to-r from-peach to-warm1
                      flex items-center justify-center border-b border-linen">
        <div className="w-20 h-20 rounded-full bg-white border border-linen
                        flex items-center justify-center overflow-hidden
                        text-paprika text-3xl font-bold shadow-sm
                        group-hover:scale-110 transition-transform duration-300">
          {chef?.avatar ? (
            <img
              src={chef.avatar}
              alt={chef?.name || 'Chef avatar'}
              className="w-full h-full object-cover"
            />
          ) : (
            chef?.name?.charAt(0).toUpperCase()
          )}
        </div>
      </div>

      {/* content */}
      <div className="p-6">
        {/* name and badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1">
            <h3 className="font-heading text-2xl text-gray-900 group-hover:text-paprika
                           transition-colors line-clamp-2">
              {chef?.name}
            </h3>
          </div>
          {(chef?.isVerified || chef?.isVerifiedChef) && <VerifiedBadge size="sm" />}
        </div>

        {/* role badge */}
        <div className="mb-3">
          <span className="inline-block bg-parchment text-gray-700 border border-linen
                           text-xs font-medium px-2.5 py-1 rounded-md
                           capitalize">
            {chef?.role}
          </span>
        </div>

        {/* bio */}
        {chef?.bio && (
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
            {chef.bio}
          </p>
        )}

        {/* stats */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-linen">
          <div className="text-center">
            <p className="font-heading text-2xl text-paprika leading-none">
              {recipeCount}
            </p>
            <p className="text-xs text-gray-500 mt-1">Recipes</p>
          </div>
          <div className="text-center">
            <p className="font-heading text-2xl text-paprika leading-none">
              {totalReviews}
            </p>
            <p className="text-xs text-gray-500 mt-1">Reviews</p>
          </div>
          <div className="text-center">
            <p className="font-heading text-2xl text-paprika leading-none">
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
