import api from './api';

export const getCases = async () => {
  const { data } = await api.get('/cases');
  return data;
};

export const createCase = async (payload) => {
  const { data } = await api.post('/cases', payload);
  return data;
};

export const updateCase = async (id, payload) => {
  const { data } = await api.put(`/cases/${id}`, payload);
  return data;
};

export const deleteCase = async (id) => {
  const { data } = await api.delete(`/cases/${id}`);
  return data;
};
