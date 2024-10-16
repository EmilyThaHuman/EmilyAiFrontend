import { Box, IconButton, Typography, useMediaQuery } from '@mui/material';
import { uniqueId } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FaSave } from 'react-icons/fa';
import { settingsApi } from 'api/Ai/chat-items';
import { attachmentsApi } from 'api/Ai/chat-sessions';
import { RCTabs } from 'components/themed';
import { useChatStore } from 'contexts/ChatProvider';
import { useMode } from 'hooks';
import { useFileStructure } from 'hooks/chat/useFileStructure';
import { useTabManager } from 'hooks/chat/useTabManager';
import {
  AddPrompt,
  EditPrompt,
  FileManagementSidebar,
  PromptSuggest,
} from './items';
import { useFileManagement } from './items/sidebar-items/useFileManagement';

export const Prompts = props => {
  const { space = 'prompts', folders = [], files = [], data = [] } = props;
  const { theme } = useMode();
  const {
    actions: { setPrompts, setSelectedPrompt },
  } = useChatStore();
  const {
    fileStructure,
    isLoading: fileStructureLoading = false,
    error,
    refreshFileStructure,
    setFileStructure,
  } = useFileStructure(space.toLowerCase());
  const { activeTabs, selectedTab, selectTab } = useTabManager('prompts');
  const { selectedFolder } = useFileManagement();
  const [promptFiles, setPromptFiles] = useState(files || []);
  const [localPrompts, setLocalPrompts] = useState(data || []);
  const [isLoading, setIsLoading] = useState(fileStructureLoading);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const jsonPrompts = await settingsApi.getPromptFiles();
      const promptsFolder = folders.find(
        item => item.space === 'prompts' && item.prompts
      );
      const folderId = promptsFolder[0]._id;
      const mappedPrompts = jsonPrompts.map(file => ({
        userId: sessionStorage.getItem('userId'),
        workspaceId: sessionStorage.getItem('workspaceId'),
        folderId: promptsFolder[0]._id || null,
        name: file.name,
        content: file.content,
        role: file.role,
        description: file.description,
        type: 'prompt',
        space: 'prompts',
        id: uniqueId('temp-id'),
        // relativePath: relativePath,
      }));

      setLocalPrompts(jsonPrompts);
      console.log('PROMPT FOLDERS', promptsFolder);

      const promptFiles = [...mappedPrompts];
      console.log('PROMPT FILES', promptFiles);

      const formattedFolder = {
        ...promptsFolder,
        space: space.toLowerCase(),
        name: promptsFolder.name,
        type: 'folder',
        children: [...promptFiles],
        userId: sessionStorage.getItem('userId'),
        workspaceId: sessionStorage.getItem('workspaceId'),
        path: `/${promptsFolder.name}`,
        level: 0,
      };
      // Update file structure with the folder
      setFileStructure(prev => {
        if (folderId) {
          return prev.map(item =>
            item._id === folderId && item.space === 'prompts'
              ? { ...item, children: [...item.children, ...promptFiles] } // Fixed logic to spread promptFiles
              : item
          );
        } else {
          return [...prev, formattedFolder]; // If folder doesn't exist, add the formatted folder
        }
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [folders, setFileStructure, space]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const uploadPromptAsFile = useCallback(
    async promptData => {
      try {
        const fileContent = JSON.stringify(promptData);
        const fileName = `${promptData.name}.json`;
        const fileBlob = new Blob([fileContent], { type: 'application/json' });
        const fileToUpload = new File([fileBlob], fileName, {
          type: 'application/json',
        });
        const firstFolder = fileStructure.find(item => item.type === 'folder');
        const promptFolderId = firstFolder ? firstFolder.id : null;

        const uploadedFile = await attachmentsApi.uploadFile(fileToUpload, {
          name: fileName,
          userId: sessionStorage.getItem('userId'),
          workspaceId: sessionStorage.getItem('workspaceId'),
          folderId: promptFolderId,
          fileId: 'local',
          space: 'prompts',
          contentType: 'application/json',
          size: fileToUpload.size,
        });

        const newFile = {
          ...uploadedFile,
          id: uploadedFile._id,
          name: fileName,
          type: 'prompts',
          space: 'prompts',
          path: uploadedFile.path,
        };

        await attachmentsApi.createFile(newFile);
        refreshFileStructure();
      } catch (error) {
        console.error('Error uploading prompt as file:', error);
      }
    },
    [fileStructure, refreshFileStructure]
  );

  const handleSavePrompt = useCallback(
    async promptData => {
      try {
        const userId = sessionStorage.getItem('userId');
        const workspaceId = sessionStorage.getItem('workspaceId');
        const commonData = {
          userId,
          workspaceId,
          folderId: selectedFolder.id || null,
          name: promptData.name,
          content: promptData.content,
          role: promptData.role,
          description: promptData.description,
        };

        const savedPrompt = editingPrompt
          ? await settingsApi.updatePrompt({
              id: editingPrompt.id,
              ...commonData,
            })
          : await settingsApi.createPrompt({
              ...commonData,
              folderId: folders[0].id,
            });

        setLocalPrompts(prevPrompts => {
          const updatedPrompts = editingPrompt
            ? prevPrompts.map(p =>
                p.id === editingPrompt.id ? savedPrompt : p
              )
            : [...prevPrompts, savedPrompt];
          setPrompts(updatedPrompts);
          localStorage.setItem('customPrompts', JSON.stringify(updatedPrompts));
          return updatedPrompts;
        });

        await uploadPromptAsFile(savedPrompt);

        setEditingPrompt(null);
        selectTab(0); // Return to list view
      } catch (error) {
        console.error('Failed to save prompt:', error);
      }
    },
    [
      selectedFolder.id,
      editingPrompt,
      folders,
      uploadPromptAsFile,
      selectTab,
      setPrompts,
    ]
  );

  const handleEditPrompt = useCallback(
    prompt => {
      setEditingPrompt(prompt);
      selectTab(2); // Switch to edit tab
    },
    [selectTab]
  );

  const handleImportPromptTemplate = useCallback(
    jsonData => {
      try {
        const parsedData = JSON.parse(jsonData);
        setLocalPrompts(prevPrompts => {
          const updatedPrompts = [...prevPrompts];
          parsedData.forEach(item => {
            if (
              !prevPrompts.some(
                p => p.name === item.name || p.content === item.content
              )
            ) {
              updatedPrompts.push(item);
            } else {
              console.warn(`Skipped duplicate prompt: ${item.name}`);
            }
          });
          setPrompts(updatedPrompts);
          localStorage.setItem('customPrompts', JSON.stringify(updatedPrompts));
          return updatedPrompts;
        });
        alert('Import successful');
      } catch (error) {
        console.error('Invalid JSON format:', error);
        alert('Invalid JSON format, please check');
      }
    },
    [setPrompts]
  );

  const exportPromptTemplate = useCallback(() => {
    const jsonDataStr = JSON.stringify(localPrompts);
    const blob = new Blob([jsonDataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ChatGPTPromptTemplate.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [localPrompts]);

  const ErrorFallback = ({ error }) => (
    <div>
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
    </div>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case 0:
        return (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <FileManagementSidebar
              initialFolders={folders}
              initialFiles={promptFiles}
              space={space}
              onEditPrompt={handleEditPrompt}
            />
          </ErrorBoundary>
        );
      case 1:
        return <AddPrompt onSave={handleSavePrompt} />;
      case 2:
        return (
          <EditPrompt prompt={editingPrompt} onUpdate={handleSavePrompt} />
        );
      case 3:
        return (
          <PromptSuggest
            prompts={localPrompts}
            setPrompts={setLocalPrompts}
            onImport={handleImportPromptTemplate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <RCTabs
        value={selectedTab}
        onChange={(e, newValue) => selectTab(newValue)}
        tabs={activeTabs}
        variant="darkMode"
      />
      <Box mt={2} display="flex" alignItems="center">
        {renderContent()}
      </Box>
    </>
  );
};

export default Prompts;
