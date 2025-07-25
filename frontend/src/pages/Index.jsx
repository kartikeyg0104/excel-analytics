import { useState } from 'react';
import { Upload, BarChart3, FileSpreadsheet, TrendingUp, Database, Sparkles, Filter, Brain, Download, Menu, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Tabs, TabsContent, TabsList, TabsTrigger, Badge, Alert, AlertDescription } from './ui-components';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/use-mobile';
import FileUpload from './FileUpload';

const Index = () => {
  const navigate = useNavigate();
  const [uploadedData, setUploadedData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [activeTab, setActiveTab] = useState('upload');

  const handleFileUpload = (data, name) => {
    setUploadedData(data);
    setFileName(name);
    setActiveTab('preview');
    toast.success(`Uploaded ${name} successfully!`);

    // Navigate with file data
    navigate('/data-analysis', { state: { data, fileName: name } });
  };

  const handleGenerateChart = () => {
    if (!uploadedData) return toast.error("No data to chart!");
    setActiveTab('charts');
    toast.success('Generating chart...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 md:p-3 rounded-xl shadow-lg">
                <FileSpreadsheet className="h-5 w-5 md:h-7 md:w-7 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
                  Excel Data Analyzer
                </h1>
                <p className={`text-xs md:text-sm text-slate-600 flex items-center gap-2 mt-1 ${isMobile ? 'hidden' : ''}`}>
                  <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-yellow-500" />
                  Built by Kartikey - Advanced data analysis tool
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            {!isMobile ? (
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Pro Analytics
                </Badge>
                <Badge variant="outline" className="bg-purple-100 text-purple-800">
                  <Brain className="h-3 w-3 mr-1" />
                  AI Powered
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="shadow-sm hover:shadow-md transition-all"
                  onClick={() => window.location.href = '/login'}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  className="shadow-sm hover:shadow-md transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={() => window.location.href = '/signup'}
                >
                  Get Started
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
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Pro Analytics
                </Badge>
                <Badge variant="outline" className="bg-purple-100 text-purple-800">
                  <Brain className="h-3 w-3 mr-1" />
                  AI Powered
                </Badge>
              </div>
              <div className="flex flex-col space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/login'}
                >
                  Sign In
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={() => window.location.href = '/signup'}
                >
                  Get Started
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Enhanced Progress Indicator */}
        <div className="mb-6 md:mb-8">
          <div className={`flex items-center justify-center ${isMobile ? 'flex-col space-y-2' : 'space-x-4'}`}>
            <div className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-full transition-all ${activeTab === 'upload' ? 'bg-blue-100 text-blue-700' : 'bg-white/60 text-slate-600'
              }`}>
              <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeTab === 'upload' ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-600'
                }`}>1</div>
              <span className="font-medium text-sm md:text-base">Upload</span>
            </div>
            {!isMobile && <div className={`w-8 h-0.5 ${uploadedData ? 'bg-blue-600' : 'bg-slate-300'} transition-all`}></div>}
            <div className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-full transition-all ${activeTab === 'preview' ? 'bg-blue-100 text-blue-700' : 'bg-white/60 text-slate-600'
              }`}>
              <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeTab === 'preview' ? 'bg-blue-600 text-white' : uploadedData ? 'bg-green-500 text-white' : 'bg-slate-300 text-slate-600'
                }`}>2</div>
              <span className="font-medium text-sm md:text-base">Preview</span>
            </div>
            {!isMobile && <div className={`w-8 h-0.5 ${uploadedData ? 'bg-blue-600' : 'bg-slate-300'} transition-all`}></div>}
            <div className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-full transition-all ${activeTab === 'charts' ? 'bg-blue-100 text-blue-700' : 'bg-white/60 text-slate-600'
              }`}>
              <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeTab === 'charts' ? 'bg-blue-600 text-white' : uploadedData ? 'bg-green-500 text-white' : 'bg-slate-300 text-slate-600'
                }`}>3</div>
              <span className="font-medium text-sm md:text-base">Analyze</span>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/80 backdrop-blur-sm shadow-sm">
            <TabsTrigger value="upload" className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Upload className="h-4 w-4" />
              <span>Upload Data</span>
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={!uploadedData} className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Database className="h-4 w-4" />
              <span>Analyze Data</span>
            </TabsTrigger>
            <TabsTrigger value="charts" disabled={!uploadedData} className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4" />
              <span>Create Charts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-8">
            <div className="text-center py-12">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-full w-20 h-20 mx-auto mb-6 shadow-lg">
                <FileSpreadsheet className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-slate-800 mb-4">
                Upload Your Excel File
              </h2>
              <p className="text-lg text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Drag and drop your Excel file or click to browse. We support .xlsx and .xls formats
                and will automatically parse your data for powerful visualization and analysis.
              </p>

              <Alert className="max-w-2xl mx-auto mb-8 bg-blue-50 border-blue-200">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Pro Tip: Make sure your Excel file has clear column headers in the first row for best results!
                </AlertDescription>
              </Alert>
            </div>

            <FileUpload onFileUpload={handleFileUpload} />

            {/* Enhanced Feature Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
                <CardHeader className="text-center pb-4">
                  <div className="bg-blue-100 p-3 rounded-xl w-fit mx-auto mb-3 group-hover:bg-blue-600 transition-colors">
                    <BarChart3 className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <CardTitle className="text-xl">Smart Charts</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base">
                    AI-powered chart recommendations with advanced customization options
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
                <CardHeader className="text-center pb-4">
                  <div className="bg-green-100 p-3 rounded-xl w-fit mx-auto mb-3 group-hover:bg-green-600 transition-colors">
                    <Filter className="h-8 w-8 text-green-600 group-hover:text-white transition-colors" />
                  </div>
                  <CardTitle className="text-xl">Data Filtering</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base">
                    Advanced filtering and sorting capabilities to focus on what matters
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
                <CardHeader className="text-center pb-4">
                  <div className="bg-purple-100 p-3 rounded-xl w-fit mx-auto mb-3 group-hover:bg-purple-600 transition-colors">
                    <Brain className="h-8 w-8 text-purple-600 group-hover:text-white transition-colors" />
                  </div>
                  <CardTitle className="text-xl">AI Insights</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base">
                    Intelligent data analysis with automated insights and recommendations
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
                <CardHeader className="text-center pb-4">
                  <div className="bg-orange-100 p-3 rounded-xl w-fit mx-auto mb-3 group-hover:bg-orange-600 transition-colors">
                    <Download className="h-8 w-8 text-orange-600 group-hover:text-white transition-colors" />
                  </div>
                  <CardTitle className="text-xl">Export Options</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base">
                    Multiple export formats including CSV, JSON, PNG, and PDF reports
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-8">
            <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-xl">
                  <FileSpreadsheet className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Data Analysis Hub</h2>
                  <p className="text-slate-600 flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {fileName}
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      {uploadedData?.rowCount || 0} rows
                    </Badge>
                  </p>
                </div>
              </div>
              <Button
                onClick={handleGenerateChart}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                Create Visualizations
              </Button>
            </div>

            {/* Quick Actions for Upload Success */}
            {uploadedData && (
              <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-500 p-2 rounded-full">
                      <Database className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800">Upload Successful!</h3>
                      <p className="text-sm text-green-600">Your data is ready for analysis</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => navigate('/data-analysis', { state: { data: uploadedData, fileName } })}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Analyze Data
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
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200/50 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <FileSpreadsheet className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Excel Data Analyzer</h3>
                <p className="text-sm text-slate-600">Built with ❤️ by Kartikey</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-600">
              <span>Version 1.0.0</span>
              <span>•</span>
              <span>React + Vite</span>
              <span>•</span>
              <span>MIT License</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;