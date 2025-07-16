import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui-components';
import { Button } from './ui-components';
import { Badge } from './ui-components';
import { FileSpreadsheet, Upload, BarChart3, User, LogOut, Plus, FileText, TrendingUp, Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '../hooks/use-mobile';
import FileUpload from './FileUpload';

const Dashboard = () => {
  const isMobile = useIsMobile();
  const [user, setUser] = useState({
    token: '',
    isAuthenticated: false
  });
  const [uploadedData, setUploadedData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [activeView, setActiveView] = useState('upload');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 md:p-3 rounded-xl shadow-lg">
                <FileSpreadsheet className="h-5 w-5 md:h-7 md:w-7 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
                  Dashboard
                </h1>
                <p className={`text-xs md:text-sm text-slate-600 truncate ${isMobile ? 'hidden' : ''}`}>Welcome back, {user.name}!</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            {!isMobile ? (
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
            ) : (
              /* Mobile Menu Button */
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
          </div>
          
          {/* Mobile Menu */}
          {isMobile && mobileMenuOpen && (
            <div className="mt-4 py-4 border-t border-slate-200 space-y-3 animate-in slide-in-from-top-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 w-full justify-center">
                <User className="h-3 w-3 mr-1" />
                {user.email}
              </Badge>
              <div className="flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/profile')}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Navigation Tabs */}
        <div className="mb-6 md:mb-8">
          <div className={`${isMobile 
            ? 'flex flex-col space-y-2' 
            : 'flex space-x-1'
          } bg-white/60 backdrop-blur-sm rounded-lg p-1 shadow-sm`}>
            {[
              { id: 'upload', name: 'Upload', icon: Upload },
              { id: 'preview', name: 'Preview', icon: FileText, disabled: !uploadedData },
              { id: 'charts', name: 'Charts', icon: BarChart3, disabled: !uploadedData },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                disabled={tab.disabled}
                className={`flex items-center ${isMobile ? 'justify-center' : ''} space-x-2 px-3 md:px-4 py-2 md:py-3 rounded-md transition-all ${activeView === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : tab.disabled
                    ? 'text-slate-400 cursor-not-allowed'
                    : 'text-slate-600 hover:bg-white/80 hover:text-slate-800'
                  }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="font-medium text-sm md:text-base">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-6 md:space-y-8">
          {activeView === 'upload' && (
            <div>
              <div className="text-center py-6 md:py-8">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 md:p-4 rounded-full w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 shadow-lg">
                  <FileSpreadsheet className="h-10 w-10 md:h-12 md:w-12 text-white" />
                </div>
                <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-3 md:mb-4 px-4">
                  Upload Your Data
                </h2>
                <p className="text-sm md:text-lg text-slate-600 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
                  Upload your Excel or CSV file to get started with data analysis and visualization.
                </p>
              </div>

              <FileUpload onFileUpload={handleFileUpload} />

              {/* Recent Files */}
              {uploadedData && (
                <div className="mt-6 md:mt-8">
                  <Card className="bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
                        <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
                        <span>Current File</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`${isMobile ? 'flex-col space-y-4' : 'flex items-center justify-between'} p-3 md:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200`}>
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-500 p-2 rounded-full">
                            <FileText className="h-4 w-4 md:h-5 md:w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-green-800 text-sm md:text-base truncate">{fileName}</h3>
                            <p className="text-xs md:text-sm text-green-600">
                              {uploadedData.rowCount} rows, {uploadedData.columnCount} columns
                            </p>
                          </div>
                        </div>
                        <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'space-x-2'}`}>
                          <Button
                            onClick={() => setActiveView('preview')}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-sm md:text-base"
                            size={isMobile ? "sm" : "default"}
                          >
                            <FileText className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                            Preview
                          </Button>
                          <Button
                            onClick={() => navigate('/charts', { state: { data: uploadedData, fileName } })}
                            variant="outline"
                            className="border-green-300 text-green-700 hover:bg-green-50 text-sm md:text-base"
                            size={isMobile ? "sm" : "default"}
                          >
                            <BarChart3 className="h-3 w-3 md:h-4 md:w-4 mr-2" />
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
              <div className={`${isMobile ? 'flex-col space-y-3' : 'flex items-center justify-between'} mb-4 md:mb-6`}>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800">Data Preview</h2>
                <Badge variant="outline" className="bg-blue-100 text-blue-700 text-sm">
                  {fileName}
                </Badge>
              </div>
              <Card className="bg-white/60 backdrop-blur-sm">
                <CardContent className="p-4 md:p-8">
                  <div className="text-center">
                    <FileText className="h-12 w-12 md:h-16 md:w-16 text-slate-400 mx-auto mb-3 md:mb-4" />
                    <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-2">Data Loaded Successfully</h3>
                    <p className="text-slate-600 mb-4 text-sm md:text-base">
                      {uploadedData.rowCount} rows, {uploadedData.columnCount} columns
                    </p>
                    <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'space-x-4'} justify-center`}>
                      <Button 
                        onClick={() => navigate('/data-analysis', { state: { data: uploadedData, fileName } })}
                        size={isMobile ? "sm" : "default"}
                      >
                        Analyze Data
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate('/charts', { state: { data: uploadedData, fileName } })}
                        size={isMobile ? "sm" : "default"}
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
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6">Create Charts</h2>
              <Card className="bg-white/70 backdrop-blur-sm">
                <CardContent className="p-4 md:p-8 text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <BarChart3 className="h-8 w-8 md:h-10 md:w-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-2">Chart Studio</h3>
                  <p className="text-slate-600 mb-4 md:mb-6 text-sm md:text-base">Create beautiful charts and visualizations from your data.</p>
                  <Button 
                    onClick={() => navigate('/charts', { state: { data: uploadedData, fileName } })}
                    size={isMobile ? "sm" : "default"}
                  >
                    <Plus className="h-3 w-3 md:h-4 md:w-4 mr-2" />
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
