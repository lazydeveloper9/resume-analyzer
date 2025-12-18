import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { UploadSection } from './components/UploadSection';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { RebuildPreview } from './components/RebuildPreview';
import { AppState, FileData, AnalysisResult } from './types';
import { analyzeResume, rebuildResume } from './services/geminiService';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [appState, setAppState] = useState<AppState>('upload');
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  
  // Analysis Data
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [rebuiltContent, setRebuiltContent] = useState<string>('');

  // Loading States
  const [isProcessing, setIsProcessing] = useState(false);

  // Theme Init
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleAnalyze = async (file: FileData, jobDesc: string) => {
    setFileData(file);
    setJobDescription(jobDesc);
    setAppState('analyzing');
    setIsProcessing(true);

    try {
      const result = await analyzeResume(file, jobDesc);
      setAnalysisResult(result);
      setAppState('results');
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please try again.");
      setAppState('upload');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRebuild = async () => {
    if (!fileData || !jobDescription || !analysisResult) return;
    
    // Optimistic UI update not ideal here as it takes time, just show loading spinner on button or change state
    setIsProcessing(true); // We reuse this or create specific one
    
    try {
      const content = await rebuildResume(fileData, jobDescription, analysisResult);
      setRebuiltContent(content);
      setAppState('rebuilt');
    } catch (error) {
      console.error(error);
      alert("Rebuild failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setAppState('upload');
    setFileData(null);
    setJobDescription('');
    setAnalysisResult(null);
    setRebuiltContent('');
  };

  return (
    <Layout darkMode={darkMode} toggleTheme={toggleTheme}>
      <div className="w-full h-full">
        {appState === 'upload' && (
          <UploadSection onAnalyze={handleAnalyze} isAnalyzing={false} />
        )}
        
        {appState === 'analyzing' && (
           <UploadSection onAnalyze={handleAnalyze} isAnalyzing={true} />
        )}

        {appState === 'results' && analysisResult && (
          <AnalysisDashboard 
            result={analysisResult} 
            onRebuild={handleRebuild}
            isRebuilding={isProcessing}
            onReset={handleReset}
          />
        )}

        {appState === 'rebuilt' && (
          <RebuildPreview 
            markdownContent={rebuiltContent} 
            onBack={() => setAppState('results')} 
          />
        )}
      </div>
    </Layout>
  );
};

export default App;