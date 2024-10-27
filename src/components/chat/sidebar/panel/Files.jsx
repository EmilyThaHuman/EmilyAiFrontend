import { Box } from '@mui/material';
import { FileIcon } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';

import { SidebarPanelContainer } from 'components/chat/styled';
import { RCTabs } from 'components/themed';
import { useTabManager } from 'hooks/chat/useTabManager';

import { EditFile, FileInfo, FileUpsert, useFileEditor } from './items';
import { FileDirectory } from './items/sidebar-items/components/sidebar-file-directory';

export const Files = props => {
  const { folders = [], data = [], space = 'files' } = props;

  const { activeTabs, selectedTab, selectTab } = useTabManager('files');
  const {
    fileName,
    fileContent,
    fileDescription,
    fileInfo,
    editingFile, // Method to set the file for editing
    selectedItem,
    setEditingFile,
    setFileName,
    setFileContent,
    setFileDescription,
    setFileInfo,
    setSelectedItem,
  } = useFileEditor();

  const ErrorFallback = ({ error }) => (
    <div>
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
    </div>
  );

  const handleEditFile = file => {
    setEditingFile(file);
    setFileName(file.name);
    setFileContent(file.content);
    setFileDescription(file.description);
    setFileInfo({
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
    });
    selectTab(1); // Switch to the Edit tab
  };

  const handleSaveFile = async () => {
    console.log('Saving file:', { fileName, fileContent, fileDescription });
    setEditingFile(null);
    selectTab(0); // Return to list view
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 0:
        console.log('Rendering FileDirectory');
        console.log('Folders:', folders);
        console.log('data:', data);
        console.log('space:', space);

        return (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <FileDirectory
              initialFolders={folders}
              initialItems={data}
              space={space}
              icon={<FileIcon />}
            />
          </ErrorBoundary>
        );
      case 1:
        return (
          <EditFile
            fileName={fileName}
            fileContent={fileContent}
            setFileName={setFileName}
            setFileContent={setFileContent}
            onSave={handleSaveFile}
            selectedFile={editingFile}
          />
        );
      case 2:
        return (
          <FileInfo
            fileDescription={fileDescription}
            setFileDescription={setFileDescription}
            file={editingFile}
          />
        );
      case 3:
        return <FileUpsert />;
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
        <SidebarPanelContainer>{renderContent()}</SidebarPanelContainer>
      </Box>
    </>
  );
};
export default Files;
