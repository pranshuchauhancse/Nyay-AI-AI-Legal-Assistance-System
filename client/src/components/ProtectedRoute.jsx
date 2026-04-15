import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getRoleHome } from '../utils/helpers';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getRoleHome(user?.role)} replace />;
  }

  return children;
}
