import { Navigate } from 'react-router-dom';
import { getAuthToken, getAuthUser } from '../utils/auth';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = getAuthToken();
  const user = getAuthUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
