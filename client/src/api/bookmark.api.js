import api from './axios';

export const getBookmarksApi = () => api.get('/bookmarks');
export const toggleBookmarkApi = (recipeId) =>
  api.post('/bookmarks', { recipeId });
export const checkBookmarkApi = (recipeId) =>
  api.get(`/bookmarks/check/${recipeId}`);