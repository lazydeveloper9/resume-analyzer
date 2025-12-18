export interface FileData {
  base64: string;
  mimeType: string;
  name: string;
}

export interface SectionFeedback {
  sectionName: string;
  score: number;
  feedback: string;
  improvementSuggestion: string;
}

export interface AtsKeyword {
  keyword: string;
  importance: 'Critical' | 'High' | 'Medium';
  foundInResume: boolean;
  count?: number;
}

export interface AtsSimulation {
  score: number;
  parseabilityStatus: 'High' | 'Medium' | 'Low';
  structuralRisks: string[]; // e.g. "Double columns detected", "Images used for text"
  keywordMatch: AtsKeyword[];
  missingCriticalKeywords: string[];
  recommendations: string[];
}

export interface AnalysisResult {
  overallScore: number;
  matchSummary: string;
  skillsMatch: {
    matched: string[];
    missing: string[];
  };
  atsCompatibility: {
    score: number;
    issues: string[];
  };
  atsSimulation: AtsSimulation; // New detailed module
  formattingAnalysis: {
    score: number;
    issues: string[];
  };
  strengths: string[];
  weaknesses: string[];
  sectionFeedback: SectionFeedback[];
}

export type AppState = 'upload' | 'analyzing' | 'results' | 'rebuilding' | 'rebuilt';

export interface ToastMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}