// client/src/hooks/useFileViewer.js
import { useState, useEffect, useContext } from 'react';

// import {
//   getAllFiles as getAllFilesService,
//   getFileById as getFileByIdService,
//   downloadFile as downloadFileService,
// } from '../api/fileService';
import fileApiService from 'api/files/filesApi';

export const useFileViewer = () => {
  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [selectedFile, setSelectedFile] = useState({
    url: null,
    type: '',
    loading: false,
  });
  const { showError } = useContext(ErrorContext);

  const fetchFiles = async () => {
    setLoadingFiles(true);
    try {
      const response = await fileApiService.getAllFilesService();
      setFiles(response.data);
    } catch (error) {
      console.error('Fetch Files Error:', error);
      showError(
        error.response?.data?.error || 'An error occurred while fetching files.'
      );
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const viewFile = async id => {
    setSelectedFile({ url: null, type: '', loading: true });
    try {
      const response = await getFileByIdService(id);
      const fileURL = URL.createObjectURL(response.data);
      setSelectedFile({
        url: fileURL,
        type: response.headers['content-type'],
        loading: false,
      });
    } catch (error) {
      console.error('View File Error:', error);
      showError(
        error.response?.data?.error ||
          'An error occurred while viewing the file.'
      );
      setSelectedFile({ url: null, type: '', loading: false });
    }
  };

  const downloadFile = async (id, filename) => {
    try {
      const response = await downloadFileService(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download File Error:', error);
      showError(
        error.response?.data?.error ||
          'An error occurred while downloading the file.'
      );
    }
  };

  const clearSelectedFile = () => {
    if (selectedFile.url) {
      URL.revokeObjectURL(selectedFile.url);
    }
    setSelectedFile({ url: null, type: '', loading: false });
  };

  return {
    files,
    loadingFiles,
    fetchFiles,
    viewFile,
    downloadFile,
    selectedFile,
    clearSelectedFile,
  };
};

export default useFileViewer;
