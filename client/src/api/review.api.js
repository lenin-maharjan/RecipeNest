import api from './axios';

export const getReviewsApi = (recipeId) => api.get(`/reviews/${recipeId}`);
export const getReviewCountApi = () => api.get('/reviews/count');
export const getMyReviewCountApi = () => api.get('/reviews/my-count');
export const getMyRecipeReviewCountApi = () => api.get('/reviews/my-recipe-count');
export const createReviewApi = (data) => api.post('/reviews', data);
export const deleteReviewApi = (id) => api.delete(`/reviews/${id}`);