import api from './axios';

export const getReviewsApi = (recipeId) => api.get(`/reviews/${recipeId}`);
export const createReviewApi = (data) => api.post('/reviews', data);
export const deleteReviewApi = (id) => api.delete(`/reviews/${id}`);