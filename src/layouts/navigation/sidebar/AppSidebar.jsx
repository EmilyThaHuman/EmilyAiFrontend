import {
  Box,
  Drawer,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  Typography,
  useTheme,
  alpha,
  Avatar,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { uniqueId } from 'lodash';
import { Menu as MenuIcon, X as CloseIcon, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { NavLink, useLocation } from 'react-router-dom';

const MotionMenuItem = motion(MenuItem);
const MotionBox = motion(Box);

export const Sidebar = ({ routes, brandComponent: Brand }) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const location = useLocation();

  const sidebarWidth = 285;
  const indent = sidebarWidth * 0.025;

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const toggleSubmenu = useCallback(routeName => {
    setExpandedMenus(prev => ({
      ...prev,
      [routeName]: !prev[routeName],
    }));
  }, []);

  const menuItemVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      transition: {
        type: 'spring',
        stiffness: 350,
        damping: 40,
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 350,
        damping: 40,
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        type: 'spring',
        stiffness: 350,
        damping: 40,
      },
    },
  };

  const renderMenuItem = useCallback(
    (route, paddingLeft, index) => {
      const isExpanded = expandedMenus[route.name];
      const isActive = location.pathname === route.path;
      const hasChildren = route.children && route.children.length > 0;

      return (
        <MotionMenuItem
          component={NavLink}
          to={route.path}
          onClick={() => {
            if (hasChildren) {
              toggleSubmenu(route.name);
            } else {
              handleToggle();
            }
          }}
          sx={{
            position: 'relative',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
            boxSizing: 'border-box',
            maxWidth: '100%',
            paddingLeft: `${paddingLeft}px`,
            visibility: route.hide ? 'hidden' : 'visible',
            marginY: 0.5,
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
            ...(isActive && {
              backgroundColor: alpha(theme.palette.primary.main, 0.12),
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.16),
              },
            }),
          }}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={menuItemVariants}
          custom={index}
          key={uniqueId(route.path)}
        >
          {route.icon && (
            <ListItemIcon
              sx={{
                minWidth: 'auto',
                marginRight: 1,
                color: isActive
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
                transition: 'color 0.3s ease',
              }}
            >
              {route.icon}
            </ListItemIcon>
          )}
          <ListItemText
            primary={
              <Typography
                variant={route.collapse ? 'h6' : 'body1'}
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                  boxSizing: 'border-box',
                  color: isActive
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                  fontWeight: isActive ? 600 : 400,
                  transition: 'color 0.3s ease',
                }}
              >
                {route.name}
              </Typography>
            }
          />
          {hasChildren && (
            <ChevronRight
              size={20}
              style={{
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
                color: theme.palette.text.secondary,
              }}
            />
          )}
        </MotionMenuItem>
      );
    },
    [expandedMenus, location.pathname, theme, handleToggle, toggleSubmenu]
  );

  const renderRoutes = useCallback(
    (routes, paddingLeft = 0) => (
      <AnimatePresence mode="wait">
        {routes.map((route, index) => (
          <MotionBox
            key={uniqueId(route.name)}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { opacity: 0, height: 0 },
              visible: {
                opacity: 1,
                height: 'auto',
                transition: {
                  duration: 0.3,
                  delay: index * 0.1,
                },
              },
              exit: {
                opacity: 0,
                height: 0,
                transition: {
                  duration: 0.2,
                },
              },
            }}
          >
            {renderMenuItem(route, paddingLeft, index)}
            {route.children &&
              route.children.length > 0 &&
              expandedMenus[route.name] && (
                <Box sx={{ paddingLeft: `${paddingLeft}px` }}>
                  {renderRoutes(route.children, paddingLeft + indent)}
                </Box>
              )}
          </MotionBox>
        ))}
      </AnimatePresence>
    ),
    [renderMenuItem, expandedMenus, indent]
  );

  return (
    <Box sx={{ display: { xs: 'flex', xl: 'none' }, alignItems: 'center' }}>
      <IconButton
        onClick={handleToggle}
        sx={{
          color: theme.palette.text.secondary,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
          },
        }}
      >
        {isOpen ? (
          <CloseIcon style={{ width: 20, height: 20 }} />
        ) : (
          <MenuIcon style={{ width: 20, height: 20 }} />
        )}
      </IconButton>

      <Drawer
        open={isOpen}
        onClose={handleToggle}
        anchor="left"
        PaperProps={{
          sx: {
            width: sidebarWidth,
            maxWidth: sidebarWidth,
            backgroundColor: theme.palette.background.paper,
            borderRadius: '0 16px 16px 0',
            boxShadow: theme.shadows[8],
          },
        }}
      >
        <Scrollbars autoHide>
          <Stack
            direction="column"
            sx={{
              height: '100%',
              padding: '24px 16px',
            }}
          >
            {/* Brand Section */}
            <Box
              sx={{
                marginBottom: 3,
                padding: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                borderRadius: '12px',
              }}
            >
              {Brand && <Brand />}
            </Box>

            {/* Navigation Section */}
            <Box sx={{ flex: 1 }}>{renderRoutes(routes)}</Box>

            {/* User Profile Section */}
            <Box
              sx={{
                marginTop: 3,
                padding: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Avatar sx={{ width: 40, height: 40 }} />
              <Box>
                <Typography variant="subtitle2">John Doe</Typography>
                <Typography variant="caption" color="text.secondary">
                  john@example.com
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Scrollbars>
      </Drawer>
    </Box>
  );
};

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  brandComponent: PropTypes.elementType,
};

