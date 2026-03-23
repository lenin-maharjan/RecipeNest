import api from './axios';

export const getAdminStatsApi = () => api.get('/admin/stats');
export const getAllUsersApi = (params) => api.get('/admin/users', { params });
export const toggleVerifyChefApi = (id) =>
  api.put(`/admin/users/${id}/verify`);
export const changeUserRoleApi = (id, role) =>
  api.put(`/admin/users/${id}/role`, { role });
export const deleteUserApi = (id) => api.delete(`/admin/users/${id}`);
export const getAllRecipesAdminApi = (params) =>
  api.get('/admin/recipes', { params });
export const togglePublishRecipeApi = (id) =>
  api.put(`/admin/recipes/${id}/publish`);
export const deleteRecipeAdminApi = (id) =>
  api.delete(`/admin/recipes/${id}`);