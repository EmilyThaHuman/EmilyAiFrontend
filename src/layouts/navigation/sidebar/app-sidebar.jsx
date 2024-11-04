/* eslint-disable jsx-a11y/no-static-element-interactions */
import { alpha, Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
} from 'lucide-react';
import PropTypes from 'prop-types';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { CloseIcon, MenuIcon } from '@/assets/humanIcons';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { useMode } from '@/hooks';
import { NavbarLogo } from '@/layouts';
import { NavMain } from '@/layouts/navigation/sidebar/nav-main';
import { NavProjects } from '@/layouts/navigation/sidebar/nav-projects';
import { NavUser } from '@/layouts/navigation/sidebar/nav-user';
import { TeamSwitcher } from '@/layouts/navigation/sidebar/team-switcher';
import { cn } from '@/lib/utils/styleUtils';
import { analyzeRoutes } from '@/utils';

import { RCBox } from '../../../components/themed';

import '@/index.css';
import './sidebar.css';

export const AppSidebarV2 = ({ ...props }) => {
  const { routeInfo, routeInfoMap } = analyzeRoutes(props.routes);

  const { open, setOpen } = useSidebar();
  const theme = useTheme();

  // Responsive widths
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  let sidebarWidth;
  if (isSmallScreen) {
    sidebarWidth = '80vw';
  } else if (isMediumScreen) {
    sidebarWidth = '60vw';
  } else {
    sidebarWidth = '300px'; // Fixed width for large screens
  }

  const sidebarStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: sidebarWidth,
    backgroundColor: theme.palette.background.paper,
    transform: open ? 'translateX(0)' : `translateX(-${sidebarWidth})`,
    transition: 'transform 0.3s ease-in-out',
    zIndex: 1000,
    overflowY: 'auto',
  };
  // This is sample data.
  const data = {
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: '/avatars/shadcn.jpg',
    },
    logo: {
      name: 'ReedAi',
      url: '#',
      icon: NavbarLogo,
    },
    teams: [
      {
        name: 'Acme Inc',
        logo: GalleryVerticalEnd,
        plan: 'Enterprise',
      },
      {
        name: 'Acme Corp.',
        logo: AudioWaveform,
        plan: 'Startup',
      },
      {
        name: 'Evil Corp.',
        logo: Command,
        plan: 'Free',
      },
    ],
    navMain: routeInfo,
    projects: [
      {
        name: 'Design Engineering',
        url: '#',
        icon: Frame,
      },
      {
        name: 'Sales & Marketing',
        url: '#',
        icon: PieChart,
      },
      {
        name: 'Travel',
        url: '#',
        icon: Map,
      },
    ],
  };

  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              setOpen(false);
            }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
          }}
        />
      )}

      {/* Sidebar */}
      <Sidebar style={sidebarStyles}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
          <RCBox theme={theme} variant="card">
            <Link to="/" className="flex items-center space-x-2">
              <NavbarLogo className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">ReedAi</span>
            </Link>
          </RCBox>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavProjects projects={data.projects} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  );
};

AppSidebarV2.displayName = 'AppSidebarV2';

AppSidebarV2.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  brandComponent: PropTypes.elementType,
};

export default AppSidebarV2;
