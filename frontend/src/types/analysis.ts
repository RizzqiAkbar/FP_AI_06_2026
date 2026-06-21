import { UserProfile } from './user';

export interface NutritionSummary {
  calories?: number;
  fat?: number;
  total_fat?: number;
  saturated_fat?: number;
  trans_fat?: number;
  cholesterol?: number;
  sodium?: number;
  total_carbohydrate?: number;
  dietary_fiber?: number;
  sugar?: number;
  protein?: number;
  serving_size?: number;
}

export interface AnalysisSection {
  nutrition_summary: NutritionSummary;
  risk_score: number | string;
  risk_level: string;
  flagged_ingredients: string[];
  analysis: string;
  recommendation: string;
  alternatives: string[];
  error?: string;
}

export interface AnalysisResult {
  success: boolean;
  ocr_status: 'success' | 'failed';
  ocr_text: string;
  product_name: string;
  user_profile: UserProfile;
  analysis: AnalysisSection;
  message?: string;
}
