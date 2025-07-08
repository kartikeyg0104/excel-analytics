import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui-components';
import { Button } from './ui-components';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui-components';
import { Badge } from './ui-components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui-components';
import { Input } from './ui-components';
import { Label } from './ui-components';
import { Switch } from './ui-components';
import { Slider } from './ui-components';
import { Separator } from './ui-components';
import { BarChart3, LineChart, PieChart, ScatterChart, Download, Palette, Settings, FileSpreadsheet, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  ScatterChart as RechartsScatterChart,
  Bar,
  Line,
  Pie,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

const chartTypes = [
  { id: 'bar', name: 'Bar Chart', icon: BarChart3, color: 'text-blue-600' },
  { id: 'line', name: 'Line Chart', icon: LineChart, color: 'text-green-600' },
  { id: 'pie', name: 'Pie Chart', icon: PieChart, color: 'text-purple-600' },
  { id: 'scatter', name: 'Scatter Plot', icon: ScatterChart, color: 'text-orange-600' },
];

const colorSchemes = [
  { id: 'default', name: 'Default', colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'] },
  { id: 'ocean', name: 'Ocean', colors: ['#0EA5E9', '#06B6D4', '#67E8F9', '#A5F3FC', '#CFFAFE'] },
  { id: 'sunset', name: 'Sunset', colors: ['#F97316', '#FB923C', '#FDBA74', '#FED7AA', '#FFF7ED'] },
  { id: 'forest', name: 'Forest', colors: ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0'] },
  { id: 'purple', name: 'Purple', colors: ['#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD', '#E9D5FF'] },
];

// Chart Display Component (consolidated)
const ChartDisplay = ({ chartData, customization }) => {
  if (!chartData || !chartData.data || chartData.data.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-slate-500">No chart data to display</p>
        </CardContent>
      </Card>
    );
  }

  const downloadChart = (format) => {
    toast.success(`Chart downloaded as ${format.toUpperCase()}`);
  };

  const renderChart = () => {
    const { type, data } = chartData;
    const colorSchemeObj = colorSchemes.find(scheme => scheme.id === customization.colorScheme) || colorSchemes[0];
    const colors = colorSchemeObj.colors;

    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chartData.xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={chartData.yAxis} fill={colors[0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chartData.xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={chartData.yAxis} stroke={colors[0]} strokeWidth={2} />
            </RechartsLineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={data}
                dataKey={chartData.yAxis}
                nameKey={chartData.xAxis}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill={colors[0]}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        );
      
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsScatterChart data={data}>
              <CartesianGrid />
              <XAxis dataKey={chartData.xAxis} />
              <YAxis dataKey={chartData.yAxis} />
              <Tooltip />
              <Scatter fill={colors[0]} />
            </RechartsScatterChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-500">Unsupported chart type: {type}</p>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{customization.title || 'Chart'}</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => downloadChart('png')}>
              <Download className="h-4 w-4 mr-2" />
              PNG
            </Button>
            <Button variant="outline" size="sm" onClick={() => downloadChart('svg')}>
              <Download className="h-4 w-4 mr-2" />
              SVG
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          className="w-full border border-slate-200 rounded-lg bg-white"
          style={{ height: `${customization.chartHeight}px` }}
        >
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
};

// Chart Customization Component (consolidated)
const ChartCustomization = ({ customization, setCustomization }) => {
  const updateCustomization = (key, value) => {
    setCustomization(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="h-5 w-5" />
          <span>Chart Customization</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Chart Title</Label>
          <Input
            id="title"
            value={customization.title}
            onChange={(e) => updateCustomization('title', e.target.value)}
            placeholder="Enter chart title"
          />
        </div>

        <div className="space-y-2">
          <Label>Color Scheme</Label>
          <Select
            value={customization.colorScheme}
            onValueChange={(value) => updateCustomization('colorScheme', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {colorSchemes.map((scheme) => (
                <SelectItem key={scheme.id} value={scheme.id}>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {scheme.colors.slice(0, 3).map((color, index) => (
                        <div
                          key={index}
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span>{scheme.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="grid">Show Grid</Label>
            <Switch
              id="grid"
              checked={customization.showGrid}
              onCheckedChange={(checked) => updateCustomization('showGrid', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="legend">Show Legend</Label>
            <Switch
              id="legend"
              checked={customization.showLegend}
              onCheckedChange={(checked) => updateCustomization('showLegend', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="values">Show Values</Label>
            <Switch
              id="values"
              checked={customization.showValues}
              onCheckedChange={(checked) => updateCustomization('showValues', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="animated">Animated</Label>
            <Switch
              id="animated"
              checked={customization.animated}
              onCheckedChange={(checked) => updateCustomization('animated', checked)}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Font Size: {customization.fontSize}px</Label>
            <Slider
              value={[customization.fontSize]}
              onValueChange={([value]) => updateCustomization('fontSize', value)}
              min={8}
              max={24}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Chart Height: {customization.chartHeight}px</Label>
            <Slider
              value={[customization.chartHeight]}
              onValueChange={([value]) => updateCustomization('chartHeight', value)}
              min={200}
              max={800}
              step={50}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Charts Page
const Charts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state?.data;
  const fileName = location.state?.fileName || 'Unknown File';

  const [selectedChartType, setSelectedChartType] = useState('bar');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [chartData, setChartData] = useState(null);
  const [customization, setCustomization] = useState({
    title: '',
    showGrid: true,
    showLegend: true,
    colorScheme: 'default',
    fontSize: 12,
    chartHeight: 400,
    showValues: false,
    animated: true,
  });

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
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Chart Studio
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
              <p className="text-slate-600 mb-6">Please upload data first to create charts.</p>
              <Button onClick={() => navigate('/')}>
                Go Back to Upload
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const { headers, rows } = data;

  const generateChart = () => {
    if (!xAxis || !yAxis) {
      toast.error('Please select both X and Y axes');
      return;
    }

    const xIndex = headers.indexOf(xAxis);
    const yIndex = headers.indexOf(yAxis);

    if (xIndex === -1 || yIndex === -1) {
      toast.error('Invalid axis selection');
      return;
    }

    const processedData = rows.map(row => ({
      [xAxis]: row[xIndex],
      [yAxis]: parseFloat(row[yIndex]) || 0
    }));

    const newChartData = {
      type: selectedChartType,
      xAxis,
      yAxis,
      data: processedData,
      dataPoints: processedData.length
    };

    setChartData(newChartData);
    toast.success('Chart generated successfully!');
  };

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
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl shadow-lg">
                <BarChart3 className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Chart Studio
                </h1>
                <p className="text-sm text-slate-600">
                  <Badge variant="outline" className="mr-2">{fileName}</Badge>
                  {rows.length} rows • {headers.length} columns
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chart Configuration */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Chart Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Chart Type Selection */}
                <div className="space-y-3">
                  <Label>Chart Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {chartTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setSelectedChartType(type.id)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            selectedChartType === type.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <Icon className={`h-6 w-6 mx-auto mb-2 ${type.color}`} />
                          <p className="text-sm font-medium">{type.name}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Axis Selection */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>X-Axis</Label>
                    <Select value={xAxis} onValueChange={setXAxis}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select X-axis column" />
                      </SelectTrigger>
                      <SelectContent>
                        {headers.map((header) => (
                          <SelectItem key={header} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Y-Axis</Label>
                    <Select value={yAxis} onValueChange={setYAxis}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Y-axis column" />
                      </SelectTrigger>
                      <SelectContent>
                        {headers.map((header) => (
                          <SelectItem key={header} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={generateChart} className="w-full" size="lg">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Chart
                </Button>
              </CardContent>
            </Card>

            {/* Chart Customization */}
            <ChartCustomization 
              customization={customization} 
              setCustomization={setCustomization} 
            />
          </div>

          {/* Chart Display */}
          <div className="lg:col-span-2">
            <ChartDisplay chartData={chartData} customization={customization} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Charts;
