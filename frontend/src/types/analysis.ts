export interface NutritionSummary {
  calories?: number;
  protein?: number;
  fat?: number;
  sugar?: number;
  carbohydrates?: number;
  sodium?: number;
  [key: string]: number | undefined;
}

export interface AnalysisDetail {
  nutrition_summary: NutritionSummary;
  risk_score: number;
  risk_level: string;
  flagged_ingredients: string[];
  analysis: string;
  recommendation: string;
  alternatives: string[];
  error?: string;
}

export interface AnalysisResult {
  success: boolean;
  ocr_status: string;
  product_name: string;
  analysis: AnalysisDetail;
}
