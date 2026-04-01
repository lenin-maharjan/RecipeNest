import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../../components/common/Layout';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import {
  getAllRecipesAdminApi,
  togglePublishRecipeApi,
  deleteRecipeAdminApi,
} from '../../api/admin.api';

const AdminRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllRecipesAdminApi({
        page,
        limit: 15,
        ...(search && { search }),
      });
      setRecipes(res.data.data.recipes);
      setTotalPages(res.data.data.pagination.pages);
    } catch {
      toast.error('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleTogglePublish = async (recipeId) => {
    try {
      const res = await togglePublishRecipeApi(recipeId);
      const { isPublished } = res.data.data.recipe;
      setRecipes((prev) =>
        prev.map((r) =>
          r._id === recipeId ? { ...r, isPublished } : r
        )
      );
      toast.success(
        isPublished ? 'Recipe published' : 'Recipe unpublished'
      );
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (recipeId) => {
    if (!window.confirm('Permanently delete this recipe?')) return;
    try {
      await deleteRecipeAdminApi(recipeId);
      setRecipes((prev) => prev.filter((r) => r._id !== recipeId));
      toast.success('Recipe deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Recipe Moderation
          </h1>
          <p className="text-gray-500 mt-1">
            Manage all recipes including unpublished content
          </p>
        </div>

        {/* search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="input-field max-w-md"
          />
        </div>

        {loading ? (
          <Spinner fullScreen={false} />
        ) : recipes.length === 0 ? (
          <EmptyState
            title="No recipes found"
            message="Try a different search term"
          />
        ) : (
          <>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-4 py-3 text-xs
                                     font-semibold text-gray-500
                                     uppercase tracking-wider">
                        Recipe
                      </th>
                      <th className="text-left px-4 py-3 text-xs
                                     font-semibold text-gray-500
                                     uppercase tracking-wider
                                     hidden sm:table-cell">
                        Author
                      </th>
                      <th className="text-left px-4 py-3 text-xs
                                     font-semibold text-gray-500
                                     uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 text-xs
                                     font-semibold text-gray-500
                                     uppercase tracking-wider
                                     hidden md:table-cell">
                        Rating
                      </th>
                      <th className="text-left px-4 py-3 text-xs
                                     font-semibold text-gray-500
                                     uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recipes.map((recipe) => (
                      <tr key={recipe._id}
                        className="hover:bg-gray-50 transition-colors">

                        {/* recipe info */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {recipe.image ? (
                              <img
                                src={recipe.image}
                                alt={recipe.title}
                                className="w-10 h-10 rounded-lg
                                           object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg
                                              bg-gray-100 flex-shrink-0" />
                            )}
                            <div>
                              <Link
                                to={`/recipes/${recipe._id}`}
                                className="text-sm font-medium
                                           text-gray-900 hover:text-primary-500
                                           transition-colors line-clamp-1"
                              >
                                {recipe.title}
                              </Link>
                              <p className="text-xs text-gray-500">
                                {recipe.category}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* author */}
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">
                              {recipe.author?.name}
                            </span>
                            {recipe.author?.isVerifiedChef && (
                              <span className="text-xs bg-green-100
                                text-green-700 px-1.5 py-0.5
                                rounded-full font-medium">
                                ✓
                              </span>
                            )}
                          </div>
                        </td>

                        {/* status */}
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2.5
                            py-1 rounded-full ${
                            recipe.isPublished
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {recipe.isPublished
                              ? 'Published'
                              : 'Hidden'}
                          </span>
                        </td>

                        {/* rating */}
                        <td className="px-4 py-3 text-sm text-gray-600
                                       hidden md:table-cell">
                          ★ {recipe.averageRating?.toFixed(1) || '0.0'}
                          <span className="text-gray-400 text-xs ml-1">
                            ({recipe.totalReviews || 0})
                          </span>
                        </td>

                        {/* actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleTogglePublish(recipe._id)
                              }
                              className={`text-xs font-medium px-2.5
                                py-1 rounded-lg transition-colors ${
                                recipe.isPublished
                                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {recipe.isPublished ? 'Hide' : 'Publish'}
                            </button>
                            <button
                              onClick={() => handleDelete(recipe._id)}
                              className="text-xs font-medium px-2.5
                                         py-1 rounded-lg bg-red-100
                                         text-red-600 hover:bg-red-200
                                         transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="secondary"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm
                                 text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="secondary"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminRecipesPage;