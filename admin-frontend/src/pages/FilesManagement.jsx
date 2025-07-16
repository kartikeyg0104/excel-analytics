import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Input,
  Badge,
  Alert,
  AlertDescription
} from '../components/ui-components';
import { 
  Search, 
  FileText, 
  Trash2, 
  Download, 
  RefreshCw,
  Upload,
  User
} from 'lucide-react';
import { filesAPI } from '../api/admin';
import { toast } from 'sonner';
import { format } from 'date-fns';

const FilesManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchUserId, setSearchUserId] = useState('');
  const queryClient = useQueryClient();
  
  const { data: filesData, isLoading, error, refetch } = useQuery({
    queryKey: ['files', currentPage, searchUserId],
    queryFn: () => filesAPI.getAllFiles(currentPage, 10, searchUserId || null),
    keepPreviousData: true,
    onError: (error) => {
      console.error('Files fetch error:', error);
      toast.error('Failed to load files data');
    }
  });

  const { data: statsData } = useQuery({
    queryKey: ['files-stats'],
    queryFn: filesAPI.getFileStats,
    onError: (error) => {
      console.error('Files stats fetch error:', error);
    }
  });

  const deleteFileMutation = useMutation({
    mutationFn: filesAPI.deleteFile,
    onSuccess: () => {
      toast.success('File deleted successfully');
      queryClient.invalidateQueries(['files']);
      queryClient.invalidateQueries(['files-stats']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete file');
    }
  });

  const handleDeleteFile = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      deleteFileMutation.mutate(fileId);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };

  const files = filesData?.data?.files || [];
  const totalPages = filesData?.data?.totalPages || 1;
  const totalFiles = filesData?.data?.totalFiles || 0;
  const stats = statsData?.data || {};

  if (error) {
    return (
      <Layout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Files Management</h1>
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load files data. Please try again later.
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
            <h1 className="text-3xl font-bold text-gray-900">Files Management</h1>
            <p className="text-gray-600 mt-1">
              Monitor and manage uploaded files
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
                Total Files
              </CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalFiles?.toLocaleString() || totalFiles.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                All uploaded files
              </p>
            </CardContent>
          </Card>

          <Card className="admin-stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Storage Used
              </CardTitle>
              <Upload className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalSize ? `${(stats.totalSize / (1024 * 1024)).toFixed(1)} MB` : '0 MB'}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Total storage used
              </p>
            </CardContent>
          </Card>

          <Card className="admin-stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                This Month
              </CardTitle>
              <FileText className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.filesThisMonth || '0'}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Uploaded this month
              </p>
            </CardContent>
          </Card>

          <Card className="admin-stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg per User
              </CardTitle>
              <User className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.avgFilesPerUser?.toFixed(1) || '0.0'}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Files per user
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Search Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by User ID..."
                  value={searchUserId}
                  onChange={(e) => setSearchUserId(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" variant="admin">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Files Table */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Files List
            </CardTitle>
            <CardDescription>
              {totalFiles} total files found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex space-x-4 animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No files found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {files.map((file) => (
                      <TableRow key={file._id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <div className="font-medium text-gray-900">
                                {file.filename || 'Unknown File'}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {file._id.slice(-8)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">
                            {file.userId?.email || 'Unknown User'}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {file.userId?._id?.slice(-8) || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">
                            {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Unknown'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {file.mimetype || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">
                            {format(new Date(file.createdAt), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(file.createdAt), 'HH:mm')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="success">Active</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                toast.info('Download feature - coming soon');
                              }}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteFile(file._id)}
                              disabled={deleteFileMutation.isLoading}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
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

export default FilesManagement;
