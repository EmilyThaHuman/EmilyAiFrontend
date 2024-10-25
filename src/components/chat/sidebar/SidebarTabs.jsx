import { Avatar, Box, IconButton, Tooltip, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

import { AiIcon, FingerprintIcon, KeyIcon } from 'assets/humanIcons';
import ValidationIcon from 'components/themed/ValidationIcon';

const MotionBox = motion(Box);

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
  const sidebarVariants = {
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'tween', duration: 0.3 },
    },
    hidden: {
      x: '-100%',
      opacity: 0,
      transition: { type: 'tween', duration: 0.3 },
    },
  };
  return (
    <MotionBox
      ref={sideBarWidthRef}
      variants={sidebarVariants}
      initial={isMobile ? 'hidden' : 'visible'}
      animate={isMobile && !isSidebarOpen ? 'hidden' : 'visible'}
      style={{ width: 'fit-content' }} // Allow width to adjust based on content
      aria-hidden={isMobile && !isSidebarOpen}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: isMobile && !isSidebarOpen ? '0' : '0.5rem',
        m: isMobile && !isSidebarOpen ? 0 : theme.spacing(1),
        height:
          isMobile && !isSidebarOpen
            ? '100vh'
            : 'calc(100vh - 2 * theme.spacing(1))', // Adjust height based on margin
        backgroundColor: '#1C1C1C',
        color: 'white',
        borderRadius: isMobile && !isSidebarOpen ? 0 : '14px',
        overflowY: 'auto',
        boxSizing: 'border-box',
        transform: isMobile && !isSidebarOpen ? 'translateX(-100%)' : 'none',
        transition: 'transform 0.3s ease-in-out',
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
    </MotionBox>
  );
};

export default SidebarTabs;
