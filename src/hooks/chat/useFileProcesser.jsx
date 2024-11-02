import mammoth from 'mammoth';
import { useCallback, useRef, useState } from 'react';

import { useTipTapEditor } from '@/hooks';
import { toast } from '@/services/toastService';
import constants from 'config/constants';
import { useChatStore } from 'contexts';

export const ACCEPTED_FILE_TYPES = [
  'text/csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/json',
  'text/markdown',
  'application/pdf',
  'text/plain',
  'text/javascript',
].join(',');
const { OPENAI_ACCEPTED_FILE_TYPES, OPENAI_ACCEPTED_FILE_EXTENSIONS } =
  constants;

export const useFileProcesser = () => {
  const {
    state: { files, chatFiles, newMessageFiles },
    actions: {
      setNewMessageImages,
      setNewMessageFiles,
      setShowFilesDisplay,
      setFiles,
      setChatFiles,
      setUseRetrieval,
    },
  } = useChatStore();
  const [filesToAccept] = useState(ACCEPTED_FILE_TYPES);
  const fileInputRef = useRef();
  const { editor } = useTipTapEditor();

  const generateUniqueId = () => '_' + Math.random().toString(36).substr(2, 9);

  const readFile = useCallback((file, readAs) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = error =>
        reject(`Error reading file ${file.name}: ${error.message}`);

      switch (readAs) {
        case 'ArrayBuffer':
          fileReader.readAsArrayBuffer(file);
          break;
        case 'DataURL':
          fileReader.readAsDataURL(file);
          break;
        case 'Text':
          fileReader.readAsText(file);
          break;
        default:
          reject(new Error(`Unsupported read type: ${readAs}`));
      }
    });
  }, []);

  const handleFileType = useCallback(
    async (file, fileType) => {
      try {
        switch (fileType) {
          case 'image': {
            const dataUrl = await readFile(file, 'DataURL');
            setNewMessageImages(prev => [
              ...prev,
              { name: file.name, url: dataUrl },
            ]);
            return dataUrl;
          }
          case 'pdf': {
            const arrayBuffer = await readFile(file, 'ArrayBuffer');
            // Implement actual PDF parsing here
            const content = `Extracted text from ${file.name}`;
            return content;
          }
          case 'docx': {
            const arrayBuffer = await readFile(file, 'ArrayBuffer');
            const { value: content } = await mammoth.extractRawText({
              arrayBuffer,
            });
            return content;
          }
          case 'text': {
            const text = await readFile(file, 'Text');
            return text;
          }
          default:
            throw new Error('Unsupported file type');
        }
      } catch (error) {
        throw new Error(
          `Failed to process file ${file.name}: ${error.message}`
        );
      }
    },
    [readFile, setNewMessageImages]
  );

  const handleAcceptedFileType = useCallback(file => {
    const fileExtension = `.${file.name.split('.').pop().toLowerCase()}`;
    const acceptedExtensions = OPENAI_ACCEPTED_FILE_EXTENSIONS;
    const acceptedTypes = OPENAI_ACCEPTED_FILE_TYPES;

    for (const [key, extensions] of Object.entries(acceptedExtensions)) {
      if (extensions.includes(fileExtension)) {
        return key;
      }
    }

    for (const [key, types] of Object.entries(acceptedTypes)) {
      if (types.includes(file.type)) {
        return key;
      }
    }

    return null;
  }, []);

  const validateFileSize = useCallback((file, maxSizeMB = 5) => {
    const fileSizeMB = file.size / (1024 * 1024);
    return fileSizeMB <= maxSizeMB;
  }, []);

  const handleSelectDeviceFile = useCallback(
    async (file, isChatMessageFile = false) => {
      setShowFilesDisplay(isChatMessageFile);
      setUseRetrieval(true);

      if (!file) return;

      if (!validateFileSize(file)) {
        toast.error(`File ${file.name} exceeds the maximum size limit.`, {
          duration: 5000,
        });
        return;
      }

      const fileType = handleAcceptedFileType(file);
      if (!fileType) {
        toast.error(`Unsupported file type ${file.type}`, {
          duration: 5000,
        });
        return;
      }

      const fileId = generateUniqueId();
      const newFile = {
        id: fileId,
        name: file.name,
        type: fileType,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        originalFileType: file.type,
      };

      setNewMessageFiles(prevFiles => [...prevFiles, newFile]);

      try {
        const content = await handleFileType(file, fileType);

        const processedFile = {
          ...newFile,
          data: content,
        };

        if (isChatMessageFile) {
          setChatFiles(prevFiles => [...prevFiles, processedFile]);
        } else {
          setFiles(prevFiles => [...prevFiles, processedFile]);
        }

        // Update newMessageFiles with the processed file
        setNewMessageFiles(prevFiles =>
          prevFiles.map(fileItem =>
            fileItem.id === fileId ? processedFile : fileItem
          )
        );
      } catch (error) {
        toast.error(error.message, {
          duration: 10000,
        });

        // Rollback state changes
        setNewMessageImages(prev => prev.filter(img => img.id !== fileId));
        setNewMessageFiles(prev =>
          prev.filter(fileItem => fileItem.id !== fileId)
        );
        if (isChatMessageFile) {
          setChatFiles(prev => prev.filter(fileItem => fileItem.id !== fileId));
        } else {
          setFiles(prev => prev.filter(fileItem => fileItem.id !== fileId));
        }
      }
    },
    [
      setShowFilesDisplay,
      setUseRetrieval,
      handleAcceptedFileType,
      handleFileType,
      setNewMessageFiles,
      setNewMessageImages,
      setChatFiles,
      setFiles,
      validateFileSize,
    ]
  );

  const handleRemoveFile = useCallback(
    fileId => {
      setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
      setChatFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
      setNewMessageFiles(prevFiles =>
        prevFiles.filter(file => file.id !== fileId)
      );
      setNewMessageImages(prevImages =>
        prevImages.filter(image => image.id !== fileId)
      );
    },
    [setFiles, setChatFiles, setNewMessageFiles, setNewMessageImages]
  );
  return {
    handleSelectDeviceFile,
    handleRemoveFile,
    fileInputRef,
    filesToAccept,
  };
};

export default useFileProcesser;
