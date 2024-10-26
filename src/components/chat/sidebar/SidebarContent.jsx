import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import {
  Workspace,
  ChatSession,
  Assistants,
  Prompts,
  Files,
  User,
} from './panel';
import { SidebarContentFooter } from './SidebarContentFooter';
import { SidebarContentHeader } from './SidebarContentHeader';

export const SidebarContent = ({
  tab,
  user,
  chatSessions,
  workspaces,
  prompts,
  files,
  assistants,
  folders,
  onSave,
  onCancel,
  buttonRef,
  dataList,
}) => {
  const findFolders = useCallback(
    space => folders?.filter(folder => folder.space === space) || [],
    [folders]
  );
  const renderContent = useCallback(() => {
    const selectedTab = dataList.find(item => item.id === tab);
    const space = selectedTab ? selectedTab.space : '';
    const icon = selectedTab ? selectedTab.icon : null;

    let content;
    switch (tab) {
      case 0:
        content = (
          <Workspace
            space="workspaces"
            folders={folders}
            files={files}
            data={workspaces}
          />
        );
        break;
      case 1:
        content = (
          <ChatSession
            space="chatSessions"
            folders={findFolders('chatSessions')}
            files={files}
            data={chatSessions}
          />
        );
        break;
      case 2:
        content = (
          <Assistants
            space="assistants"
            folders={findFolders('assistants')}
            files={files}
            data={assistants}
          />
        );
        break;
      case 3:
        content = (
          <Prompts
            space="prompts"
            folders={findFolders('prompts')}
            files={files}
            data={prompts}
          />
        );
        break;
      case 4:
        content = (
          <Files
            space="files"
            folders={findFolders('files')}
            files={files}
            data={files}
          />
        );
        break;
      case 5:
        content = <User data={user} />;
        break;
      default:
        content = <DefaultTab />;
    }

    return { space, icon, content };
  }, [
    tab,
    dataList,
    workspaces,
    folders,
    chatSessions,
    findFolders,
    files,
    assistants,
    prompts,
    user,
  ]);

  const { space, icon, content } = renderContent();
  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      maxHeight="100%"
      maxWidth="100%"
    >
      <Box flexGrow={1} overflow="auto" justifyContent="center">
        <SidebarContentHeader space={space} icon={icon} onSave={onSave} />

        {content}
        <SidebarContentFooter
          item={content.props.data}
          contentType={space?.toLowerCase()}
          onCancel={onCancel}
          onSave={onSave}
          buttonRef={buttonRef}
        />
      </Box>
    </Box>
  );
};

export const DefaultTab = () => <div style={{ color: 'white' }}></div>;

SidebarContent.propTypes = {
  user: PropTypes.object.isRequired,
  chatSessions: PropTypes.array.isRequired,
  workspaces: PropTypes.array.isRequired,
  prompts: PropTypes.array.isRequired,
  files: PropTypes.array.isRequired,
  assistants: PropTypes.array.isRequired,
  folders: PropTypes.array.isRequired,
};

export default SidebarContent;
