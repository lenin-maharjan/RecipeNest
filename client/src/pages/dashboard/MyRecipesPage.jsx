// const MyRecipesPage = () => <div>My Recipes</div>;
// export default MyRecipesPage;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../../components/common/Layout';
import RecipeCard from '../../components/recipe/RecipeCard';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { getMyRecipesApi, deleteRecipeApi } from '../../api/recipe.api';

const MyRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const res = await getMyRecipesApi();
        setRecipes(res.data.data.recipes);
      } catch {
        toast.error('Failed to load recipes');
      } finally {
        setLoading(false);
      }
    };
    fetchMyRecipes();
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

  if (loading) return <Spinner />;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Recipes</h1>
            <p className="text-gray-500 mt-1">
              {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link to="/recipes/add">
            <Button>+ Add Recipe</Button>
          </Link>
        </div>

        {recipes.length === 0 ? (
          <EmptyState
            title="No recipes yet"
            message="Share your first recipe with the community"
            action={
              <Link to="/recipes/add">
                <Button>Create Recipe</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2
                          lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <div key={recipe._id} className="relative group">
                <RecipeCard recipe={recipe} />
                {/* action overlay */}
                <div className="absolute top-14 right-2 hidden
                                group-hover:flex flex-col gap-1 z-10">
                  <Link to={`/recipes/edit/${recipe._id}`}>
                    <button className="bg-white text-gray-700 text-xs
                                       px-3 py-1.5 rounded-lg shadow-md
                                       hover:bg-gray-50 w-full text-left
                                       border border-gray-100">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(recipe._id)}
                    className="bg-white text-red-500 text-xs px-3 py-1.5
                               rounded-lg shadow-md hover:bg-red-50 w-full
                               text-left border border-gray-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyRecipesPage;