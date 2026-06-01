export interface AnalysisResult {
  ocr_text: string;
  analysis: {
    nutrition_summary: {
      calories: string;
      protein: string;
      sugar: string;
      fat: string;
    };
    risk_score: number;
    analysis: string;
    recommendation: string;
    alternatives: string[];
    error?: string;
  };
}
