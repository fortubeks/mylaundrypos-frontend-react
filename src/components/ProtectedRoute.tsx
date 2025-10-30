import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Redirect to signin if not authenticated
    if (!isAuthenticated || !token) {
      navigate('/signin');
    }
  }, [isAuthenticated, token, navigate]);

  // Show nothing while checking authentication
  if (!isAuthenticated || !token) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

