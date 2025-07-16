import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Label, Card, CardContent, CardDescription, CardHeader, CardTitle, Alert, AlertDescription } from '../components/ui-components';
import { Shield, Lock, User } from 'lucide-react';
import { adminAuthAPI } from '../api/admin';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await adminAuthAPI.login(formData);
      
      if (response.success) {
        localStorage.setItem('adminToken', response.token);
        localStorage.setItem('isAdminAuthenticated', 'true');
        toast.success('Admin login successful!');
        navigate('/dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen admin-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="admin-card admin-login-card p-8">
          <div className="text-center pb-6">
            <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold admin-text-gradient mb-2">
              Admin Panel
            </h1>
            <p className="text-gray-600 text-lg">
              Sign in to manage Excel Analytics platform
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700 block">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="admin-input pl-12"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="admin-input pl-12"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="admin-button w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <strong>Demo credentials:</strong> admin@demo.com / admin123
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center text-white">
          <p className="text-sm opacity-90 font-medium">
            © 2025 Excel Analytics. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
