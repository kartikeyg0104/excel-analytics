import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  Button,
  Badge,
  Alert,
  AlertDescription
} from '../components/ui-components';
import { 
  Activity, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info,
  XCircle
} from 'lucide-react';
import { systemAPI } from '../api/admin';
import { toast } from 'sonner';
import { format } from 'date-fns';

const SystemLogs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: logsData, isLoading, error, refetch } = useQuery({
    queryKey: ['activity-logs', currentPage],
    queryFn: () => systemAPI.getActivityLogs(currentPage, 20),
    keepPreviousData: true,
    onError: (error) => {
      console.error('Logs fetch error:', error);
      toast.error('Failed to load system logs');
    }
  });

  const getLogIcon = (level) => {
    switch (level) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getLogBadgeVariant = (level) => {
    switch (level) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      default:
        return 'secondary';
    }
  };

  // Mock data for demonstration
  const mockLogs = [
    {
      _id: '1',
      timestamp: new Date(),
      level: 'info',
      action: 'User Login',
      details: 'User admin@demo.com logged in successfully',
      userId: 'admin',
      ipAddress: '192.168.1.1'
    },
    {
      _id: '2',
      timestamp: new Date(Date.now() - 300000),
      level: 'success',
      action: 'File Upload',
      details: 'File data.xlsx uploaded by user@demo.com',
      userId: 'user123',
      ipAddress: '192.168.1.2'
    },
    {
      _id: '3',
      timestamp: new Date(Date.now() - 600000),
      level: 'warning',
      action: 'High Memory Usage',
      details: 'System memory usage exceeded 80%',
      userId: 'system',
      ipAddress: 'localhost'
    },
    {
      _id: '4',
      timestamp: new Date(Date.now() - 900000),
      level: 'error',
      action: 'Database Connection',
      details: 'Failed to connect to database - retrying',
      userId: 'system',
      ipAddress: 'localhost'
    },
    {
      _id: '5',
      timestamp: new Date(Date.now() - 1200000),
      level: 'info',
      action: 'Analytics Generated',
      details: 'Analytics report generated for file report.csv',
      userId: 'user456',
      ipAddress: '192.168.1.3'
    }
  ];

  const logs = logsData?.data?.logs || mockLogs;
  const totalPages = logsData?.data?.totalPages || 1;
  const totalLogs = logsData?.data?.totalLogs || mockLogs.length;

  if (error) {
    return (
      <Layout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load system logs. Showing mock data for demonstration.
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
            <p className="text-gray-600 mt-1">
              Monitor system activity and events
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="admin-stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Logs
              </CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {totalLogs.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                All recorded events
              </p>
            </CardContent>
          </Card>

          <Card className="admin-stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Errors Today
              </CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {logs.filter(log => log.level === 'error').length}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Error events today
              </p>
            </CardContent>
          </Card>

          <Card className="admin-stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Warnings
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {logs.filter(log => log.level === 'warning').length}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Warning events
              </p>
            </CardContent>
          </Card>

          <Card className="admin-stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Success Rate
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {((logs.filter(log => log.level === 'success' || log.level === 'info').length / logs.length) * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Successful operations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Logs Table */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest system events and activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex space-x-4 animate-pulse">
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No logs found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Level</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log._id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getLogIcon(log.level)}
                            <Badge variant={getLogBadgeVariant(log.level)}>
                              {log.level.toUpperCase()}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-gray-900">
                            {log.action}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-700 max-w-md">
                            {log.details}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">
                            {log.userId || 'System'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500 font-mono">
                            {log.ipAddress}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">
                            {format(new Date(log.timestamp), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(log.timestamp), 'HH:mm:ss')}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SystemLogs;
