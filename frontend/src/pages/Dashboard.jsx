import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui-components';
import { Button } from './ui-components';
import { Badge } from './ui-components';
import { FileSpreadsheet, Upload, BarChart3, User, LogOut, Plus, FileText, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import FileUpload from './FileUpload';

const Dashboard = () => {
  const [user, setUser] = useState({
    token: '',
    isAuthenticated: false
  });
  const [uploadedData, setUploadedData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [activeView, setActiveView] = useState('upload');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (!token || !isAuthenticated) {
      navigate('/login');
      return;
    }

    setUser({ token, isAuthenticated });
  }, [navigate]);

  const handleFileUpload = (data, name) => {
    setUploadedData(data);
    setFileName(name);
    setActiveView('preview');
    toast.success(`Successfully uploaded ${name}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (!user.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <FileSpreadsheet className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-sm text-slate-600">Welcome back, {user.name}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <User className="h-3 w-3 mr-1" />
                {user.email}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-lg p-1 shadow-sm">
            {[
              { id: 'upload', name: 'Upload', icon: Upload },
              { id: 'preview', name: 'Preview', icon: FileText, disabled: !uploadedData },
              { id: 'charts', name: 'Charts', icon: BarChart3, disabled: !uploadedData },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                disabled={tab.disabled}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${activeView === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : tab.disabled
                    ? 'text-slate-400 cursor-not-allowed'
                    : 'text-slate-600 hover:bg-white/80 hover:text-slate-800'
                  }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          {activeView === 'upload' && (
            <div>
              <div className="text-center py-8">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-full w-20 h-20 mx-auto mb-6 shadow-lg">
                  <FileSpreadsheet className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">
                  Upload Your Data
                </h2>
                <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                  Upload your Excel or CSV file to get started with data analysis and visualization.
                </p>
              </div>

              <FileUpload onFileUpload={handleFileUpload} />

              {/* Recent Files */}
              {uploadedData && (
                <div className="mt-8">
                  <Card className="bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5" />
                        <span>Current File</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-500 p-2 rounded-full">
                            <FileText className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-green-800">{fileName}</h3>
                            <p className="text-sm text-green-600">
                              {uploadedData.rowCount} rows, {uploadedData.columnCount} columns
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => setActiveView('preview')}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          <Button
                            onClick={() => navigate('/charts', { state: { data: uploadedData, fileName } })}
                            variant="outline"
                            className="border-green-300 text-green-700 hover:bg-green-50"
                          >
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Create Charts
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {activeView === 'preview' && uploadedData && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-800">Data Preview</h2>
                <Badge variant="outline" className="bg-blue-100 text-blue-700">
                  {fileName}
                </Badge>
              </div>
              <Card className="bg-white/60 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Data Loaded Successfully</h3>
                    <p className="text-slate-600 mb-4">
                      {uploadedData.rowCount} rows, {uploadedData.columnCount} columns
                    </p>
                    <div className="flex space-x-4 justify-center">
                      <Button onClick={() => navigate('/data-analysis', { state: { data: uploadedData, fileName } })}>
                        Analyze Data
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate('/charts', { state: { data: uploadedData, fileName } })}
                      >
                        Create Charts
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeView === 'charts' && uploadedData && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Create Charts</h2>
              <Card className="bg-white/70 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BarChart3 className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Chart Studio</h3>
                  <p className="text-slate-600 mb-6">Create beautiful charts and visualizations from your data.</p>
                  <Button onClick={() => navigate('/charts', { state: { data: uploadedData, fileName } })}>
                    <Plus className="h-4 w-4 mr-2" />
                    Open Chart Studio
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
