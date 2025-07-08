import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from './ui-components';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

const FileUpload = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (file) => {
    if (!file) return;
    
    setIsUploading(true);
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (fileExtension === 'csv') {
      // Handle CSV files
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const lines = text.split('\n').filter(line => line.trim());
          
          if (lines.length === 0) {
            toast.error('File is empty');
            setIsUploading(false);
            return;
          }
          
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          const rows = lines.slice(1).map(line => 
            line.split(',').map(cell => cell.trim().replace(/"/g, ''))
          );
          
          const data = {
            headers,
            rows,
            rowCount: rows.length,
            columnCount: headers.length
          };
          
          onFileUpload(data, file.name);
          setIsUploading(false);
        } catch {
          toast.error('Error parsing CSV file');
          setIsUploading(false);
        }
      };
      reader.readAsText(file);
      
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      // Handle Excel files
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length === 0) {
            toast.error('File is empty');
            setIsUploading(false);
            return;
          }
          
          const headers = jsonData[0];
          const rows = jsonData.slice(1);
          
          const processedData = {
            headers,
            rows,
            rowCount: rows.length,
            columnCount: headers.length
          };
          
          onFileUpload(processedData, file.name);
          setIsUploading(false);
        } catch {
          toast.error('Error parsing Excel file');
          setIsUploading(false);
        }
      };
      reader.readAsArrayBuffer(file);
      
    } else {
      toast.error('Unsupported file type. Please upload CSV or Excel files.');
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Upload Your Data</span>
        </CardTitle>
        <CardDescription>
          Upload CSV or Excel files to start analyzing your data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mb-4">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop your file here or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Supports CSV and Excel files up to 10MB
            </p>
          </div>
          
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />
          
          <Button 
            disabled={isUploading} 
            className="cursor-pointer"
            onClick={() => document.getElementById('file-upload').click()}
          >
            {isUploading ? 'Processing...' : 'Choose File'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
