import {
  AccountCircleRoundedIcon,
  AiIcon,
  AssistantIcon,
  ChatIcon,
  EditIcon,
  FilePresentIcon,
  FingerprintIcon,
  HomeIcon,
  KeyIcon,
  SettingsIcon,
} from 'assets/humanIcons';

export const APP_SIDEBAR_CONFIG = [
  {
    id: 0,
    space: 'workspace',
    component: 'Workspace',
    icon: <SettingsIcon />,
    getDataFromState: state => state.workspaces,
  },
  {
    id: 1,
    space: 'chatSessions',
    component: 'ChatSession',
    icon: <ChatIcon />,
    getDataFromState: state => state.chatSessions,
  },
  {
    id: 2,
    space: 'assistants',
    component: 'Assistants',
    icon: <AssistantIcon />,
    getDataFromState: state => state.assistants,
  },
  {
    id: 3,
    space: 'prompts',
    component: 'Prompts',
    icon: <EditIcon />,
    getDataFromState: state => state.prompts,
  },
  {
    id: 4,
    space: 'files',
    component: 'Files',
    icon: <FilePresentIcon />,
    getDataFromState: state => state.files,
  },
  {
    id: 5,
    space: 'user',
    component: 'User',
    icon: <AccountCircleRoundedIcon />,
    getDataFromState: state => ({ ...state.user, ...state.profile }),
  },
  {
    id: 6,
    space: 'Home',
    component: 'Home',
    icon: <HomeIcon />,
    isNavigationTab: true,
    navigationPath: '/admin/dashboard',
  },
];
export const SIDEBAR_CONFIG = [
  {
    id: 0,
    space: 'workspace',
    component: 'Workspace',
    icon: <SettingsIcon />,
    getDataFromState: state => state.workspaces,
  },
  {
    id: 1,
    space: 'chatSessions',
    component: 'ChatSession',
    icon: <ChatIcon />,
    getDataFromState: state => state.chatSessions,
  },
  {
    id: 2,
    space: 'assistants',
    component: 'Assistants',
    icon: <AssistantIcon />,
    getDataFromState: state => state.assistants,
  },
  {
    id: 3,
    space: 'prompts',
    component: 'Prompts',
    icon: <EditIcon />,
    getDataFromState: state => state.prompts,
  },
  {
    id: 4,
    space: 'files',
    component: 'Files',
    icon: <FilePresentIcon />,
    getDataFromState: state => state.files,
  },
  {
    id: 5,
    space: 'user',
    component: 'User',
    icon: <AccountCircleRoundedIcon />,
    getDataFromState: state => ({ ...state.user, ...state.profile }),
  },
  {
    id: 6,
    space: 'Home',
    component: 'Home',
    icon: <HomeIcon />,
    isNavigationTab: true,
    navigationPath: '/admin/dashboard',
  },
];
export const SIDEBAR_COOKIE_NAME = 'sidebar:state';
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const SIDEBAR_WIDTH = '16rem';
export const SIDEBAR_WIDTH_MOBILE = '18rem';
export const SIDEBAR_WIDTH_ICON = '3rem';
export const SIDEBAR_KEYBOARD_SHORTCUT = 'b';
