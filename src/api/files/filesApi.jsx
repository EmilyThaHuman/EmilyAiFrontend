// client/src/services/api.js

const { default: apiUtils } = require('@/lib/apiUtils');
const FILE_ENDPOINT = '/files';

export const fileApiService = {
  uploadFile: async file => {
    try {
      const response = await apiUtils.post(`${FILE_ENDPOINT}/upload`, file, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },
  getAllFiles: async () => {
    try {
      const response = await apiUtils.get(`${FILE_ENDPOINT}/files`);
      return response.data;
    } catch (error) {
      console.error('Error fetching files:', error);
      throw error;
    }
  },
  getFileById: async id => {
    try {
      const response = await apiUtils.get(`${FILE_ENDPOINT}/files/${id}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching file:', error);
      throw error;
    }
  },
  downloadFile: async id => {
    try {
      const response = await apiUtils.get(
        `${FILE_ENDPOINT}/files/download/${id}`,
        {
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  },
};

export default fileApiService;
