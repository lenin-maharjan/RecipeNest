// const RecipesPage = () => <div>Recipes Page</div>;
// export default RecipesPage;

import { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/common/Layout';
import RecipeCard from '../../components/recipe/RecipeCard';
import RecipeFilter from '../../components/recipe/RecipeFilter';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import SkeletonCard from '../../components/common/SkeletonCard';
import { getRecipesApi } from '../../api/recipe.api';
import { Link } from 'react-router-dom';

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: '',
    minRating: '',
    verifiedOnly: false,
  });

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.difficulty && { difficulty: filters.difficulty }),
        ...(filters.minRating && { minRating: filters.minRating }),
        ...(filters.verifiedOnly && { verifiedOnly: true }),
      };

      const res = await getRecipesApi(params);
      setRecipes(res.data.data.recipes);
      setTotalPages(res.data.data.pagination.pages);
    } catch {
      // error handled by axios interceptor
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  // fetch when page or filters change
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // reset to page 1 when filters change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Recipes</h1>
          <p className="text-gray-500 mt-1">
            Discover dishes from our community of chefs
          </p>
        </div>

        {/* filters */}
        <div className="mb-6">
          <RecipeFilter
            filters={filters}
            onChange={handleFilterChange}
          />
        </div>

        {/* content */}
        {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2
                        lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : recipes.length === 0 ? (
          <EmptyState
            title="No recipes found"
            message="Try adjusting your filters or search terms"
            action={
              <Button onClick={() => handleFilterChange({
                search: '', category: '', difficulty: '',
                minRating: '', verifiedOnly: false,
              })}>
                Clear Filters
              </Button>
            }
          />
        ) : (
          <>
            {/* grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2
                            lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                />
              ))}
            </div>

            {/* pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <Button
                  variant="secondary"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p =>
                      p === 1 || p === totalPages ||
                      Math.abs(p - page) <= 1
                    )
                    .map((p, idx, arr) => (
                      <span key={p} className="contents">
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span key={`dots-${p}`}
                            className="px-2 text-gray-400">
                            ...
                          </span>
                        )}
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium
                            transition-colors ${page === p
                              ? 'bg-primary-500 text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                          {p}
                        </button>
                      </span>
                    ))
                  }
                </div>
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

export default RecipesPage;