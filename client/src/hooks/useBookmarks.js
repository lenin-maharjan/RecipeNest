import { useState, useEffect } from 'react';
import { getBookmarksApi, toggleBookmarkApi } from '../api/bookmark.api';
import toast from 'react-hot-toast';

const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedRecipeIds, setBookmarkedRecipeIds] = useState(new Set());

  // fetch all bookmarks
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await getBookmarksApi();
        const bookmarksList = res.data.data.bookmarks;
        setBookmarks(bookmarksList);

        // create a set of bookmarked recipe IDs for quick lookup
        const ids = new Set(bookmarksList.map((b) => b.recipe._id));
        setBookmarkedRecipeIds(ids);
      } catch {
        toast.error('Failed to load bookmarks');
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  // toggle bookmark for a recipe
  const toggleBookmark = async (recipeId) => {
    try {
      const res = await toggleBookmarkApi(recipeId);
      const { bookmarked } = res.data.data;

      if (bookmarked) {
        // add to bookmarks
        const newBookmark = {
          _id: res.data.data._id,
          recipe: { _id: recipeId },
        };
        setBookmarks((prev) => [...prev, newBookmark]);
        setBookmarkedRecipeIds((prev) => new Set([...prev, recipeId]));
        toast.success('Bookmarked!');
      } else {
        // remove from bookmarks
        setBookmarks((prev) =>
          prev.filter((b) => b.recipe._id !== recipeId)
        );
        setBookmarkedRecipeIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(recipeId);
          return newSet;
        });
        toast.success('Bookmark removed');
      }

      return bookmarked;
    } catch (error) {
      toast.error('Failed to update bookmark');
      return null;
    }
  };

  // check if a recipe is bookmarked
  const isBookmarked = (recipeId) => {
    return bookmarkedRecipeIds.has(recipeId);
  };

  return {
    bookmarks,
    loading,
    toggleBookmark,
    isBookmarked,
  };
};

export default useBookmarks;
