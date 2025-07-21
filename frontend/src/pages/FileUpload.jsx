import { useState } from 'react';
import { Upload } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from './ui-components';
import { toast } from 'sonner';
import { uploadFile } from '../api/analytic';

const FileUpload = ({ token, onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await uploadFile(file, token);
      toast.success('File uploaded and processed successfully!');
      // Optional callback with server response
      onUploadSuccess(response);
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload file.');
    } finally {
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
      handleFileUpload(files[0]);
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
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
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
            onChange={(e) => handleFileUpload(e.target.files[0])}
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
