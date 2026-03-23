import api from './axios';

export const getUserProfileApi = (id) => api.get(`/users/${id}`);
export const updateProfileApi = (data) => api.put('/users/profile', data);
export const changePasswordApi = (data) =>
  api.put('/users/change-password', data);