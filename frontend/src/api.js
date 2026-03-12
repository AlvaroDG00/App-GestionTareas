import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000' // Servidor de Node.js
});

// Este interceptor pega el Token automáticamente en cada petición que se haga
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default api;