import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';

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
  workspaces,
  folders,
  onSave,
  onCancel,
  buttonRef,
  dataList,
  dataMap,
}) => {
  console.log('dataList', dataList);
  console.log('dataMap', dataMap);

  const findFolders = useCallback(
    space => folders?.filter(folder => folder.space === space) || [],
    [folders]
  );

  const renderContent = useMemo(() => {
    const selectedTab = dataList.find(item => item.space === tab);
    const space = selectedTab ? selectedTab.space : '';
    const icon = selectedTab ? selectedTab.icon : null;

    let content;
    console.log('selectedTab', selectedTab);
    console.log('space', space);
    console.log('icon', icon);
    console.log('content', content);

    // Update switch cases to use string identifiers
    switch (tab) {
      case 'workspaces':
        content = (
          <Workspace space="workspaces" folders={folders} data={workspaces} />
        );
        break;
      case 'chatSessions':
        content = (
          <ChatSession
            space="chatSessions"
            folders={findFolders('chatSessions')}
            data={dataMap['chatSessions']}
          />
        );
        break;
      case 'assistants':
        content = (
          <Assistants
            space="assistants"
            folders={findFolders('assistants')}
            data={dataMap['assistants']}
          />
        );
        break;
      case 'prompts':
        content = (
          <Prompts
            space="prompts"
            folders={findFolders('prompts')}
            data={dataMap['prompts']}
          />
        );
        break;
      case 'files':
        content = (
          <Files
            space="files"
            folders={findFolders('files')}
            data={dataMap['files']}
          />
        );
        break;
      case 'user':
        content = <User data={user} />;
        break;
      default:
        content = <DefaultTab />;
    }

    return { space, icon, content };
  }, [dataList, tab, folders, workspaces, findFolders, dataMap, user]);

  const { space, icon, content } = renderContent;

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

const DefaultTab = () => <div style={{ color: 'white' }}></div>;

SidebarContent.propTypes = {
  user: PropTypes.object.isRequired,
  workspaces: PropTypes.array.isRequired,
  folders: PropTypes.array.isRequired,
  dataList: PropTypes.array.isRequired,
  dataMap: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  buttonRef: PropTypes.object.isRequired,
};

export default React.memo(SidebarContent);
