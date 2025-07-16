import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { adminAuthAPI } from '../api/admin';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      const authStatus = localStorage.getItem('isAdminAuthenticated');
      
      if (!token || !authStatus) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        await adminAuthAPI.verifyToken();
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('isAdminAuthenticated');
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-admin-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-admin-600"></div>
          <p className="text-admin-700 font-medium">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default ProtectedRoute;
