import axios from 'axios';

// Base URL for the API - adjust this based on your backend configuration
const API_BASE_URL = 'http://localhost:3001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('isAdminAuthenticated');
      window.location.href = '/admin-login';
    }
    return Promise.reject(error);
  }
);

// Admin Authentication API
export const adminAuthAPI = {
  login: async (credentials) => {
    // Demo credentials for development
    const DEMO_CREDENTIALS = {
      email: 'admin@demo.com',
      password: 'admin123'
    };

    try {
      const response = await api.post('/api/admin/login', credentials);
      return response.data;
    } catch (error) {
      // If backend is not available, use demo authentication
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
        // Check demo credentials
        if (credentials.email === DEMO_CREDENTIALS.email &&
          credentials.password === DEMO_CREDENTIALS.password) {
          return {
            success: true,
            token: 'demo-admin-token-' + Date.now(),
            user: {
              id: 1,
              email: 'admin@demo.com',
              name: 'Demo Admin',
              role: 'admin'
            },
            message: 'Demo login successful'
          };
        } else {
          throw new Error('Invalid demo credentials');
        }
      }
      throw error;
    }
  },

  logout: async () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdminAuthenticated');
    return { success: true };
  },

  verifyToken: async () => {
    try {
      const response = await api.get('/api/admin/verify');
      return response.data;
    } catch (error) {
      // If backend is not available, check for demo token
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
        const token = localStorage.getItem('adminToken');
        if (token && token.startsWith('demo-admin-token-')) {
          return {
            success: true,
            user: {
              id: 1,
              email: 'admin@demo.com',
              name: 'Demo Admin',
              role: 'admin'
            }
          };
        }
      }
      throw error;
    }
  }
};

// Mock data for development
const MOCK_DATA = {
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', createdAt: '2025-01-01' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', createdAt: '2025-01-02' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'inactive', createdAt: '2025-01-03' },
  ],
  analytics: [
    { id: 1, title: 'Sales Report Q1', userId: 1, userName: 'John Doe', status: 'completed', createdAt: '2025-01-10' },
    { id: 2, title: 'Marketing Analysis', userId: 2, userName: 'Jane Smith', status: 'processing', createdAt: '2025-01-12' },
    { id: 3, title: 'Financial Overview', userId: 1, userName: 'John Doe', status: 'completed', createdAt: '2025-01-15' },
  ],
  files: [
    { id: 1, name: 'sales_data.xlsx', size: '2.5 MB', userId: 1, userName: 'John Doe', uploadedAt: '2025-01-10' },
    { id: 2, name: 'marketing_data.csv', size: '1.8 MB', userId: 2, userName: 'Jane Smith', uploadedAt: '2025-01-12' },
    { id: 3, name: 'financial_report.xlsx', size: '3.2 MB', userId: 1, userName: 'John Doe', uploadedAt: '2025-01-15' },
  ],
  stats: {
    users: { total: 156, active: 134, inactive: 22, growth: 12 },
    analytics: { total: 89, completed: 67, processing: 15, failed: 7, growth: 23 },
    files: { total: 234, totalSize: '156.7 MB', growth: 18 },
    system: { uptime: '15 days, 7 hours', cpu: 45, memory: 67, storage: 34 }
  },
  logs: [
    { id: 1, level: 'info', message: 'User john@example.com logged in', timestamp: '2025-01-16 10:30:00' },
    { id: 2, level: 'warning', message: 'High memory usage detected', timestamp: '2025-01-16 10:25:00' },
    { id: 3, level: 'error', message: 'Failed to process analytics for file ID 123', timestamp: '2025-01-16 10:20:00' },
    { id: 4, level: 'info', message: 'System backup completed successfully', timestamp: '2025-01-16 10:15:00' },
  ]
};

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to handle mock vs real API calls
const handleApiCall = async (apiCall, mockData) => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
      await delay(500); // Simulate network delay
      return mockData;
    }
    throw error;
  }
};

