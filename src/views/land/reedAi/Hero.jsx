import {
  alpha,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  styled,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTypewriter, Cursor } from 'react-simple-typewriter';

import { Button } from '@/components/themed/RadixUi/button';
import routes from '@/routes/index';
import { useUserStore } from 'contexts/UserProvider';
import { useMode } from 'hooks/app';
import { analyzeRoutes } from 'utils/routing';

import ChatInput from './ChatInput';

const StyledMenuList = styled(props => (
  <MenuList
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 2,
    marginTop: theme.spacing(1),
    minWidth: 180,
    maxWidth: 350,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    backgroundColor: alpha('#000000', 0.8), // Very translucent black background
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
      display: 'flex',
      flexWrap: 'wrap',
    },
    '& .MuiMenuItem-root': {
      fontWeight: '400', // Adjust this to match ESLint text style
      color: '#FFFFFF', // Adjust this to match ESLint text style
      lineHeight: 1.5, // Adjust this to match ESLint text style
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export const Hero = () => {
  const { theme } = useMode();
  const [text] = useTypewriter({
    words: [
      'Create a responsive navbar',
      'Design a product card with hover effects',
      'Implement a dark mode toggle',
      'Build an animated loading spinner',
      'Refactor a class component to a functional one',
      'Style a form with Tailwind CSS',
      'Optimize React rendering with useMemo',
      'Add drag and drop functionality',
      'Create a multi-step form wizard',
      'Implement infinite scrolling',
    ],
    loop: 0,
    typeSpeed: 70,
    deleteSpeed: 50,
    delaySpeed: 1000,
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [menuItemsVisible, setMenuItemsVisible] = useState(false);
  const getInfoRef = useRef(null);
  const open = Boolean(anchorEl);
  const {
    state: { isAuthenticated },
    actions: { logout },
  } = useUserStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { routeInfo, routeInfoMap } = analyzeRoutes(routes);

  const handleClose = () => {
    setAnchorEl(null);
    setMenuVisible(false);
    setMenuExpanded(false);
    setMenuItemsVisible(false);
  };

  const handleClick = event => {
    if (open) {
      handleClose();
    } else {
      setAnchorEl(event.currentTarget);
      getInfoRef.current = routeInfo;
      setMenuVisible(true);
    }
  };

  useEffect(() => {
    const loggedIn = isAuthenticated;
    setIsLoggedIn(loggedIn);
  }, [isAuthenticated]);

  useEffect(() => {
    if (menuVisible) {
      setTimeout(() => {
        setMenuExpanded(true);
      }, 500); // Delay for initial visibility animation
    }
  }, [menuVisible]);

  useEffect(() => {
    if (menuExpanded) {
      setTimeout(() => {
        setMenuItemsVisible(true);
      }, 500); // Delay for menu items animation
    }
  }, [menuExpanded]);

  // Split routeData into two columns
  const half = Math.ceil(routeInfo.length / 2);
  const firstColumn = routeInfo.slice(0, half);
  const secondColumn = routeInfo.slice(half);

  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-5xl font-bold mb-6"
      >
        Your AI React Component Assistant
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-xl mb-8 h-20"
      >
        {text}
        <Cursor cursorStyle="_" />
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="w-full max-w-3xl"
      >
        <ChatInput />
      </motion.div>
      {/* More Info Button and Menu */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          width: '100%',
          maxWidth: '3xl',
          marginTop: 2,
        }}
      >
        <Button
          id="open-route-list-menu"
          aria-controls={open ? 'demo-customized-menu' : undefined}
          aria-haspopup="true"
          variant="ghost"
          className="text-white hover:text-black hover:bg-white"
          onClick={handleClick}
        >
          More Info
        </Button>
        <Box
          component={motion.div}
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: menuVisible ? 1 : 0,
            height: menuExpanded ? 'auto' : 0,
            width: menuVisible ? 'calc(50vw - 1rem)' : 0,
            x: menuVisible ? 0 : '-100%', // Adjust the x position to start off-screen
          }}
          transition={{ duration: 0.5 }}
          sx={{ overflow: 'hidden', marginTop: 1 }}
        >
          <Paper
            sx={{
              maxWidth: 'calc(50vw - 60px)',
              maxHeight: '60vh',
              overflowY: 'auto',
            }}
          >
            <StyledMenuList
              component={motion.div}
              initial="hidden"
              animate={menuItemsVisible ? 'visible' : 'hidden'}
              variants={{
                hidden: {
                  opacity: 0,
                  y: -20,
                  transition: {
                    staggerChildren: 0.1,
                    staggerDirection: -1,
                  },
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    staggerChildren: 0.1,
                    staggerDirection: 1,
                  },
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                }}
              >
                {firstColumn.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: -10,
                      },
                      visible: {
                        opacity: 1,
                        y: 0,
                      },
                    }}
                    style={{
                      flex: '0 1 45%',
                      margin: '8px',
                    }} // Adjust the flex basis to ensure wrapping
                  >
                    <MenuItem component={NavLink} to={item.url}>
                      <ListItemIcon
                        sx={{
                          color:
                            theme.palette.mode === 'light'
                              ? 'rgb(55, 65, 81)'
                              : theme.palette.grey[300],
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <Typography>{item.title}</Typography>
                    </MenuItem>
                    <Divider />
                  </motion.div>
                ))}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                }}
              >
                {secondColumn.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: -10,
                      },
                      visible: {
                        opacity: 1,
                        y: 0,
                      },
                    }}
                  >
                    <MenuItem
                      component={NavLink}
                      to={item.link}
                      color={theme.palette.primary.main}
                    >
                      <ListItemIcon
                        sx={{
                          color:
                            theme.palette.mode === 'light'
                              ? 'rgb(55, 65, 81)'
                              : theme.palette.grey[300],
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText inset>{item.title}</ListItemText>
                    </MenuItem>
                    <Divider />
                  </motion.div>
                ))}
              </Box>
            </StyledMenuList>
          </Paper>
        </Box>
      </Box>
    </div>
  );
};

export default Hero;
