import { useEffect, useState, useCallback } from 'react';
import Layout from '../../components/common/Layout';
import ChefCard from '../../components/chef/ChefCard';
import { getChefsApi } from '../../api/user.api';

const ChefsPage = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchChefs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getChefsApi({
        page,
        limit: 12,
        ...(search && { search }),
        ...(verifiedOnly && { verifiedOnly: true }),
      });

      setChefs(res.data.data.chefs || []);
      setTotalPages(res.data.data.pagination?.pages || 1);
      setTotalCount(res.data.data.pagination?.total || 0);
    } catch {
      setChefs([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, search, verifiedOnly]);

  useEffect(() => {
    fetchChefs();
  }, [fetchChefs]);

  return (
    <Layout>
      <div className="page-enter">
        <section className="bg-parchment relative overflow-hidden py-14 md:py-16 border-b border-linen">
          <div className="absolute -top-20 -right-10 w-72 h-72 rounded-full bg-peach opacity-60 pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-52 h-52 rounded-full bg-warm1 opacity-40 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="editorial-label mb-2">Meet the creators</div>
            <div className="flex items-end gap-3 flex-wrap">
              <h1 className="font-heading text-5xl md:text-6xl leading-tight">Chefs</h1>
              <span className="text-gray-400 text-sm pb-2">{totalCount} profiles</span>
            </div>
            <p className="text-gray-500 text-base max-w-xl mt-4 leading-relaxed">
              Explore culinary voices behind RecipeNest. Find verified professionals,
              review their stats, and open their full profile in one click.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 pt-8 pb-2">
          <div className="bg-white border border-linen rounded-xl p-4 sm:p-5 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search chefs by name..."
              className="w-full md:max-w-sm border border-linen rounded-lg px-3 py-2.5 text-sm bg-parchment/50 focus:outline-none focus:ring-2 focus:ring-paprika/30"
            />
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => {
                    setVerifiedOnly(e.target.checked);
                    setPage(1);
                  }}
                  className="w-4 h-4 rounded border-linen text-paprika focus:ring-paprika/40"
                />
                Verified chefs only
              </label>
              {(search || verifiedOnly) && (
                <button
                  onClick={() => {
                    setSearch('');
                    setVerifiedOnly(false);
                    setPage(1);
                  }}
                  className="text-sm text-paprika hover:underline underline-offset-4"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-[360px] bg-white border border-linen rounded-xl overflow-hidden animate-pulse">
                  <div className="h-24 bg-warm2" />
                  <div className="p-5">
                    <div className="h-4 w-2/3 bg-linen rounded mb-3" />
                    <div className="h-3 w-1/3 bg-linen rounded mb-4" />
                    <div className="h-3 w-full bg-linen rounded mb-2" />
                    <div className="h-3 w-4/5 bg-linen rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : chefs.length === 0 ? (
            <div className="text-center py-20">
              <div className="font-heading text-6xl text-linen mb-3">-</div>
              <h3 className="font-heading text-xl">No chefs found</h3>
              <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">
                Try changing your search or remove the verified-only filter.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {chefs.map((chef) => (
                  <ChefCard key={chef._id} chef={chef} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-linen">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="border border-linen text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-parchment disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Prev
                  </button>
                  <div className="text-sm text-gray-600 px-2 min-w-[120px] text-center">
                    Page {page} of {totalPages}
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

export default ChefsPage;
