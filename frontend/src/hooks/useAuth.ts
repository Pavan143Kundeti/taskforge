import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const useAuth = (requireAuth = true) => {
  const { isAuthenticated, initAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      navigate('/login');
    } else if (!requireAuth && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, requireAuth, navigate]);

  return { isAuthenticated };
};
