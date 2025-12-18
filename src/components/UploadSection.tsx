import React, { useCallback, useState } from 'react';
import { UploadCloud, File as FileIcon, X, Briefcase } from 'lucide-react';
import { FileData } from '../types';

interface UploadSectionProps {
  onAnalyze: (file: FileData, jobDesc: string) => void;
  isAnalyzing: boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onAnalyze, isAnalyzing }) => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFile = (selectedFile: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Please upload a PDF, JPG, or PNG file.");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return;
    }
    setError(null);
    setFile(selectedFile);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file || !jobDesc.trim()) {
      setError("Please provide both a resume and a job description.");
      return;
    }

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      const fileData: FileData = {
        base64: base64String,
        mimeType: file.type,
        name: file.name
      };
      onAnalyze(fileData, jobDesc);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
          Optimize Your Resume with AI
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Upload your resume and the job description to get instant feedback and a rewritten version.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <UploadCloud className="text-brand-500" />
            Upload Resume
          </h3>
          
          {!file ? (
            <label 
              className={`h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                dragActive 
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' 
                  : 'border-slate-300 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                className="hidden" 
                onChange={handleChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <UploadCloud className={`w-12 h-12 mb-4 ${dragActive ? 'text-brand-600' : 'text-slate-400'}`} />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Click or drag file to this area
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                PDF, JPG, PNG up to 5MB
              </p>
            </label>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 relative">
              <button 
                onClick={() => setFile(null)}
                className="absolute top-2 right-2 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors"
              >
                <X size={16} />
              </button>
              <FileIcon className="w-16 h-16 text-brand-500 mb-4" />
              <p className="font-medium text-slate-900 dark:text-white truncate max-w-[80%]">
                {file.name}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>

        {/* Job Description Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Briefcase className="text-brand-500" />
            Job Description
          </h3>
          <textarea
            className="flex-grow w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
            placeholder="Paste the job description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-300 text-sm text-center">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isAnalyzing || !file || !jobDesc}
        className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all transform active:scale-[0.99] ${
          isAnalyzing || !file || !jobDesc
            ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'
            : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-brand-500/30'
        }`}
      >
        {isAnalyzing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing Resume...
          </span>
        ) : (
          "Analyze Resume"
        )}
      </button>
    </div>
  );
};