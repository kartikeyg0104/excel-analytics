// Test Chart Functionality
// This file tests the chart generation with sample data

// Test data that matches our CSV structure
const testData = {
  headers: ["Name", "Age", "City", "Salary"],
  rows: [
    ["John Doe", "30", "New York", "50000"],
    ["Jane Smith", "25", "Los Angeles", "60000"], 
    ["Bob Johnson", "35", "Chicago", "45000"],
    ["Alice Brown", "28", "Houston", "55000"],
    ["Charlie Wilson", "32", "Phoenix", "48000"]
  ],
  rowCount: 5,
  columnCount: 4
};

// Test chart data generation
const generateTestChartData = (type = 'bar', xAxis = 'Name', yAxis = 'Salary') => {
  const xIndex = testData.headers.indexOf(xAxis);
  const yIndex = testData.headers.indexOf(yAxis);
  
  const processedData = testData.rows.map(row => ({
    [xAxis]: row[xIndex],
    [yAxis]: parseFloat(row[yIndex]) || 0
  }));

  return {
    type,
    xAxis,
    yAxis, 
    data: processedData,
    dataPoints: processedData.length
  };
};

// Test different chart types
console.log('Bar Chart Data:', generateTestChartData('bar', 'Name', 'Salary'));
console.log('Line Chart Data:', generateTestChartData('line', 'Name', 'Age'));
console.log('Pie Chart Data:', generateTestChartData('pie', 'City', 'Salary'));

export { testData, generateTestChartData };
