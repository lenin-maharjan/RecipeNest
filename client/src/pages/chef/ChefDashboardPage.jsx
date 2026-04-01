import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../../components/common/Layout';
import RecipeCard from '../../components/recipe/RecipeCard';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import VerifiedBadge from '../../components/chef/VerifiedBadge';
import useAuth from '../../hooks/useAuth';
import { getMyRecipesApi, deleteRecipeApi } from '../../api/recipe.api';

const ChefDashboardPage = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recipe?')) return;
    try {
      await deleteRecipeApi(id);
      setRecipes((prev) => prev.filter((r) => r._id !== id));
      toast.success('Recipe deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  // calculate stats from recipes
  const totalReviews = recipes.reduce(
    (sum, r) => sum + (r.totalReviews || 0), 0
  );
  const avgRating =
    recipes.length > 0
      ? (
          recipes.reduce(
            (sum, r) => sum + (r.averageRating || 0), 0
          ) / recipes.length
        ).toFixed(1)
      : '0.0';

  if (loading) return <Spinner />;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl font-bold text-gray-900">
                Chef Portal
              </h1>
              {user?.isVerifiedChef && <VerifiedBadge size="md" />}
            </div>
            <p className="text-gray-500">
              Manage your professional recipe portfolio
            </p>
          </div>
          <Link to="/recipes/add">
            <Button>+ New Recipe</Button>
          </Link>
        </div>

        {/* verification banner */}
        {!user?.isVerifiedChef && (
          <div className="bg-amber-50 border border-amber-200
                          rounded-xl p-4 mb-8 flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-amber-800 font-medium text-sm">
                Verification pending
              </p>
              <p className="text-amber-600 text-sm mt-0.5">
                Your account is awaiting admin verification.
                Once verified, your recipes will display a
                verified chef badge.
              </p>
            </div>
          </div>
        )}

        {/* stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            {
              label: 'Total Recipes',
              value: recipes.length,
              color: 'text-primary-500',
              bg: 'bg-primary-50',
            },
            {
              label: 'Total Reviews',
              value: totalReviews,
              color: 'text-blue-500',
              bg: 'bg-blue-50',
            },
            {
              label: 'Average Rating',
              value: avgRating,
              color: 'text-yellow-500',
              bg: 'bg-yellow-50',
            },
          ].map((stat) => (
            <div key={stat.label}
              className={`${stat.bg} rounded-2xl p-6`}>
              <p className={`text-4xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-gray-600 mt-1 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* recipes */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Your Recipes
          </h2>

          {recipes.length === 0 ? (
            <EmptyState
              title="No recipes yet"
              message="Start building your professional portfolio"
              action={
                <Link to="/recipes/add">
                  <Button>Create First Recipe</Button>
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2
                            lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <div key={recipe._id} className="relative group">
                  <RecipeCard recipe={recipe} />
                  <div className="absolute top-14 right-2 hidden
                                  group-hover:flex flex-col gap-1 z-10">
                    <Link to={`/recipes/edit/${recipe._id}`}>
                      <button className="bg-white text-gray-700
                                         text-xs px-3 py-1.5 rounded-lg
                                         shadow-md hover:bg-gray-50
                                         w-full text-left border
                                         border-gray-100">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(recipe._id)}
                      className="bg-white text-red-500 text-xs
                                 px-3 py-1.5 rounded-lg shadow-md
                                 hover:bg-red-50 w-full text-left
                                 border border-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default ChefDashboardPage;