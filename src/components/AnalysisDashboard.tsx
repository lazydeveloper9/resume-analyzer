import React from 'react';
import { AnalysisResult } from '../types';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { CheckCircle, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { AtsSimulationReport } from './AtsSimulationReport';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  onRebuild: () => void;
  isRebuilding: boolean;
  onReset: () => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, onRebuild, isRebuilding, onReset }) => {
  const scoreData = [{ name: 'Score', value: result.overallScore, fill: result.overallScore >= 70 ? '#10b981' : result.overallScore >= 50 ? '#f59e0b' : '#ef4444' }];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Analysis Results</h2>
          <p className="text-slate-500 dark:text-slate-400">Here's how your resume stacks up.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onReset}
            className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
          >
            Upload New
          </button>
          <button
            onClick={onRebuild}
            disabled={isRebuilding}
            className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-semibold shadow-lg shadow-brand-500/30 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
             {isRebuilding ? (
               <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Rebuilding...
               </>
             ) : (
               <>Rebuild Resume <ArrowRight size={18} /></>
             )}
          </button>
        </div>
      </div>

      {/* Top Cards: Score, Summary, ATS */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Overall Score */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Match Score</h3>
          <div className="h-40 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={15} data={scoreData} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={30} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className={`text-4xl font-extrabold ${getScoreColor(result.overallScore)}`}>
                {result.overallScore}%
              </span>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Executive Summary</h3>
          <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
            {result.matchSummary}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4">
             <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <span className="text-xs text-slate-500 font-bold block mb-1">ATS COMPATIBILITY</span>
                <div className="flex items-end gap-2">
                  <span className={`text-2xl font-bold ${getScoreColor(result.atsCompatibility.score)}`}>{result.atsCompatibility.score}%</span>
                  <span className="text-xs text-slate-400 mb-1">Pass Rate</span>
                </div>
             </div>
             <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <span className="text-xs text-slate-500 font-bold block mb-1">FORMATTING</span>
                <div className="flex items-end gap-2">
                  <span className={`text-2xl font-bold ${getScoreColor(result.formattingAnalysis.score)}`}>{result.formattingAnalysis.score}%</span>
                  <span className="text-xs text-slate-400 mb-1">Structure Score</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* NEW: ATS Simulation Module */}
      {result.atsSimulation && (
        <AtsSimulationReport data={result.atsSimulation} />
      )}

      {/* Skills Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-emerald-600 flex items-center gap-2">
            <CheckCircle size={20} /> Matched Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.skillsMatch.matched.length > 0 ? (
              result.skillsMatch.matched.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium border border-emerald-100 dark:border-emerald-800/30">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-slate-400 italic">No direct skill matches found.</span>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-red-500 flex items-center gap-2">
            <XCircle size={20} /> Missing Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.skillsMatch.missing.length > 0 ? (
              result.skillsMatch.missing.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full text-sm font-medium border border-red-100 dark:border-red-800/30">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-slate-400 italic">All required skills present!</span>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Feedback Accordion-ish list */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Detailed Section Feedback</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {result.sectionFeedback.map((section, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">{section.sectionName}</h4>
                <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                  section.score >= 80 ? 'bg-green-100 text-green-700' : 
                  section.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {section.score}/100
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                {section.feedback}
              </p>
              <div className="flex gap-2 items-start">
                 <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                 <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                   {section.improvementSuggestion}
                 </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};