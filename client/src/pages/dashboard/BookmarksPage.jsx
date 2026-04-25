import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../../components/common/Layout';
import RecipeCard from '../../components/recipe/RecipeCard';
import { getBookmarksApi } from '../../api/bookmark.api';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await getBookmarksApi();
        setBookmarks(res.data.data.bookmarks);
      } catch { toast.error('Failed to load bookmarks'); } finally { setLoading(false); }
    };
    fetchBookmarks();
  }, []);

  const handleBookmarkToggle = (recipeId, bookmarked) => {
    if (!bookmarked) setBookmarks(prev => prev.filter(b => b.recipe._id !== recipeId));
  };

  if (loading) return <Layout><div className="flex justify-center items-center py-20"><span className="inline-block w-5 h-5 border-2 border-paprika border-t-transparent rounded-full animate-spin" /></div></Layout>;

  return (
    <Layout>
      <div className="page-enter">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-6">
          <div className="editorial-label mb-2">Your collection</div>
          <div className="flex items-baseline gap-3">
            <h1 className="font-heading text-5xl">Bookmarks</h1>
            <span className="text-gray-400 text-sm">{bookmarks.length} saved</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-10">
          {bookmarks.length === 0 ? (
            <div className="text-center py-20">
              <div className="font-heading text-6xl text-linen mb-3">—</div>
              <h3 className="font-heading text-xl">No bookmarks yet</h3>
              <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">Save recipes you love to find them easily later.</p>
              <Link to="/recipes" className="inline-block mt-6 bg-paprika text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-red-800 transition-colors">Browse recipes</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bookmarks.map((bm, i) => (
                <RecipeCard key={bm._id} recipe={bm.recipe} index={i} isBookmarked={true} onBookmarkToggle={handleBookmarkToggle} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BookmarksPage;