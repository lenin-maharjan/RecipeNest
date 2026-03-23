import api from './axios';

export const getRecipesApi = (params) => api.get('/recipes', { params });
export const getRecipeByIdApi = (id) => api.get(`/recipes/${id}`);
export const getMyRecipesApi = () => api.get('/recipes/my');
export const createRecipeApi = (data) => api.post('/recipes', data);
export const updateRecipeApi = (id, data) => api.put(`/recipes/${id}`, data);
export const deleteRecipeApi = (id) => api.delete(`/recipes/${id}`);
export const uploadImageApi = (formData) =>
  api.post('/recipes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });