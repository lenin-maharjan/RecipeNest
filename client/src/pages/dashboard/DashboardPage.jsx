// const DashboardPage = () => <div>Dashboard</div>;
// export default DashboardPage;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import RecipeCard from '../../components/recipe/RecipeCard';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import { getMyRecipesApi } from '../../api/recipe.api';
import { getBookmarksApi } from '../../api/bookmark.api';

const DashboardPage = () => {
  const { user } = useAuth();
  const [myRecipes, setMyRecipes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipesRes, bookmarksRes] = await Promise.all([
          getMyRecipesApi(),
          getBookmarksApi(),
        ]);
        setMyRecipes(recipesRes.data.data.recipes);
        setBookmarks(bookmarksRes.data.data.bookmarks);
      } catch {
        // handled by interceptor
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner />;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-500 mt-1">
            Here's what's happening with your recipes
          </p>
        </div>

        {/* stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            {
              label: 'My Recipes',
              value: myRecipes.length,
              color: 'text-primary-500',
              bg: 'bg-primary-50',
            },
            {
              label: 'Bookmarks',
              value: bookmarks.length,
              color: 'text-blue-500',
              bg: 'bg-blue-50',
            },
            {
              label: 'Total Reviews',
              value: myRecipes.reduce(
                (sum, r) => sum + (r.totalReviews || 0), 0
              ),
              color: 'text-green-500',
              bg: 'bg-green-50',
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

        {/* my recipes section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              My Recipes
            </h2>
            <div className="flex gap-2">
              <Link to="/my-recipes">
                <Button variant="secondary">View All</Button>
              </Link>
              <Link to="/recipes/add">
                <Button>+ Add Recipe</Button>
              </Link>
            </div>
          </div>

          {myRecipes.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-gray-400 mb-4">
                You haven't created any recipes yet
              </p>
              <Link to="/recipes/add">
                <Button>Create Your First Recipe</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2
                            lg:grid-cols-3 gap-6">
              {myRecipes.slice(0, 3).map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>

        {/* bookmarks section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Bookmarks
            </h2>
            <Link to="/bookmarks">
              <Button variant="secondary">View All</Button>
            </Link>
          </div>

          {bookmarks.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-gray-400 mb-4">
                You haven't bookmarked any recipes yet
              </p>
              <Link to="/recipes">
                <Button variant="secondary">Browse Recipes</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2
                            lg:grid-cols-3 gap-6">
              {bookmarks.slice(0, 3).map((bookmark) => (
                <RecipeCard
                  key={bookmark._id}
                  recipe={bookmark.recipe}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default DashboardPage;