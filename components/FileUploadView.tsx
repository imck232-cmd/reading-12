
import React, { useState, useCallback } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';

interface FileUploadViewProps {
  onProcessFile: (content: string) => void;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
}

const FileUploadView: React.FC<FileUploadViewProps> = ({ onProcessFile, isLoading, loadingMessage, error }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.md')) {
        setFile(selectedFile);
        setFileError(null);
      } else {
        setFile(null);
        setFileError('يرجى اختيار ملف نصي (.txt) أو (.md).');
      }
    }
  };

  const handleProcess = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          onProcessFile(content);
        } else {
          setFileError('الملف فارغ أو لا يمكن قراءته.');
        }
      };
      reader.readAsText(file);
    }
  };
  
  const onDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
        if (droppedFile.type === 'text/plain' || droppedFile.name.endsWith('.md')) {
            setFile(droppedFile);
            setFileError(null);
        } else {
            setFile(null);
            setFileError('يرجى اختيار ملف نصي (.txt) أو (.md).');
        }
    }
  }, []);


  if (isLoading) {
    return (
      <Card className="text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <Spinner />
          <p className="text-lg font-medium text-slate-700">{loadingMessage}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">ابدأ رحلتك التعليمية</h2>
        <p className="text-slate-600 mb-6">
          قم بتحميل ملف المنهج الدراسي (.txt أو .md) لتحويله إلى تجربة تعليمية تفاعلية.
        </p>

        <label 
            htmlFor="file-upload" 
            className="flex justify-center w-full h-48 px-4 transition bg-white border-2 border-slate-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-slate-400 focus:outline-none"
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
          <span className="flex flex-col items-center justify-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="font-medium text-slate-600">
              {file ? file.name : 'اسحب وأفلت ملفك هنا، أو انقر للاختيار'}
            </span>
          </span>
          <input id="file-upload" type="file" accept=".txt,.md" onChange={handleFileChange} className="hidden" />
        </label>
        
        {fileError && <p className="mt-2 text-sm text-red-600">{fileError}</p>}
        {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}
        
        <div className="mt-6">
          <Button onClick={handleProcess} disabled={!file || isLoading} className="w-full sm:w-auto">
            تحليل وبدء التعلم
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FileUploadView;
