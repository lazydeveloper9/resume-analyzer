import React from 'react';
import { AtsSimulation } from '../types';
import { AlertTriangle, Check, X, Server, Search, FileWarning, ShieldCheck } from 'lucide-react';

interface AtsSimulationReportProps {
  data: AtsSimulation;
}

export const AtsSimulationReport: React.FC<AtsSimulationReportProps> = ({ data }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'high': return 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800';
      default: return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
            <Server size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">ATS Simulation Report</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Simulated parsing and keyword analysis</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="text-right">
             <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Readability</div>
             <div className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-1 border ${getStatusColor(data.parseabilityStatus)}`}>
               {data.parseabilityStatus.toUpperCase()}
             </div>
           </div>
           <div className="text-right pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">ATS Score</div>
              <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{data.score}/100</div>
           </div>
        </div>
      </div>

      <div className="p-6 grid md:grid-cols-2 gap-8">
        {/* Left Column: Risks & Recommendations */}
        <div className="space-y-6">
          
          {/* Structural Risks */}
          <div>
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileWarning size={16} /> Parsing Risks
            </h4>
            {data.structuralRisks.length > 0 ? (
              <ul className="space-y-2">
                {data.structuralRisks.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                    <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
                    <span className="text-sm text-red-700 dark:text-red-300 font-medium">{risk}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                <ShieldCheck className="text-emerald-500 shrink-0" size={18} />
                <span className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">No major structural risks detected.</span>
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Fix Recommendations</h4>
            <ul className="space-y-2">
              {data.recommendations.map((rec, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <div className="min-w-[6px] h-[6px] rounded-full bg-brand-500 mt-2"></div>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Keyword Analysis */}
        <div>
           <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Search size={16} /> Keyword Frequency Analysis
            </h4>
            
            <div className="bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="max-h-[300px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-left sticky top-0">
                    <tr>
                      <th className="px-4 py-2 font-medium">Keyword</th>
                      <th className="px-4 py-2 font-medium">Importance</th>
                      <th className="px-4 py-2 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {data.keywordMatch.map((k, i) => (
                      <tr key={i} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{k.keyword}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            k.importance.toLowerCase() === 'critical' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                            k.importance.toLowerCase() === 'high' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                            'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            {k.importance}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {k.foundInResume ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                              <Check size={14} /> FOUND
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-500 dark:text-red-400 font-bold text-xs">
                              <X size={14} /> MISSING
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {data.missingCriticalKeywords.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg">
                <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-1">MISSING CRITICAL KEYWORDS:</p>
                <div className="flex flex-wrap gap-1">
                  {data.missingCriticalKeywords.map((k, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-white dark:bg-slate-800 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/50 rounded shadow-sm">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};