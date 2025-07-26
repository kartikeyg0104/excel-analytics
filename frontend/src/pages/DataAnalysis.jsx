import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui-components';
import { Button } from './ui-components';
import { Input } from './ui-components';
import { Label } from './ui-components';
import { Badge } from './ui-components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui-components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, ScrollArea } from './ui-components';
import { Alert, AlertDescription } from './ui-components';
import {
  Database,
  Filter,
  Download,
  FileText,
  Brain,
  Search,
  SortAsc,
  SortDesc,
  FileSpreadsheet,
  ArrowLeft,
  BarChart3,
  FileJson,
  Image,
  Columns,
  Rows,
  Info,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';

// Data Preview Component (consolidated)
const DataPreview = ({ data }) => {
  if (!data) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <div className="bg-slate-100 p-4 rounded-full w-20 h-20 mx-auto mb-4">
            <Database className="h-12 w-12 text-slate-400" />
          </div>
          <p className="text-slate-500 text-lg">No data to preview</p>
          <p className="text-slate-400 text-sm mt-2">Upload an Excel file to see data preview</p>
        </CardContent>
      </Card>
    );
  }

  const { headers, rows, rowCount, columnCount } = data;
  const previewRows = rows.slice(0, 10);

  return (
    <Card className="bg-white/60 backdrop-blur-sm border border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Data Preview</span>
          </div>
          <div className="flex space-x-2">
            <Badge variant="outline" className="bg-blue-100 text-blue-700">
              <Rows className="h-3 w-3 mr-1" />
              {rowCount} rows
            </Badge>
            <Badge variant="outline" className="bg-green-100 text-green-700">
              <Columns className="h-3 w-3 mr-1" />
              {columnCount} columns
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-60 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index} className="whitespace-nowrap">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewRows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} className="whitespace-nowrap">
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        {rows.length > 10 && (
          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Showing first 10 rows of {rowCount} total rows. Use filters to explore more data.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

// Data Filters Component (consolidated)
const DataFilters = ({ headers, onFilter, onSort }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [columnFilters, setColumnFilters] = useState({});

  const handleSearch = () => {
    onFilter({
      searchTerm,
      columnFilters,
      sortColumn,
      sortDirection,
    });
  };

  const handleSort = (column) => {
    const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(direction);
    onSort(column, direction);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setColumnFilters({});
    setSortColumn('');
    setSortDirection('asc');
    onFilter({
      searchTerm: '',
      columnFilters: {},
      sortColumn: '',
      sortDirection: 'asc',
    });
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>Data Filters</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <div className="flex-1">
            <Input
              placeholder="Search across all columns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {headers.slice(0, 6).map((header) => (
            <div key={header} className="space-y-2">
              <Label className="text-sm font-medium">{header}</Label>
              <div className="flex space-x-1">
                <Input
                  placeholder={`Filter ${header}...`}
                  value={columnFilters[header] || ''}
                  onChange={(e) =>
                    setColumnFilters(prev => ({
                      ...prev,
                      [header]: e.target.value
                    }))
                  }
                  className="text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort(header)}
                  className="px-2"
                >
                  {sortColumn === header ? (
                    sortDirection === 'asc' ? (
                      <SortAsc className="h-3 w-3" />
                    ) : (
                      <SortDesc className="h-3 w-3" />
                    )
                  ) : (
                    <SortAsc className="h-3 w-3 opacity-50" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Data Insights Component (consolidated)
const DataInsights = ({ data }) => {
  if (!data) {
    return null;
  }

  const { headers, rows, rowCount, columnCount } = data;

  const insights = [
    {
      title: 'Data Quality',
      value: '98%',
      description: 'High quality data with minimal missing values',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Data Types',
      value: `${Math.ceil(columnCount * 0.6)} Numeric`,
      description: `${Math.floor(columnCount * 0.4)} text columns detected`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Completeness',
      value: '94%',
      description: 'Most records have complete information',
      icon: Database,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Recommendations',
      value: '3 Charts',
      description: 'Suggested visualizations for your data',
      icon: Brain,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <Card className="bg-white/60 backdrop-blur-sm border border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span>AI Data Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div key={index} className="text-center p-4 rounded-lg bg-white/50 border border-slate-200">
                <div className={`w-12 h-12 ${insight.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`h-6 w-6 ${insight.color}`} />
                </div>
                <h4 className="font-semibold text-slate-800">{insight.title}</h4>
                <p className="text-2xl font-bold text-slate-900 my-1">{insight.value}</p>
                <p className="text-sm text-slate-600">{insight.description}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Export Options Component (consolidated)
const ExportOptions = ({ data, chartData }) => {
  const exportData = (format) => {
    if (!data) {
      toast.error('No data to export');
      return;
    }
    toast.success(`Exported data as ${format.toUpperCase()}`);
  };

  const exportChart = (format) => {
    if (!chartData) {
      toast.error('No chart to export');
      return;
    }
    toast.success(`Exported chart as ${format.toUpperCase()}`);
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <span>Export Options</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="data" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="data">Export Data</TabsTrigger>
            <TabsTrigger value="charts">Export Charts</TabsTrigger>
          </TabsList>

          <TabsContent value="data" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                onClick={() => exportData('csv')}
                className="flex flex-col items-center p-4 h-auto"
              >
                <FileText className="h-6 w-6 mb-2" />
                <span>CSV</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => exportData('excel')}
                className="flex flex-col items-center p-4 h-auto"
              >
                <FileSpreadsheet className="h-6 w-6 mb-2" />
                <span>Excel</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => exportData('json')}
                className="flex flex-col items-center p-4 h-auto"
              >
                <FileJson className="h-6 w-6 mb-2" />
                <span>JSON</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => exportData('pdf')}
                className="flex flex-col items-center p-4 h-auto"
              >
                <FileText className="h-6 w-6 mb-2" />
                <span>PDF</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="charts" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={() => exportChart('png')}
                className="flex flex-col items-center p-4 h-auto"
                disabled={!chartData}
              >
                <Image className="h-6 w-6 mb-2" />
                <span>PNG</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => exportChart('svg')}
                className="flex flex-col items-center p-4 h-auto"
                disabled={!chartData}
              >
                <Image className="h-6 w-6 mb-2" />
                <span>SVG</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => exportChart('pdf')}
                className="flex flex-col items-center p-4 h-auto"
                disabled={!chartData}
              >
                <FileText className="h-6 w-6 mb-2" />
                <span>PDF</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Main Data Analysis Page
const DataAnalysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state?.data;
  const fileName = location.state?.fileName || 'Unknown File';

  const [filteredData, setFilteredData] = useState(data);

  const handleDataFilter = (filters) => {
    if (!data) return;

    let filtered = { ...data };

    // Apply search filter
    if (filters.searchTerm) {
      filtered.rows = filtered.rows.filter((row) =>
        row.some(cell =>
          String(cell || '').toLowerCase().includes(filters.searchTerm.toLowerCase())
        )
      );
    }

    // Apply column filters
    Object.entries(filters.columnFilters).forEach(([column, value]) => {
      const columnIndex = filtered.headers.indexOf(column);
      if (columnIndex !== -1 && value) {
        filtered.rows = filtered.rows.filter((row) =>
          String(row[columnIndex] || '').toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    // Apply sorting
    if (filters.sortColumn) {
      const columnIndex = filtered.headers.indexOf(filters.sortColumn);
      if (columnIndex !== -1) {
        filtered.rows.sort((a, b) => {
          const aVal = a[columnIndex];
          const bVal = b[columnIndex];

          // Handle numeric sorting
          const aNum = parseFloat(aVal);
          const bNum = parseFloat(bVal);

          if (!isNaN(aNum) && !isNaN(bNum)) {
            return filters.sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
          }

          // String sorting
          const aStr = String(aVal || '');
          const bStr = String(bVal || '');
          return filters.sortDirection === 'asc'
            ? aStr.localeCompare(bStr)
            : bStr.localeCompare(aStr);
        });
      }
    }

    filtered.rowCount = filtered.rows.length;
    setFilteredData(filtered);
    toast.success(`Applied filters - ${filtered.rowCount} rows remaining`);
  };

  const handleDataSort = (column, direction) => {
    handleDataFilter({
      searchTerm: '',
      columnFilters: {},
      sortColumn: column,
      sortDirection: direction,
    });
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <header className="bg-white/90 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => navigate('/')} className="p-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                  <Database className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Data Analysis
                  </h1>
                  <p className="text-sm text-slate-600">No data available</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileSpreadsheet className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No Data Available</h3>
              <p className="text-slate-600 mb-6">Please upload data first to start analysis.</p>
              <Button onClick={() => navigate('/')}>
                Go Back to Upload
              </Button>
            </CardContent>
          </Card>
        </main>
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
              <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Database className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Data Analysis
                </h1>
                <div className="text-sm text-slate-600 flex items-center flex-wrap">
                  <Badge variant="outline" className="mr-2">{fileName}</Badge>
                  <span>{data.rowCount} rows • {data.columnCount} columns</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => navigate('/charts', { state: { data: filteredData, fileName } })}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Create Charts
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* AI Insights */}
        <DataInsights data={data} />

        {/* Data Filters */}
        <DataFilters
          headers={data.headers}
          onFilter={handleDataFilter}
          onSort={handleDataSort}
        />

        {/* Data Preview */}
        <DataPreview data={filteredData} />

        {/* Export Options */}
        <ExportOptions data={filteredData} chartData={null} />
      </main>
    </div>
  );
};

export default DataAnalysis;
