import axios from 'axios';

const api = axios.create({
  /**
   * Esta é a rota da sua API que definimos no NestJS.
   * O Back-end roda na 3000 com o prefixo api/v1.
   */
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Este interceptor é o que garante que, após o login,
 * o Token JWT seja enviado automaticamente em todas as requisições.
 */
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;