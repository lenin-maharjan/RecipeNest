import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../../components/common/Layout';
import RecipeCard from '../../components/recipe/RecipeCard';
import { getMyRecipesApi, deleteRecipeApi } from '../../api/recipe.api';

const TINTS = ['#FAEBC0','#FDE8D5','#E4EFE7','#F0E8F0','#E8EEF5'];

const MyRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const res = await getMyRecipesApi();
        setRecipes(res.data.data.recipes);
      } catch { toast.error('Failed to load recipes'); } finally { setLoading(false); }
    };
    fetchMyRecipes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteRecipeApi(id);
      setRecipes(prev => prev.filter(r => r._id !== id));
      setConfirmId(null);
      toast.success('Recipe deleted');
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <Layout><div className="flex justify-center items-center py-20"><span className="inline-block w-5 h-5 border-2 border-paprika border-t-transparent rounded-full animate-spin" /></div></Layout>;

  return (
    <Layout>
      <div className="page-enter">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-6">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="editorial-label mb-2">Your portfolio</div>
              <div className="flex items-baseline gap-3">
                <h1 className="font-heading text-5xl">My Recipes</h1>
                <span className="text-gray-400 text-sm">{recipes.length} recipes</span>
              </div>
            </div>
            <Link to="/recipes/add" className="bg-paprika text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-red-800 transition-colors">+ Add Recipe</Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          {recipes.length === 0 ? (
            <div className="text-center py-20">
              <div className="font-heading text-6xl text-linen mb-3">—</div>
              <h3 className="font-heading text-xl">No recipes yet</h3>
              <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">Share your first recipe with the community.</p>
              <Link to="/recipes/add" className="inline-block mt-6 bg-paprika text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-red-800 transition-colors">Create Recipe</Link>
            </div>
          ) : (
            <div className="space-y-0">
              {recipes.map((recipe, i) => (
                <div key={recipe._id} className="flex gap-3 items-center px-6 py-4 border-b border-linen last:border-0">
                  <div className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center" style={{background: TINTS[i % TINTS.length]}}>
                    <span className="font-heading text-xl italic opacity-20">{recipe.category?.[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="editorial-label mb-0.5">{recipe.category}</div>
                    <Link to={`/recipes/${recipe._id}`} className="font-heading text-base truncate block hover:text-paprika transition-colors">{recipe.title}</Link>
                    <div className="text-xs text-gray-400 mt-0.5">★ {Number(recipe.averageRating||0).toFixed(1)} · {recipe.totalReviews||0} reviews</div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link to={`/recipes/edit/${recipe._id}`} className="text-xs border border-linen text-gray-500 px-3 py-1.5 rounded-lg hover:border-sand transition-colors">Edit</Link>
                    {confirmId === recipe._id ? (
                      <div className="flex gap-1">
                        <button onClick={() => handleDelete(recipe._id)} className="text-xs bg-red-500 text-white px-2 py-1.5 rounded">Yes</button>
                        <button onClick={() => setConfirmId(null)} className="text-xs border border-linen text-gray-500 px-2 py-1.5 rounded">No</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmId(recipe._id)} className="text-xs border border-red-100 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">Delete</button>
                    )}
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

export default MyRecipesPage;