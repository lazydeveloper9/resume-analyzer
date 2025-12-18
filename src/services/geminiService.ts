import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, FileData } from "../types";

// Helper to validate environment variable
const getApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) {
    throw new Error("API_KEY environment variable is missing.");
  }
  return key;
};

export const analyzeResume = async (
  fileData: FileData,
  jobDescription: string
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });

  const prompt = `
    You are an expert HR Recruitment Specialist and a Technical ATS (Applicant Tracking System) Auditor.
    
    Task 1: Content Analysis
    Analyze the provided resume against the Job Description:
    "${jobDescription}"
    
    Task 2: ATS Simulation
    Simulate a legacy ATS parser scan on the resume image/document.
    - Check for parsing blockers: complex tables, multi-column layouts, header/footer parsing issues, icons/graphics used as text, or unusual fonts.
    - Perform a strict KEYWORD EXTRACTION from the Job Description and check if they appear in the resume.
    - Rate the "System Readability".
    
    Provide a detailed structured analysis in JSON format containing:
    1. Overall match score (0-100).
    2. Skills match (semantic match).
    3. ATS Compatibility (general score).
    4. ATS SIMULATION: Detailed breakdown of structural risks, keyword frequency analysis, and specific fix recommendations.
    5. Formatting score.
    6. Detailed feedback for specific sections.

    Be critical. If the resume has two columns, flag it as a potential ATS risk.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: fileData.mimeType,
              data: fileData.base64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER, description: "0-100 score indicating fit" },
            matchSummary: { type: Type.STRING, description: "A brief 2-3 sentence summary of the fit." },
            skillsMatch: {
              type: Type.OBJECT,
              properties: {
                matched: { type: Type.ARRAY, items: { type: Type.STRING } },
                missing: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
            atsCompatibility: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER },
                issues: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
            atsSimulation: {
              type: Type.OBJECT,
              description: "Detailed ATS simulation results",
              properties: {
                score: { type: Type.INTEGER },
                parseabilityStatus: { type: Type.STRING, description: "High, Medium, or Low" },
                structuralRisks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List specific layout issues like Tables, Columns, Graphics" },
                keywordMatch: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      keyword: { type: Type.STRING },
                      importance: { type: Type.STRING, description: "Critical, High, or Medium" },
                      foundInResume: { type: Type.BOOLEAN },
                    }
                  }
                },
                missingCriticalKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["score", "parseabilityStatus", "structuralRisks", "keywordMatch", "missingCriticalKeywords", "recommendations"]
            },
            formattingAnalysis: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER },
                issues: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            sectionFeedback: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sectionName: { type: Type.STRING },
                  score: { type: Type.INTEGER },
                  feedback: { type: Type.STRING },
                  improvementSuggestion: { type: Type.STRING },
                },
              },
            },
          },
          required: ["overallScore", "matchSummary", "skillsMatch", "atsCompatibility", "atsSimulation", "formattingAnalysis", "strengths", "weaknesses", "sectionFeedback"],
        },
      },
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(response.text) as AnalysisResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Failed to analyze resume. Please try again.");
  }
};

export const rebuildResume = async (
  fileData: FileData,
  jobDescription: string,
  analysis: AnalysisResult
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });

  const prompt = `
    You are a Professional Resume Writer. 
    Rewrite the provided resume to perfectly target the following Job Description.
    
    Job Description:
    "${jobDescription}"
    
    Analysis Context (strengths to keep, weaknesses to fix):
    ${JSON.stringify(analysis.weaknesses)}
    
    ATS Issues to fix:
    ${JSON.stringify(analysis.atsSimulation.structuralRisks)}
    
    Instructions:
    1. Output ONLY the content in clean Markdown format.
    2. Keep the candidate's factual history (dates, companies, degrees) exactly as is. DO NOT hallucinate experience.
    3. Rewrite the Professional Summary to be impactful and keyword-rich for this job.
    4. Rewrite bullet points in the Experience section to use strong action verbs and quantify results where possible. Align them with the JD requirements.
    5. Reorganize skills to highlight relevant ones first.
    6. Ensure the tone is professional, confident, and concise.
    7. Structure with clear headers (# Summary, ## Experience, etc.).
    8. Remove any columns or complex tables to ensure high ATS compatibility.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: fileData.mimeType,
              data: fileData.base64,
            },
          },
          { text: prompt },
        ],
      },
    });

    return response.text || "Failed to generate resume text.";
  } catch (error) {
    console.error("Rebuild failed:", error);
    throw new Error("Failed to rebuild resume.");
  }
};