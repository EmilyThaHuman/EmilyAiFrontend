// src/variables/data.js
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import BugReportIcon from '@mui/icons-material/BugReport';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import PendingIcon from '@mui/icons-material/Pending';
import RefreshIcon from '@mui/icons-material/Refresh';
import { uniqueId } from 'lodash';

import {
  DashboardIcon,
  EmojiEmotionsIcon,
  HomeIcon,
  LayersIcon,
  LoginIcon,
  MdAddTask,
  PageviewIcon,
  PersonAddIcon,
  TextFieldsIcon,
  ArticleIcon,
  ChatIcon,
  CodeIcon,
  ColorLensIcon,
  ErrorIcon,
  NoteAddIcon,
  PersonIcon,
  TableChartIcon,
  LockIcon,
  WorkspaceIcon,
} from 'assets/humanIcons';
const miniStatisticsData = {
  interviewsEarned: {
    name: 'Interviews Earned',
    value: 10,
    icon: <MdAddTask />,
  },
  responsesBack: { name: 'Responses Back', value: 15, icon: <MdAddTask /> },
  rejectionRatio: {
    name: 'Rejection Ratio',
    value: '3:1',
    icon: <MdAddTask />,
  },
  jobsAppliedThisWeek: {
    name: 'Jobs Applied This Week',
    value: 7,
    icon: <MdAddTask />,
  },
  followUpsSent: { name: 'Follow-ups Sent', value: 5, icon: <MdAddTask /> },
};
const tableColumnsCareerTracker = [
  { Header: 'COMPANY NAME', accessor: 'company_name' },
  { Header: 'APPLICATION DATA', accessor: 'application_data' },
  { Header: 'NOTES', accessor: 'notes' },
  { Header: 'SUBMITTED', accessor: 'submitted' },
  { Header: 'PROGRESS', accessor: 'progress' },
  { Header: 'STATUS', accessor: 'status' },
];
const tableDataCareerTracker = [
  {
    company_name: ['Company A', true],
    application_data: [
      { icon: '📄', text: 'Resume' },
      { icon: '📄', text: 'Cover Letter' },
    ],
    notes: ['Note 1', false],
    submitted: '2024-05-01',
    progress: 80,
    status: 'In Progress',
  },
  {
    company_name: ['Company B', false],
    application_data: [{ icon: '📄', text: 'Resume' }],
    notes: ['Note 2', true],
    submitted: '2024-05-03',
    progress: 100,
    status: 'Approved',
  },
  {
    company_name: ['Company C', true],
    application_data: [{ icon: '📄', text: 'Portfolio' }],
    notes: ['Note 3', true],
    submitted: '2024-05-05',
    progress: 50,
    status: 'Pending',
  },
  {
    company_name: ['Company D', false],
    notes: ['Note 4', false],
    submitted: '2024-05-07',
    progress: 25,
    status: 'Rejected',
  },
];
const careerTrackerTable = {
  columns: tableColumnsCareerTracker,
  data: tableDataCareerTracker,
};
const base = `${window.location.origin}`;
const host = 'http://localhost:3000';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
    id: uniqueId(),
  },
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
    href: '/dashboard',
  },
  {
    subheader: 'Utilities',
    title: 'Typography',
    icon: <TextFieldsIcon />,
    href: '/ui/typography',
  },
  {
    title: 'Shadow',
    icon: <LayersIcon />,
    href: '/ui/shadow',
  },
  {
    subheader: 'Auth',
    title: 'Login',
    icon: <LoginIcon />,
    href: '/auth/sign-in',
  },
  {
    title: 'Register',
    icon: <PersonAddIcon />,
    href: '/auth/sign-up',
  },
  {
    subheader: 'Extra',
    title: 'Icons',
    icon: <EmojiEmotionsIcon />,
    href: '/icons',
  },
  {
    title: 'Sample Page',
    icon: <PageviewIcon />,
    href: '/sample-page',
  },
];
const buttonsData = [
  {
    startIcon: <RefreshIcon />,
    variant: 'outlined',
    color: 'primary',
    onClick: () => window.location.reload(),
    sx: { mt: 2 },
    handler: 'refresh',
    children: 'Refresh',
  },
  {
    startIcon: <FileCopyIcon />,
    variant: 'contained',
    color: 'primary',
    onClick: () => {},
    sx: { mt: 2 },
    handler: 'copy',
    children: 'Copy Route',
  },
  {
    startIcon: <HomeIcon />,
    variant: 'contained',
    color: 'primary',
    onClick: () => {},
    sx: { mt: 2 },
    handler: 'back',
    children: 'Go Back',
  },
  {
    startIcon: <HomeIcon />,
    variant: 'contained',
    color: 'primary',
    onClick: () => {},
    sx: { mt: 2 },
    handler: 'retry',
    children: 'Go to Route',
  },
  {
    startIcon: <HomeIcon />,
    variant: 'contained',
    color: 'primary',
    onClick: () => {},
    sx: { mt: 2 },
    handler: 'home',
    children: 'Go Back to Home',
  },
];
const error404Props = {
  statusText: '404',
  message: 'Oops! Page Not Found.',
  mainText: "The page you're looking for doesn't exist or has been moved.",
  letSubTextA: 'Failed Route: ',
  subTextB: ' ~ insert error details here ~ ',
};
const error500Props = {
  statusText: '500',
  message: 'Oops! Something went wrong.',
  mainText: 'An unexpected error has occurred. Our team has been notified.',
  subTextA: 'Routing Error: ',
  subTextB: ' ~ insert error details here ~ ',
};
const errorProps = {
  errorTypes: {
    404: error404Props,
    500: error500Props,
  },
};

export {
  Menuitems,
  careerTrackerTable,
  miniStatisticsData,
  errorProps,
  buttonsData,
};
