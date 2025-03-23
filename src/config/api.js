import axios from 'axios';
import SERVER_CONFIG, { checkDatabaseConnection } from './server.js';

const api = axios.create({
  baseURL: `http://localhost:${SERVER_CONFIG.port}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const apiEndpoints = {
  messages: '/messages',
  memories: '/memories',
  backgrounds: '/backgrounds'
};

// Add request interceptor for database connection check
api.interceptors.request.use(async (config) => {
  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    throw new Error('Database connection failed. Please check MongoDB connection.');
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export const uploadFormData = async (endpoint, formData) => {
  try {
    const response = await api.post(endpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
