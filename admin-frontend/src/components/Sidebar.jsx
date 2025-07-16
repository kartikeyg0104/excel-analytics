import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui-components';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  FileText, 
  Settings, 
  LogOut, 
  User,
  Activity,
  Menu,
  X
} from 'lucide-react';
import { adminAuthAPI } from '../api/admin';
import { toast } from 'sonner';

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      active: location.pathname === '/' || location.pathname === '/dashboard'
    },
    {
      label: 'Users Management',
      icon: Users,
      path: '/users',
      active: location.pathname === '/users'
    },
    {
      label: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
      active: location.pathname === '/analytics'
    },
    {
      label: 'Files',
      icon: FileText,
      path: '/files',
      active: location.pathname === '/files'
    },
    {
      label: 'System Logs',
      icon: Activity,
      path: '/logs',
      active: location.pathname === '/logs'
    },
    {
      label: 'Profile',
      icon: User,
      path: '/profile',
      active: location.pathname === '/profile'
    }
  ];

  const handleLogout = async () => {
    try {
      await adminAuthAPI.logout();
      toast.success('Logged out successfully');
      navigate('/admin-login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  const handleMenuItemClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className={`admin-sidebar text-white transition-all duration-300 ${
      isMobile 
        ? `fixed inset-y-0 left-0 z-50 w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
        : `${isCollapsed ? 'w-16' : 'w-64'} relative`
    } min-h-screen flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-blue-400/20">
        <div className="flex items-center justify-between">
          {(!isCollapsed || isMobile) && (
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-blue-200 text-sm">Excel Analytics</p>
            </div>
          )}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-white hover:bg-blue-600/20"
            >
              {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </Button>
          )}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-blue-600/20"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={handleMenuItemClick}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    item.active 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-blue-100 hover:bg-blue-600/20 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {(!isCollapsed || isMobile) && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-400/20">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={`w-full text-blue-100 hover:bg-red-600/20 hover:text-white ${
            (isCollapsed && !isMobile) ? 'px-0' : 'justify-start'
          }`}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {(!isCollapsed || isMobile) && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
