// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Upload } from 'lucide-react';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
//   Button,
// } from './ui-components';
// import { toast } from 'sonner';
// import { uploadFile } from '../api/analytic';

// const FileUpload = ({ onFileUpload }) => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem('token');
//   const [isDragging, setIsDragging] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);

//   const handleFileUpload = async (file) => {
//     if (!file) return;

//     setIsUploading(true);
//     try {
//       const response = await uploadFile(file, token);
//       const { file: uploadedFile, analytic } = response;

//       if (!uploadedFile || !analytic) throw new Error("Invalid response");

//       const data = {
//         headers: analytic.preview.length > 0 ? Object.keys(analytic.preview[0]) : [],
//         rows: analytic.preview.map(obj => Object.values(obj)),
//         rowCount: analytic.preview.length,
//         columnCount: analytic.preview.length > 0 ? Object.keys(analytic.preview[0]).length : 0,
//       };

//       onFileUpload(data, uploadedFile.originalName);
//     } catch (err) {
//       console.log(err);
//       const msg = err?.response?.data?.msg || 'Upload failed';
//       toast.error(msg);

//       if (msg.toLowerCase().includes('login')) {
//         navigate('/login');
//       }
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     if (e.dataTransfer.files.length > 0) {
//       handleFileUpload(e.dataTransfer.files[0]);
//     }
//   };

//   return (
//     <Card className="mb-8">
//       <CardHeader>
//         <CardTitle className="flex items-center space-x-2">
//           <Upload className="h-5 w-5" />
//           <span>Upload Your Data</span>
//         </CardTitle>
//         <CardDescription>
//           Upload CSV or Excel files to start analyzing your data
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div
//           className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${isDragging
//             ? 'border-blue-500 bg-blue-50'
//             : 'border-gray-300 hover:border-gray-400'
//             }`}
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={handleDrop}
//         >
//           <div className="mb-4">
//             <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-lg font-medium text-gray-700 mb-2">
//               Drop your file here or click to browse
//             </p>
//             <p className="text-sm text-gray-500">
//               Supports CSV and Excel files up to 10MB
//             </p>
//           </div>

//           <input
//             type="file"
//             accept=".csv,.xlsx,.xls"
//             onChange={(e) => handleFileUpload(e.target.files[0])}
//             className="hidden"
//             id="file-upload"
//             disabled={isUploading}
//           />

//           <Button
//             disabled={isUploading}
//             className="cursor-pointer"
//             onClick={() => document.getElementById('file-upload').click()}
//           >
//             {isUploading ? 'Processing...' : 'Choose File'}
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default FileUpload;


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { dummyData } from '../lib/utils';

const FileUpload = ({ onFileUpload }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);

    try {
      if (!token) {
        // ✅ Use dummyData instead of backend
        toast.warning("Not logged in. Using test data...");
        const { file: uploadedFile, analytic } = dummyData;

        const data = {
          headers: analytic.preview.length > 0 ? Object.keys(analytic.preview[0]) : [],
          rows: analytic.preview.map(obj => Object.values(obj)),
          rowCount: analytic.preview.length,
          columnCount: analytic.preview.length > 0 ? Object.keys(analytic.preview[0]).length : 0,
        };

        onFileUpload(data, uploadedFile.originalName);
        return;
      }

      // ✅ Authenticated user: Upload to backend
      const response = await uploadFile(file, token);
      const { file: uploadedFile, analytic } = response;

      if (!uploadedFile || !analytic) throw new Error("Invalid response");

      const data = {
        headers: analytic.preview.length > 0 ? Object.keys(analytic.preview[0]) : [],
        rows: analytic.preview.map(obj => Object.values(obj)),
        rowCount: analytic.preview.length,
        columnCount: analytic.preview.length > 0 ? Object.keys(analytic.preview[0]).length : 0,
      };

      onFileUpload(data, uploadedFile.originalName);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.msg || 'Upload failed';
      toast.error(msg);

      if (msg.toLowerCase().includes('login')) {
        navigate('/login');
      }
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
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
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