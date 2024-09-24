import { Avatar, Box, IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AiIcon, FingerprintIcon, KeyIcon } from 'assets/humanIcons';
import ValidationIcon from 'components/themed/ValidationIcon';

const SidebarTabs = ({
  tab,
  handleSidebarOpen,
  isXs,
  isSidebarOpen,
  isValidApiKey,
  isAuthenticated,
  isMobile,
  sideBarWidthRef,
  theme,
  dataList,
}) => {
  const mainTabs = dataList.slice(0, 5);
  const bottomTabs = dataList.slice(5);
  return (
    <Box
      ref={sideBarWidthRef}
      sx={{
        transform: isMobile && !isSidebarOpen ? 'translateX(-100%)' : 'none',
        transition: 'transform 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0.5rem',
        backgroundColor: '#1C1C1C',
        color: 'white',
        borderRadius: '14px',
        height: 'calc(100vh - 8px)',
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

            {/* <item.icon style={sidebarIconStyle} /> */}
          </IconButton>
        </Tooltip>
      ))}

      {/* Validation icon */}
      {!isXs && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            backgroundColor: '#1C1C1C',
            alignSelf: 'flex-end',
            pt: '100%',
            mt: 'auto',
          }}
        >
          <ValidationIcon
            isValid={isValidApiKey}
            type="apiKey"
            IconComponent={KeyIcon}
          />
          <ValidationIcon
            isValid={isAuthenticated}
            type="authentication"
            IconComponent={FingerprintIcon}
          />
        </Box>
      )}

      {/* Spacer */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Bottom tabs (User and Home) */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          backgroundColor: '#1C1C1C',
          alignSelf: 'flex-end',
          pt: '100%',
          mt: 'auto',
        }}
      >
        {bottomTabs.map(item => (
          <Tooltip key={item.id} title={item.title} placement="right">
            <IconButton
              onClick={item.onClick} // Use each item's onClick handler
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
