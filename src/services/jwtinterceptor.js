import { useEffect } from 'react';
import AuthService from './AuthService';
import axios from 'axios';

const JWTInterceptor = () => {
  const auth = AuthService();

  useEffect(() => {
    axios.interceptors.request.use(
      async (config) => {
        const token = await auth.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );
  }, [auth.getAccessToken]);

  return null;
};

export default JWTInterceptor;
