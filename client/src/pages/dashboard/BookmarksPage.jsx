// const BookmarksPage = () => <div>Bookmarks</div>;
// export default BookmarksPage;

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Layout from '../../components/common/Layout';
import RecipeCard from '../../components/recipe/RecipeCard';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { getBookmarksApi } from '../../api/bookmark.api';
import { Link } from 'react-router-dom';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await getBookmarksApi();
        setBookmarks(res.data.data.bookmarks);
      } catch {
        toast.error('Failed to load bookmarks');
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  // when a bookmark is toggled off — remove from list
  const handleBookmarkToggle = (recipeId, bookmarked) => {
    if (!bookmarked) {
      setBookmarks((prev) =>
        prev.filter((b) => b.recipe._id !== recipeId)
      );
    }
  };

  if (loading) return <Spinner />;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bookmarks</h1>
          <p className="text-gray-500 mt-1">
            {bookmarks.length} saved recipe
            {bookmarks.length !== 1 ? 's' : ''}
          </p>
        </div>

        {bookmarks.length === 0 ? (
          <EmptyState
            title="No bookmarks yet"
            message="Save recipes you love to find them easily later"
            action={
              <Link to="/recipes">
                <Button>Browse Recipes</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2
                          lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bookmarks.map((bookmark) => (
              <RecipeCard
                key={bookmark._id}
                recipe={bookmark.recipe}
                onBookmarkToggle={handleBookmarkToggle}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookmarksPage;