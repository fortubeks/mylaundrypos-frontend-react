import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (isAuthenticated && token) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, token, navigate]);

  // Show the public page if not authenticated
  if (isAuthenticated && token) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
};

export default PublicRoute;

