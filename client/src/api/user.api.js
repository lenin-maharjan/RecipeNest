import api from './axios';

export const getChefsApi = (params) => api.get('/users/chefs', { params });
export const getUserProfileApi = (id) => api.get(`/users/${id}`);
export const updateProfileApi = (data) => api.put('/users/profile', data);
export const changePasswordApi = (data) =>
  api.put('/users/change-password', data);