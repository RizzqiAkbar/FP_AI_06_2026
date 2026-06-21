import axios from 'axios';
import { AnalysisResult } from '../types/analysis';

const API_URL = 'http://localhost:5000/api';

export const analyzeFood = async (
  imageFiles: File[],
  userProfile: Record<string, unknown>
): Promise<AnalysisResult> => {
  const formData = new FormData();
  imageFiles.forEach(file => formData.append('image', file));
  formData.append('user_profile', JSON.stringify(userProfile));

  const response = await axios.post<AnalysisResult>(`${API_URL}/analyze`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
