import { Avatar, Box, IconButton, Tooltip, useTheme } from '@mui/material';

import { AiIcon, FingerprintIcon, KeyIcon } from 'assets/humanIcons';
import ValidationIcon from 'components/themed/ValidationIcon';

export const SidebarTabs = ({
  tab,
  handleSidebarOpen,
  isXs,
  isSidebarOpen,
  isValidApiKey,
  isAuthenticated,
  isMobile,
  sideBarWidthRef,
  dataList,
}) => {
  const theme = useTheme();
  const mainTabs = dataList.slice(0, 5);
  const bottomTabs = dataList.slice(5);
  return (
    <Box
      ref={sideBarWidthRef}
      sx={{
        transition: 'transform 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0.5rem',
        backgroundColor: '#1C1C1C',
        color: 'white',
        borderRadius: '14px',
        height: '100vh', // Take full height of the screen
        overflowY: 'auto', // Ensure scrollable for smaller screens
      }}
    >
      <Avatar
        sx={{
          width: 40,
          height: 40,
          bgcolor: theme.palette.primary.main,
          marginBottom: '0.5rem',
        }}
      >
        <AiIcon sx={{ fontSize: 32, color: theme.palette.common.white }} />
      </Avatar>
      {mainTabs.map(item => (
        <Tooltip key={item.id} title={item.space} placement="right">
          <IconButton
            onClick={item.onClick} // Use each item's onClick handler
            onMouseOver={e => (e.currentTarget.style.color = 'white')}
            onMouseOut={e => (e.currentTarget.style.color = '#94a3b8')}
            sx={{
              mb: 1,
              backgroundColor:
                tab === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
              '& .MuiSvgIcon-root': {
                width: '32px',
                height: '32px',
                color: '#fff',
              },
            }}
          >
            {item.icon}
          </IconButton>
        </Tooltip>
      ))}

      <Box sx={{ flexGrow: 1 }} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          backgroundColor: '#1C1C1C',
          alignSelf: 'flex-end',
          mt: 'auto',
        }}
      >
        {bottomTabs.map(item => (
          <Tooltip key={item.id} title={item.title} placement="right">
            <IconButton
              onClick={item.onClick}
              sx={{
                mb: 1,
                backgroundColor:
                  tab === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                '& .MuiSvgIcon-root': {
                  width: '32px',
                  height: '32px',
                  color: '#fff',
                },
              }}
            >
              {item.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export default SidebarTabs;
