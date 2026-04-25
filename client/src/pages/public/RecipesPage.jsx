import { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/common/Layout';
import RecipeCard from '../../components/recipe/RecipeCard';
import RecipeFilter from '../../components/recipe/RecipeFilter';
import { getRecipesApi } from '../../api/recipe.api';
import { getBookmarksApi } from '../../api/bookmark.api';
import useAuth from '../../hooks/useAuth';

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    authorSearch: '',
    category: '',
    difficulty: '',
    minRating: '',
    verifiedOnly: false,
  });
  
  const { isAuthenticated } = useAuth();
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        ...(filters.search && { search: filters.search }),
        ...(filters.authorSearch && { authorSearch: filters.authorSearch }),
        ...(filters.category && { category: filters.category }),
        ...(filters.difficulty && { difficulty: filters.difficulty }),
        ...(filters.minRating && { minRating: filters.minRating }),
        ...(filters.verifiedOnly && { verifiedOnly: true }),
      };

      const res = await getRecipesApi(params);
      setRecipes(res.data.data.recipes);
      setTotalPages(res.data.data.pagination.pages);
      setTotalCount(res.data.data.pagination.total);
    } catch {
      // error handled by axios interceptor
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  useEffect(() => {
    if (isAuthenticated) {
      getBookmarksApi()
        .then(res => {
          const ids = res.data.data.bookmarks
            .filter(b => b.recipe)
            .map(b => b.recipe._id);
          setBookmarkedIds(new Set(ids));
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <Layout>
      <div className="page-enter">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-6">
          <div className="editorial-label mb-2">Browse all</div>
          <div className="flex items-baseline gap-3">
            <h1 className="font-heading text-5xl">Recipes</h1>
            <span className="text-gray-400 text-sm">{totalCount} recipes</span>
          </div>
        </div>

        {/* Filter bar */}
        <RecipeFilter
          filters={filters}
          onChange={handleFilterChange}
        />

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white border border-linen rounded-xl overflow-hidden h-[360px] animate-pulse">
                     <div className="h-44 bg-warm1"></div>
                     <div className="p-5">
                       <div className="h-3 w-1/3 bg-linen rounded mb-4"></div>
                       <div className="h-5 w-3/4 bg-linen rounded mb-3"></div>
                       <div className="h-5 w-1/2 bg-linen rounded mb-6"></div>
                       <div className="border-t border-linen mb-3"></div>
                       <div className="h-4 w-full bg-linen rounded"></div>
                     </div>
                  </div>
               ))}
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-20">
              <div className="font-heading text-6xl text-linen mb-3">—</div>
              <h3 className="font-heading text-xl">No recipes found</h3>
              <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">
                No recipes match your current filters. Try adjusting your search criteria.
              </p>
              <button 
                onClick={() => handleFilterChange({search: '', authorSearch: '', category: '', difficulty: '', minRating: '', verifiedOnly: false})}
                className="inline-block mt-6 bg-paprika text-white text-sm font-medium
                  px-5 py-2.5 rounded-lg hover:bg-red-800 transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recipes.map((recipe, idx) => (
                  <RecipeCard
                    key={recipe._id}
                    recipe={recipe}
                    index={idx}
                    isBookmarked={bookmarkedIds.has(recipe._id)}
                    onBookmarkToggle={(id, isBookmarked) => {
                      setBookmarkedIds(prev => {
                        const newSet = new Set(prev);
                        if (isBookmarked) newSet.add(id);
                        else newSet.delete(id);
                        return newSet;
                      });
                    }}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-linen">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="border border-linen text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-parchment disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                      .map((p, idx, arr) => (
                        <span key={p} className="contents">
                          {idx > 0 && arr[idx - 1] !== p - 1 && (
                            <span key={`dots-${p}`} className="px-2 text-gray-400">...</span>
                          )}
                          <button
                            onClick={() => setPage(p)}
                            className={`w-10 h-10 rounded-lg text-sm transition-colors ${page === p ? 'bg-paprika text-white' : 'text-gray-700 hover:bg-parchment'}`}
                          >
                            {p}
                          </button>
                        </span>
                      ))
                    }
                  </div>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="border border-linen text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-parchment disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RecipesPage;