// Users Management API
export const usersAPI = {
  getAllUsers: async (page = 1, limit = 10, search = '') => {
    return handleApiCall(
      () => api.get(`/api/admin/users?page=${page}&limit=${limit}&search=${search}`),
      {
        success: true,
        data: MOCK_DATA.users.filter(user =>
          search ? user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) : true
        ),
        pagination: { page, limit, total: MOCK_DATA.users.length, pages: 1 }
      }
    );
  },

  getUserById: async (userId) => {
    return handleApiCall(
      () => api.get(`/api/admin/users/${userId}`),
      {
        success: true,
        data: MOCK_DATA.users.find(user => user.id === parseInt(userId)) || null
      }
    );
  },

  updateUser: async (userId, userData) => {
    return handleApiCall(
      () => api.put(`/api/admin/users/${userId}`, userData),
      {
        success: true,
        data: { ...MOCK_DATA.users.find(user => user.id === parseInt(userId)), ...userData },
        message: 'User updated successfully'
      }
    );
  },

  deleteUser: async (userId) => {
    return handleApiCall(
      () => api.delete(`/api/admin/users/${userId}`),
      {
        success: true,
        message: 'User deleted successfully'
      }
    );
  },

  getUserStats: async () => {
    return handleApiCall(
      () => api.get('/api/admin/users/stats'),
      {
        success: true,
        data: MOCK_DATA.stats.users
      }
    );
  }
};

// Analytics Management API
export const analyticsAPI = {
  getAllAnalytics: async (page = 1, limit = 10, userId = null) => {
    return handleApiCall(
      () => {
        let url = `/api/admin/analytics?page=${page}&limit=${limit}`;
        if (userId) url += `&userId=${userId}`;
        return api.get(url);
      },
      {
        success: true,
        data: MOCK_DATA.analytics.filter(analytics =>
          userId ? analytics.userId === parseInt(userId) : true
        ),
        pagination: { page, limit, total: MOCK_DATA.analytics.length, pages: 1 }
      }
    );
  },

  getAnalyticsById: async (analyticsId) => {
    return handleApiCall(
      () => api.get(`/api/admin/analytics/${analyticsId}`),
      {
        success: true,
        data: MOCK_DATA.analytics.find(analytics => analytics.id === parseInt(analyticsId)) || null
      }
    );
  },

  deleteAnalytics: async (analyticsId) => {
    return handleApiCall(
      () => api.delete(`/api/admin/analytics/${analyticsId}`),
      {
        success: true,
        message: 'Analytics deleted successfully'
      }
    );
  },

  getAnalyticsStats: async () => {
    return handleApiCall(
      () => api.get('/api/admin/analytics/stats'),
      {
        success: true,
        data: MOCK_DATA.stats.analytics
      }
    );
  }
};

// Files Management API
export const filesAPI = {
  getAllFiles: async (page = 1, limit = 10, userId = null) => {
    return handleApiCall(
      () => {
        let url = `/api/admin/files?page=${page}&limit=${limit}`;
        if (userId) url += `&userId=${userId}`;
        return api.get(url);
      },
      {
        success: true,
        data: MOCK_DATA.files.filter(file =>
          userId ? file.userId === parseInt(userId) : true
        ),
        pagination: { page, limit, total: MOCK_DATA.files.length, pages: 1 }
      }
    );
  },

  getFileById: async (fileId) => {
    return handleApiCall(
      () => api.get(`/api/admin/files/${fileId}`),
      {
        success: true,
        data: MOCK_DATA.files.find(file => file.id === parseInt(fileId)) || null
      }
    );
  },

  deleteFile: async (fileId) => {
    return handleApiCall(
      () => api.delete(`/api/admin/files/${fileId}`),
      {
        success: true,
        message: 'File deleted successfully'
      }
    );
  },

  getFileStats: async () => {
    return handleApiCall(
      () => api.get('/api/admin/files/stats'),
      {
        success: true,
        data: MOCK_DATA.stats.files
      }
    );
  }
};

// System Stats API
export const systemAPI = {
  getDashboardStats: async () => {
    return handleApiCall(
      () => api.get('/api/admin/dashboard/stats'),
      {
        success: true,
        data: {
          users: MOCK_DATA.stats.users,
          analytics: MOCK_DATA.stats.analytics,
          files: MOCK_DATA.stats.files,
          system: MOCK_DATA.stats.system
        }
      }
    );
  },

  getSystemHealth: async () => {
    return handleApiCall(
      () => api.get('/api/admin/system/health'),
      {
        success: true,
        data: MOCK_DATA.stats.system
      }
    );
  },

  getActivityLogs: async (page = 1, limit = 20) => {
    return handleApiCall(
      () => api.get(`/api/admin/activity-logs?page=${page}&limit=${limit}`),
      {
        success: true,
        data: MOCK_DATA.logs,
        pagination: { page, limit, total: MOCK_DATA.logs.length, pages: 1 }
      }
    );
  }
};

export default api;
