//PrivateRoutes
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, role }) {
  const token = localStorage.getItem('token');
  const userTipo = localStorage.getItem('userTipo');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role && userTipo !== role) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;