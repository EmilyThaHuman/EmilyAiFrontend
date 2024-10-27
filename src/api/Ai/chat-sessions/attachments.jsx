import { toast } from 'sonner';

import { apiUtils } from '@/lib/apiUtils';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB size limit

// Helper function to prepare form data
const prepareFormData = (file, payload) => {
  const formData = new FormData();
  formData.append('file', file);
  Object.entries(payload).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });
  return formData;
};

// Helper function for validating file size
const validateFileSize = (file, sizeLimit = MAX_FILE_SIZE) => {
  if (!file) {
    throw new Error('File is required');
  }
  if (file.size > sizeLimit) {
    throw new Error(
      `File must be less than ${Math.floor(sizeLimit / 1000000)}MB`
    );
  }
};

// Helper function for logging and rethrowing errors
const handleError = (error, context = '') => {
  console.error(`Error ${context}:`, error.message || error);
  throw error;
};
export const attachmentsApi = {
  // -------------------------- //
  // --- Storage Functions ---  //
  // -------------------------- //
  // In your upload service code
  uploadFile: async (file, payload, onUploadProgress) => {
    try {
      const { name, userId, fileId, workspaceId, folderId, space } = payload;
      const SIZE_LIMIT = 10 * 1024 * 1024; // 10MB size limit

      if (!file) {
        throw new Error('File is required');
      }

      if (!name || !userId || !fileId) {
        throw new Error('File name, userId, and fileId are required');
      }

      validateFileSize(file);

      const formData = prepareFormData(file, {
        name,
        userId,
        fileId,
        workspaceId,
        folderId,
        space,
      });

      // API request
      const response = await apiUtils.post('/chat/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
          if (onUploadProgress) {
            onUploadProgress(progressEvent);
          }
        },
      });

      console.log('UPDATED', response);

      // Check if the response is valid and contains a file path
      if (!response?.message || !response?.file) {
        throw new Error('No response or file path received from the server');
      }

      console.log(`File uploaded successfully: ${response.message}`);
      toast(`File uploaded successfully: ${response.message}`);
      return response.file;
    } catch (error) {
      handleError(error, 'uploading file');
      throw error; // Rethrow the error to be handled in the calling function
    }
  },
  getFileFromStorage: async filePath => {
    try {
      const response = await apiUtils.get(`/chat/files${filePath}`, {
        responseType: 'blob',
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error('Error fetching file:', error.message || error);
      throw error;
    }
  },
  deleteFileFromStorage: async filePath => {
    try {
      const response = await apiUtils.delete(`/chat/files/${filePath}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting file:', error.message || error);
      throw error;
    }
  },
  getAllStoredFiles: async () => {
    try {
      const response = await apiUtils.get(
        `/chat/files/${sessionStorage.getItem('userId')}`
      );
      console.log('RES', response);
      console.log('FILES', response.files);
      return response.files;
    } catch (error) {
      console.error('Error fetching all stored files:', error);
      throw error;
    }
  },
  getStoredFilesByType: async type => {
    try {
      const response = await apiUtils.get(`/chat/files/type/${type}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching stored files of type ${type}:`, error);
      throw error;
    }
  },
  getStoredFilesBySpace: async space => {
    console.log('SPACE', space);
    try {
      const response = await apiUtils.get(
        `/chat/files/space/${encodeURIComponent(space)}`
      );
      console.log('RES', response);
      console.log('FILES', response.files);
      return response.files;
    } catch (error) {
      console.error(`Error fetching stored files for space ${space}:`, error);
      throw error;
    }
  },
  getStoredFileByName: async filename => {
    try {
      const response = await apiUtils.get(`/chat/files/name/${filename}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching stored file ${filename}:`, error);
      throw error;
    }
  },
  getStoredFileById: async fileId => {
    try {
      const response = await apiUtils.get(`/chat/files/fileId/${fileId}`, {
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      console.error('Error fetching file:', error.message || error);
      throw error;
    }
  },
  getStoredFileByPath: async filePath => {
    try {
      const response = await apiUtils.get(`/chat/files/path${filePath}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching file:', error.message || error);
      throw error;
    }
  },
  getStoredFileByUserId: async userId => {
    try {
      const response = await apiUtils.get(`/chat/files/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching file:', error.message || error);
      throw error;
    }
  },
  upsertFileData: async vectorDocData => {
    try {
      const data = await apiUtils.post(
        `/chat/files/upsert-docs`,
        vectorDocData,
        {
          timeout: 90000,
        }
      );
      return data;
    } catch (error) {
      console.error('Error fetching chat file data:', error);
      throw error;
    }
  },
  getAllFiles: async () => {
    try {
      const data = await apiUtils.get('/chat/files/static/list');
      return data;
    } catch (error) {
      console.error('Error fetching chat presets:', error);
      throw error;
    }
  },
  getAllImages: async () => {
    try {
      const fileTypes = 'png';
      const data = await apiUtils.get(`/chat/files/static/${fileTypes}`);
      return data;
    } catch (error) {
      console.error('Error fetching chat presets:', error);
      throw error;
    }
  },
  fetchChatFileData: async () => {
    try {
      const data = await apiUtils.get(`/files/list-files`);
      return data;
    } catch (error) {
      console.error('Error fetching chat file data:', error);
      throw error;
    }
  },
  createFile: async fileRecord => {
    try {
      const data = await apiUtils.post('/chat/files', fileRecord);
      return data;
    } catch (error) {
      console.error('Error creating file:', error);
      throw error;
    }
  },
  createFileWorkspace: async items => {
    try {
      const data = await apiUtils.post('/chat/file_workspaces', items);
      return data;
    } catch (error) {
      console.error('Error creating file workspace:', error);
      throw error;
    }
  },
  updateFile: async (id, fileRecord) => {
    try {
      const data = await apiUtils.put(`/chat/files/${id}`, fileRecord);
      return data;
    } catch (error) {
      console.error('Error updating file:', error);
      throw error;
    }
  },
  deleteFile: async id => {
    try {
      const data = await apiUtils.delete(`/chat/files/${id}`);
      return data;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },
  deleteFileWorkspace: async id => {
    try {
      const data = await apiUtils.delete(`/chat/file_workspaces/${id}`);
      return data;
    } catch (error) {
      console.error('Error deleting file workspace:', error);
      throw error;
    }
  },
  getFileRetrievalProcess: async fileId => {
    try {
      const data = await apiUtils.get(`/chat/file/retrieval/process/${fileId}`);
      return data;
    } catch (error) {
      console.error('Error fetching file retrieval process:', error);
      throw error;
    }
  },
  createMessage: async messageData => {
    try {
      const data = await apiUtils.post('/chat/messages', messageData);
      return data;
    } catch (error) {
      console.error('Error creating chat message:', error);
      throw error;
    }
  },
  updateMessage: async (id, messageData) => {
    try {
      const data = await apiUtils.put(`/chat/messages/${id}`, messageData);
      return data;
    } catch (error) {
      console.error(`Error updating chat message with id ${id}:`, error);
      throw error;
    }
  },
};

export default attachmentsApi;
