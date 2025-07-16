import { useState, useEffect } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Alert,
  AlertDescription
} from '../components/ui-components';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  Mail, 
  Calendar,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import { usersAPI } from '../api/admin';
import { toast } from 'sonner';
import { format } from 'date-fns';

const UsersManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const queryClient = useQueryClient();
  
  const { data: usersData, isLoading, error, refetch } = useQuery({
    queryKey: ['users', currentPage, searchTerm],
    queryFn: () => usersAPI.getAllUsers(currentPage, 10, searchTerm),
    keepPreviousData: true,
    onError: (error) => {
      console.error('Users fetch error:', error);
      toast.error('Failed to load users data');
    }
  });

  const { data: statsData } = useQuery({
    queryKey: ['user-stats'],
    queryFn: usersAPI.getUserStats,
    onError: (error) => {
      console.error('User stats fetch error:', error);
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: usersAPI.deleteUser,
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['user-stats']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  });

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };

  const users = usersData?.data?.users || [];
  const totalPages = usersData?.data?.totalPages || 1;
  const totalUsers = usersData?.data?.totalUsers || 0;
  const stats = statsData?.data || {};

  if (error) {
    return (
      <Layout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load users data. Please try again later.
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
            <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
            <p className="text-gray-600 mt-1">
              Manage user accounts and permissions
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="admin" onClick={() => setIsAddUserModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="admin-stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Users
              </CardTitle>
              <User className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalUsers?.toLocaleString() || totalUsers.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                +{stats.newUsersThisMonth || 0} this month
              </p>
            </CardContent>
          </Card>

          <Card className="admin-stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Users
              </CardTitle>
              <User className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.activeUsers?.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Last 30 days
              </p>
            </CardContent>
          </Card>

          <Card className="admin-stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                New Today
              </CardTitle>
              <Plus className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.newUsersToday || '0'}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Registrations today
              </p>
            </CardContent>
          </Card>

          <Card className="admin-stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Files/User
              </CardTitle>
              <Mail className="h-4 w-4 text-orange-600" />
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
              Search Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Users Table */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Users List
            </CardTitle>
            <CardDescription>
              {totalUsers} total users found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex space-x-4 animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Files</TableHead>
                      <TableHead>Analytics</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {user.firstName && user.lastName 
                                  ? `${user.firstName} ${user.lastName}`
                                  : 'No Name'
                                }
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {user._id.slice(-8)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {user.files?.length || 0} files
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {user.analytics?.length || 0} analytics
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">
                            {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(user.createdAt), 'HH:mm')}
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
                              onClick={() => setSelectedUser(user)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(user._id)}
                              disabled={deleteUserMutation.isLoading}
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

        {/* Add User Modal */}
        {isAddUserModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Add New User</CardTitle>
                <CardDescription>
                  Create a new user account with the information below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter full name"
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">
                    Role
                  </label>
                  <Select value={newUserForm.role} onValueChange={(value) => setNewUserForm(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setIsAddUserModalOpen(false);
                      setNewUserForm({ name: '', email: '', password: '', role: 'user' });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="admin" 
                    className="flex-1"
                    onClick={() => {
                      // For demo purposes, just show success and close modal
                      toast.success('User added successfully! (Demo mode)');
                      setIsAddUserModalOpen(false);
                      setNewUserForm({ name: '', email: '', password: '', role: 'user' });
                      refetch(); // Refresh the users list
                    }}
                    disabled={!newUserForm.name || !newUserForm.email || !newUserForm.password}
                  >
                    Add User
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UsersManagement;
