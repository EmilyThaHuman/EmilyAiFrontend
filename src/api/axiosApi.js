import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000', // Adjust the baseURL to match your server's address
  headers: {
    'Content-Type': 'application/json',
  },
});

export const postData = async (url, instructions) => {
  try {
    const response = await apiClient.post('/api/crawl', { url, instructions });
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};
