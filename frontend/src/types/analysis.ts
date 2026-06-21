export interface AnalysisResult {
  ocr_text: string;
  nutrition_data?: {
    calories?: number;
    protein?: number;
    sugar?: number;
    fat?: number;
  };
  analysis: {
    nutrition_summary?: {
      calories?: number;
      protein?: number;
      sugar?: number;
      fat?: number;
    };
    risk_score: number | string;
    analysis: string;
    recommendation: string;
    alternatives: string[];
    error?: string;
  };
}
