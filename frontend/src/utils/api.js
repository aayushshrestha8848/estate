import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const loginTime = localStorage.getItem('loginTime');
    
    if (token && loginTime) {
      const now = new Date().getTime();
      const diff = now - parseInt(loginTime, 10);
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
      
      if (diff > TWENTY_FOUR_HOURS) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('loginTime');
        window.location.href = '/login';
        return Promise.reject('Session expired');
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
