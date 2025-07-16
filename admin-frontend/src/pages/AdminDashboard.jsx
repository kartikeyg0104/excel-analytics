import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Progress } from '../components/ui-components';
import { Users, FileText, BarChart3, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { systemAPI } from '../api/admin';
import { toast } from 'sonner';

const StatsCard = ({ title, value, change, icon: Icon, trend, description }) => {
  const isPositive = trend === 'up';
  
  return (
    <Card className="admin-stats-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-blue-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {value}
        </div>
        <div className="flex items-center space-x-2">
          {change && (
            <div className={`flex items-center text-xs ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {change}
            </div>
          )}
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFiles: 0,
    totalAnalytics: 0,
    activeUsers: 0,
    systemHealth: 'good'
  });

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: systemAPI.getDashboardStats,
    refetchInterval: 30000, // Refetch every 30 seconds
    onError: (error) => {
      console.error('Dashboard data fetch error:', error);
      toast.error('Failed to load dashboard data');
    }
  });

  useEffect(() => {
    if (dashboardData?.data) {
      setStats(dashboardData.data);
    }
  }, [dashboardData]);

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Overview of Excel Analytics platform
            </p>
          </div>
          <Badge 
            variant={stats.systemHealth === 'good' ? 'success' : 'warning'}
            className="text-sm px-3 py-1 self-start sm:self-auto"
          >
            System {stats.systemHealth === 'good' ? 'Healthy' : 'Warning'}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers?.toLocaleString() || '0'}
            change="+12.5%"
            trend="up"
            icon={Users}
            description="from last month"
          />
          <StatsCard
            title="Files Uploaded"
            value={stats.totalFiles?.toLocaleString() || '0'}
            change="+8.2%"
            trend="up"
            icon={FileText}
            description="this month"
          />
          <StatsCard
            title="Analytics Generated"
            value={stats.totalAnalytics?.toLocaleString() || '0'}
            change="+15.3%"
            trend="up"
            icon={BarChart3}
            description="total analyses"
          />
          <StatsCard
            title="Active Users"
            value={stats.activeUsers?.toLocaleString() || '0'}
            change="-2.1%"
            trend="down"
            icon={Activity}
            description="last 24 hours"
          />
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Usage Overview */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Usage Overview
              </CardTitle>
              <CardDescription>
                Platform usage statistics for the current month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">File Uploads</span>
                  <span className="font-medium">
                    {((stats.totalFiles || 0) / 1000 * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={(stats.totalFiles || 0) / 1000 * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">User Registration</span>
                  <span className="font-medium">
                    {((stats.totalUsers || 0) / 500 * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={(stats.totalUsers || 0) / 500 * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Analytics Generated</span>
                  <span className="font-medium">
                    {((stats.totalAnalytics || 0) / 2000 * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={(stats.totalAnalytics || 0) / 2000 * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                System Status
              </CardTitle>
              <CardDescription>
                Current system health and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-800">Database</span>
                </div>
                <Badge variant="success" className="text-xs">Online</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-800">API Server</span>
                </div>
                <Badge variant="success" className="text-xs">Healthy</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-800">File Storage</span>
                </div>
                <Badge variant="admin" className="text-xs">75% Used</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-yellow-800">AI Service</span>
                </div>
                <Badge variant="warning" className="text-xs">Load: High</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common administrative tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <div 
                className="p-4 border rounded-lg hover:bg-gray-50 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => navigate('/users')}
              >
                <Users className="h-8 w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-200" />
                <h3 className="font-medium text-gray-900 group-hover:text-blue-700">Manage Users</h3>
                <p className="text-sm text-gray-600 mt-1">
                  View, edit, and manage user accounts
                </p>
              </div>
              
              <div 
                className="p-4 border rounded-lg hover:bg-gray-50 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => navigate('/files')}
              >
                <FileText className="h-8 w-8 text-green-600 mb-2 group-hover:scale-110 transition-transform duration-200" />
                <h3 className="font-medium text-gray-900 group-hover:text-green-700">File Management</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Monitor and manage uploaded files
                </p>
              </div>
              
              <div 
                className="p-4 border rounded-lg hover:bg-gray-50 hover:border-purple-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => navigate('/logs')}
              >
                <Activity className="h-8 w-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-200" />
                <h3 className="font-medium text-gray-900 group-hover:text-purple-700">System Logs</h3>
                <p className="text-sm text-gray-600 mt-1">
                  View system activity and logs
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
