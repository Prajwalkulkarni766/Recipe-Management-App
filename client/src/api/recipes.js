import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export async function getRecipes(params) {
  const response = await api.get('/recipes', { params });
  return response.data;
}

export async function getRecipe(id) {
  const response = await api.get(`/recipes/${id}`);
  return response.data.data;
}

export async function getRecipeByName(name) {
  const response = await api.get(`/recipes/${name}`);
  return response.data.data;
}

export async function createRecipe(formData) {
  const response = await api.post('/recipes', formData);
  return response.data;
}

export async function updateRecipe(id, formData) {
  const response = await api.put(`/recipes/${id}`, formData);
  return response.data;
}

export async function deleteRecipe(id) {
  const response = await api.delete(`/recipes/${id}`);
  return response.data;
}

export function getErrorMessage(error) {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.request) return 'Could not reach the server. Please check that the API is running.';
  return 'Something went wrong. Please try again.';
}
