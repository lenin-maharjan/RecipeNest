import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../../components/common/Layout';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import RecipeCard from '../../components/recipe/RecipeCard';
import VerifiedBadge from '../../components/chef/VerifiedBadge';
import useAuth from '../../hooks/useAuth';
import { getMyRecipesApi } from '../../api/recipe.api';

const ChefAnalyticsPage = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await getMyRecipesApi();
        setRecipes(res.data.data.recipes);
      } catch {
        toast.error('Failed to load recipes');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  if (loading) return <Spinner />;

  // calculate analytics
  const totalRecipes = recipes.length;
  const totalReviews = recipes.reduce(
    (sum, r) => sum + (r.totalReviews || 0), 0
  );
  const totalBookmarks = recipes.reduce(
    (sum, r) => sum + (r.totalBookmarks || 0), 0
  );
  const avgRating = totalRecipes > 0
    ? (
        recipes.reduce(
          (sum, r) => sum + (r.averageRating || 0), 0
        ) / totalRecipes
      ).toFixed(1)
    : '0.0';

  // top recipes by rating
  const topRecipes = [...recipes]
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, 3);

  // stats cards
  const stats = [
    {
      title: 'Total Recipes',
      value: totalRecipes,
      icon: '📚',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Total Reviews',
      value: totalReviews,
      icon: '⭐',
      color: 'bg-yellow-50 text-yellow-600',
    },
    {
      title: 'Total Bookmarks',
      value: totalBookmarks,
      icon: '❤️',
      color: 'bg-red-50 text-red-600',
    },
    {
      title: 'Average Rating',
      value: avgRating,
      icon: '⚡',
      color: 'bg-green-50 text-green-600',
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl font-bold text-gray-900">
                Analytics
              </h1>
              {user?.isVerifiedChef && <VerifiedBadge size="md" />}
            </div>
            <p className="text-gray-500">
              Track your recipe performance and engagement
            </p>
          </div>
          <Link to="/chef-dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>

        {/* stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2
                        lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.title} className="card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg
                               flex items-center justify-center text-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* top performing recipes */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Top Performing Recipes
          </h2>

          {topRecipes.length > 0 ? (
            <div className="space-y-4">
              {topRecipes.map((recipe, idx) => (
                <div key={recipe._id}
                  className="flex items-start gap-4 pb-4 border-b
                             border-gray-200 last:border-0">
                  <div className="w-8 h-8 bg-primary-100
                                 text-primary-600 rounded-full
                                 flex items-center justify-center
                                 font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center gap-6 flex-wrap">
                      <div className="text-sm">
                        <span className="text-gray-500">Rating: </span>
                        <span className="font-semibold text-gray-900">
                          {recipe.averageRating || 0} ⭐
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Reviews: </span>
                        <span className="font-semibold text-gray-900">
                          {recipe.totalReviews || 0}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Bookmarks: </span>
                        <span className="font-semibold text-gray-900">
                          {recipe.totalBookmarks || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/recipes/${recipe._id}`}
                    className="text-primary-500 hover:text-primary-600
                               font-medium text-sm flex-shrink-0"
                  >
                    View →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No recipes yet</p>
              <Link to="/recipes/add">
                <Button>Create Your First Recipe</Button>
              </Link>
            </div>
          )}
        </div>

        {/* all recipes */}
        {recipes.length > 3 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              All Your Recipes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2
                            lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ChefAnalyticsPage;
