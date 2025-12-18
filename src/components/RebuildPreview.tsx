import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, ArrowLeft, Check, Copy } from 'lucide-react';

interface RebuildPreviewProps {
  markdownContent: string;
  onBack: () => void;
}

export const RebuildPreview: React.FC<RebuildPreviewProps> = ({ markdownContent, onBack }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([markdownContent], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = "optimized-resume.md";
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Analysis
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            {copied ? "Copied" : "Copy Text"}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg shadow-md transition-colors"
          >
            <Download size={18} /> Download Markdown
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
            <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <span className="text-sm font-mono text-slate-400">optimized-resume.md</span>
            <div className="w-10"></div> {/* Spacer for balance */}
        </div>
        <div className="p-8 md:p-12 overflow-y-auto max-h-[800px] prose dark:prose-invert prose-slate max-w-none">
          <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};