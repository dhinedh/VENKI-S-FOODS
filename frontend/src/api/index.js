import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products
export const fetchProducts = () => api.get('/products');
export const fetchProductById = (id) => api.get(`/products/${id}`);

// Admin Product CRUD
export const createProduct = (formData) => api.post('/admin/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateProduct = (id, formData) => api.patch(`/admin/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteProduct = (id) => api.delete(`/admin/products/${id}`);


// Auth
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const logoutUser = () => api.post('/auth/logout');

// Orders
export const placeOrder = (orderData) => api.post('/orders', orderData);
export const fetchUserOrders = (userId) => api.get(`/orders/user/${userId}`);
export const fetchOrderById = (id) => api.get(`/orders/${id}`);
export const fetchAllOrders = () => api.get('/orders');
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, { status });

export default api;
