import { Box } from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';

import { AssistantIcon } from 'assets/humanIcons';
import { RCTabs } from 'components/themed';
import { useTabManager } from 'hooks/chat/useTabManager';

import { AssistantDisplay } from './items/assistant-items/AssistantDisplay';
import { AssistantTemplates } from './items/assistant-items/AssistantTemplates';
import { AssistantTools } from './items/assistant-items/AssistantTools';
import { FileDirectory } from './items/sidebar-items/components';

export const Assistants = props => {
  const { folders = [], data = [], space = 'assistants' } = props;

  const { activeTabs, selectedTab, selectTab } = useTabManager('assistants');

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
            <FileDirectory
              initialFolders={folders}
              initialItems={data}
              space={space}
              icon={<AssistantIcon />}
            />
          </ErrorBoundary>
        );
      case 1:
        return <AssistantDisplay />;
      case 2:
        return <AssistantTemplates />;
      case 3:
        return <AssistantTools />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            mx: '12px',
          }}
        >
          Assistants
        </Typography>
        <IconButton>
          <AssistantIcon style={{ float: 'right', cursor: 'pointer' }} />
        </IconButton>
      </Box> */}
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

export default Assistants;