export default Sidebar;
// import {
//   Box,
//   Divider,
//   Drawer,
//   IconButton,
//   ListItemIcon,
//   ListItemText,
//   MenuItem,
//   Stack,
//   Typography,
// } from '@mui/material';
// import { uniqueId } from 'lodash';
// import PropTypes from 'prop-types';
// import React from 'react';
// import Scrollbars from 'react-custom-scrollbars-2';
// import { IoMenuOutline } from 'react-icons/io5';
// import { NavLink, useParams } from 'react-router-dom';

// import { useDisclosure, useMode } from '@/hooks';
// import {
//   RCBox,
//   RCFlex,
//   renderThumb,
//   renderTrack,
//   renderView,
// } from 'components';
// import { extractPaths } from 'utils';

// import { Brand } from './components';

// export const Sidebar = props => {
//   const { theme } = useMode();
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const anchorRef = React.useRef('left');
//   const sidebarWidth = 285;
//   const indent = sidebarWidth * 0.025;
//   const { workspaceId } = useParams();

//   const { routes } = props;

//   const handleToggle = () => (isOpen ? onClose() : onOpen());

//   const linkPaths = extractPaths(routes);
//   const pathsMap = linkPaths.reduce((map, path) => {
//     const key = path.replace(/\/$/, '').split('/').pop() || 'root';
//     map[key] = path;
//     return map;
//   }, {});
//   const renderMenuItem = (route, paddingLeft) => (
//     <MenuItem
//       component={NavLink}
//       to={pathsMap[route.path?.split('/').pop()] || route.path}
//       onClick={handleToggle}
//       sx={{
//         whiteSpace: 'nowrap',
//         overflow: 'hidden',
//         textOverflow: 'ellipsis',
//         width: '100%',
//         boxSizing: 'border-box',
//         maxWidth: '100%',
//         paddingLeft: `${paddingLeft}px`,
//         visibility: route.hide ? 'hidden' : 'visible',
//       }}
//       key={uniqueId(route.path)}
//     >
//       {route.icon && (
//         <ListItemIcon
//           sx={{
//             minWidth: 'auto',
//             marginRight: 1,
//             color: theme.palette.primary.main,
//           }}
//         >
//           {route.icon}
//         </ListItemIcon>
//       )}
//       <ListItemText
//         primary={
//           <Typography
//             variant={route.collapse ? 'h6' : 'body1'}
//             sx={{
//               whiteSpace: 'nowrap',
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//               width: '100%',
//               boxSizing: 'border-box',
//             }}
//           >
//             {route.name}
//           </Typography>
//         }
//       />
//     </MenuItem>
//   );

//   const renderRoutes = (routes, paddingLeft = 0) =>
//     routes.map(route => (
//       <Box key={uniqueId(route.name)}>
//         {renderMenuItem(route, paddingLeft)}
//         {route.children && route.children.length > 0 && (
//           <Box sx={{ paddingLeft: `${paddingLeft}px` }}>
//             {renderRoutes(route.children, paddingLeft + indent)}
//             {/* <Divider /> */}
//           </Box>
//         )}
//       </Box>
//     ));

//   return (
//     <Box sx={{ display: { xs: 'flex', xl: 'none' }, alignItems: 'center' }}>
//       {/* --- Drawer Menu Button --- */}
//       <Box
//         sx={{ width: 'max-content', height: 'max-content' }}
//         onClick={handleToggle}
//       >
//         <IconButton>
//           <IoMenuOutline
//             style={{
//               color: theme.palette.text.secondary,
//               width: '20px',
//               height: '20px',
//             }}
//           />
//         </IconButton>
//       </Box>
//       <Divider />

//       {/* --- Drawer Menu --- */}
//       <Drawer
//         open={isOpen}
//         onClose={handleToggle}
//         anchor={anchorRef.current}
//         PaperProps={{
//           sx: {
//             width: '300px',
//             maxWidth: '300px',
//             backgroundColor: theme.palette.background.paper,
//             position: 'relative',
//           },
//         }}
//       >
//         <Scrollbars
//           autoHide
//           renderTrackVertical={renderTrack}
//           renderThumbVertical={renderThumb}
//           renderView={renderView}
//         >
//           <Box
//             sx={{
//               height: '100%',
//               pt: '25px',
//               px: '16px',
//               borderRadius: '30px',
//             }}
//           >
//             <Box
//               sx={{
//                 width: 285,
//                 maxWidth: 285,
//                 padding: '0',
//                 paddingBottom: '0',
//               }}
//               role="presentation"
//             >
//               <RCFlex
//                 sx={{
//                   display: 'flex',
//                   flexDirection: 'column',
//                   height: '100%',
//                   paddingTop: '25px',
//                   paddingX: '16px',
//                   borderRadius: '30px',
//                 }}
//               >
//                 <RCBox theme={theme} variant="card">
//                   <Brand />
//                 </RCBox>

//                 <Stack direction="column" mb="auto" mt="8px">
//                   <Box
//                     sx={{
//                       paddingLeft: '20px',
//                       paddingRight: '16px',
//                       width: '100%',
//                     }}
//                   >
//                     {renderRoutes(routes)}
//                   </Box>
//                 </Stack>
//               </RCFlex>
//             </Box>
//           </Box>
//         </Scrollbars>
//       </Drawer>
//     </Box>
//   );
// };

// Sidebar.propTypes = {
//   routes: PropTypes.arrayOf(PropTypes.object).isRequired,
//   workspaces: PropTypes.arrayOf(PropTypes.object),
// };

// export default Sidebar;
