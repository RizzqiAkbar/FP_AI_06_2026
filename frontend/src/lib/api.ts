import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const analyzeFood = async (imageFile: File, userProfile: any) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('user_profile', JSON.stringify(userProfile));

  try {
    const response = await axios.post(`${API_URL}/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing food:', error);
    throw error;
  }
};
