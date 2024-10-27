import { createBrowserHistory } from 'history';
import React, { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  Navigate,
  redirect,
  useNavigate,
  useRouteError,
} from 'react-router-dom';

import {
  AdminPanelSettingsRoundedIcon,
  AiIcon,
  DashboardIcon,
  DocumentScannerRoundedIcon,
  FolderRoundedIcon,
  HomeIcon,
  LockIcon,
  PersonAddIcon,
  PersonIcon,
} from 'assets/humanIcons';
import { LoadingIndicator } from 'components/index';
import { dispatch, setField } from 'store/index';

import { createChatAction, logoutAction } from './actions';
import {
  chatSessionLoader,
  homeWorkspaceLoader,
  workspaceLoader,
} from './loaders';
import { Loadable } from './utils';

/* *** Components *** */
const ErrorElement = Loadable(
  React.lazy(() => import('./components/RootErrorBoundary'))
);
const NewChat = Loadable(lazy(() => import('./components/NewChatRoute')));
export function LogoutRoute() {
  return <p>Logging out...</p>;
}

/* *** Layouts *** */
const BlankLayout = Loadable(lazy(() => import('layouts/blank')));
const AdminLayout = Loadable(lazy(() => import('layouts/admin')));
const AuthLayout = Loadable(lazy(() => import('layouts/auth')));
const ChatLayout = Loadable(lazy(() => import('layouts/chat')));
const RouterLayout = Loadable(lazy(() => import('layouts/router')));
/* *** Views *** */
const HeroDocs = Loadable(lazy(() => import('views/land/heroDocs')));
const ReedAiLanding = Loadable(
  lazy(() => import('views/landing/reedAi/Index'))
);
const TestAiLanding = Loadable(
  lazy(() => import('views/landing/testAi/Index'))
);

const AuthDefault = Loadable(lazy(() => import('views/auth/default')));
const SignInMain = Loadable(lazy(() => import('views/auth/login')));
const SignUpMain = Loadable(lazy(() => import('views/auth/signup')));
const SetUpMain = Loadable(lazy(() => import('views/auth/setup')));

const MainDashboard = Loadable(lazy(() => import('views/admin/default')));
const UserProfile = Loadable(lazy(() => import('views/admin/profile')));

const WorkspaceActive = lazy(() => import('views/admin/workspace'));
const ChatActive = lazy(() => import('views/admin/chat/ChatInterface'));
const ChatDefault = lazy(() => import('views/admin/chat/index.jsx'));
const CodeEditor = Loadable(lazy(() => import('views/admin/editor')));

export const customHistory = createBrowserHistory();

customHistory.listen((location, action) => {
  console.log(`[History]: ${action} - ${location.pathname}`);
});

// =========================================================
// Base Routes
// =========================================================
const baseRoutes = [
  {
    name: 'Docs',
    title: 'Docs',
    path: '/land',
    breadcrumb: 'Docs',
    element: (
      <Suspense fallback={<LoadingIndicator />}>
        <BlankLayout />
      </Suspense>
    ),
    errorElement: <ErrorElement />,
    icon: <HomeIcon />,
    collapse: true,
    invisible: false,
    items: ['Hero Docs'],
    children: [
      {
        index: true,
        element: <Navigate to="/land/reedAi" />, // Fallback to Hero Docs
      },
      {
        name: 'Hero Docs',
        title: 'HeroDocs',
        path: 'heroDocs',
        breadcrumb: 'Hero Docs',
        element: <HeroDocs />,
        icon: <FolderRoundedIcon />,
        invisible: false,
        collapse: false,
      },
      {
        name: 'ReedAi',
        title: 'ReedAi',
        path: 'reedAi',
        breadcrumb: 'ReedAi',
        element: <ReedAiLanding />,
        icon: <FolderRoundedIcon />,
        invisible: false,
        collapse: false,
      },
      {
        name: 'TestAi',
        title: 'TestAi',
        path: 'testAi',
        breadcrumb: 'TestAi',
        element: <TestAiLanding />,
        icon: <FolderRoundedIcon />,
        invisible: false,
        collapse: false,
      },
    ],
  },
];
// =========================================================
// Admin Routes
// =========================================================
const adminRoutes = [
  {
    name: 'Admin',
    title: 'Admin',
    path: '/admin',
    breadcrumb: 'Admin',
    element: (
      <Suspense fallback={<LoadingIndicator />}>
        <AdminLayout />
      </Suspense>
    ),
    errorElement: <ErrorElement />,
    icon: <AdminPanelSettingsRoundedIcon />,
    collapse: true,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" />, // Fallback to Main Dashboard
      },
      {
        index: true,
        name: 'Main Dashboard',
        title: 'MainDashboard',
        path: 'dashboard',
        breadcrumb: 'Main Dashboard',
        element: <MainDashboard />,
        icon: <DashboardIcon />,
        description: 'Main Dashboard',
        collapse: false,
      },
      {
        name: 'Profile',
        title: 'Profile',
        path: 'profile',
        breadcrumb: 'Profile',
        element: <UserProfile />,
        icon: <PersonIcon />,
        collapse: false,
      },
      {
        name: 'Workspace',
        title: 'Workspace',
        path: 'workspaces', // Dynamic route for workspaces
        breadcrumb: 'Workspace',
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <ChatLayout />
          </Suspense>
        ),
        icon: <FolderRoundedIcon />,
        collapse: true,
        children: [
          {
            index: true,
            element: <Navigate to="/admin/workspaces/home" />, // Fallback to Workspace Home
          },
          {
            name: 'Workspace Home',
            title: 'WorkspaceHome',
            path: 'home',
            breadcrumb: 'Workspace Home',
            element: (
              <Suspense fallback={<LoadingIndicator />}>
                <WorkspaceActive />
              </Suspense>
            ),
            icon: <HomeIcon />,
            description: 'Workspace Home',
            loader: homeWorkspaceLoader,
            collapse: false,
          },
          {
            name: 'Active Workspace',
            title: 'ActiveWorkspace',
            path: ':workspaceId',
            breadcrumb: 'Active Workspace',
            element: (
              <Suspense fallback={<LoadingIndicator />}>
                <WorkspaceActive />
              </Suspense>
            ),
            icon: <HomeIcon />,
            description: 'Active Workspace',
            loader: workspaceLoader,
            collapse: true,
            children: [
              // {
              //   index: true,
              //   element: <Navigate to="/admin/workspaces/:workspaceId/chat" />,
              // },
              {
                name: 'Chat',
                title: 'Chat',
                path: 'chat',
                breadcrumb: 'Chat',
                element: (
                  <Suspense fallback={<LoadingIndicator />}>
                    <ChatDefault />
                  </Suspense>
                ),
                icon: <AiIcon />,
                collapse: true,
                children: [
                  // {
                  //   index: true,
                  //   element: (
                  //     <Navigate to="/admin/workspaces/:workspaceId/chat/:sessionId" />
                  //   ),
                  // },
                  {
                    name: 'Chat',
                    title: 'Chat',
                    path: 'default',
                    breadcrumb: 'Chat',
                    element: (
                      <Suspense fallback={<LoadingIndicator />}>
                        <ChatDefault />
                      </Suspense>
                    ),
                    icon: <AiIcon />,
                    description: 'Chat Home',
                    collapse: false,
                    loader: chatSessionLoader,
                  },
                  {
                    name: 'Chat Session',
                    title: 'ChatSession',
                    path: ':sessionId', // Dynamic route for chat session
                    breadcrumb: 'Chat Session',
                    element: (
                      <Suspense fallback={<LoadingIndicator />}>
                        <ChatActive />
                      </Suspense>
                    ),
                    icon: <DocumentScannerRoundedIcon />,
                    description: 'Chat Sessions',
                    collapse: false,
                    loader: chatSessionLoader,
                    // errorElement: (
                    //   <Suspense fallback={<LoadingIndicator />}></Suspense>
                    // ),
                  },
                  {
                    name: 'New Chat',
                    title: 'NewChat',
                    path: 'new',
                    breadcrumb: 'New Chat',
                    element: (
                      <Suspense fallback={<LoadingIndicator />}>
                        <NewChat />
                      </Suspense>
                    ),
                    action: createChatAction,
                  },
                  {
                    name: 'Chat Mode',
                    title: 'ChatMode',
                    path: ':modeId', // Dynamic modeId route
                    breadcrumb: 'Chat Mode',
                    element: (
                      <Suspense fallback={<LoadingIndicator />}>
                        <ChatActive />
                      </Suspense>
                    ),
                    icon: <AiIcon />, // Replace with appropriate icon if needed
                    loader: async ({ params }) => {
                      const { workspaceId, modeId } = params;
                      // Optional: Add loader logic if necessary
                      return { modeId };
                    },
                  },
                  {
                    name: 'Chat Test',
                    title: 'ChatTest',
                    path: 'test', // Static test route
                    breadcrumb: 'Chat Test',
                    element: (
                      <Suspense fallback={<LoadingIndicator />}>
                        <ChatActive />
                      </Suspense>
                    ),
                    icon: <AiIcon />, // Replace with appropriate icon if needed
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'CodeEditor',
        title: 'CodeEditor',
        path: 'codeEditor',
        breadcrumb: 'CodeEditor',
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <BlankLayout />
          </Suspense>
        ),
        icon: <AiIcon />,
        collapse: true,
        children: [
          {
            index: true,
            name: 'CodeEditor Home',
            title: 'CodeEditorHome',
            path: 'codeEditor-home',
            breadcrumb: 'CodeEditor Home',
            element: (
              <Suspense fallback={<LoadingIndicator />}>
                <CodeEditor />
              </Suspense>
            ),
            icon: <HomeIcon />,
            description: 'Code Editor',
            collapse: false,
          },
        ],
      },
    ],
  },
];
// =========================================================
// Auth Routes
// =========================================================
const authRoutes = [
  {
    type: 'layout',
    name: 'Auth',
    title: 'Auth',
    path: '/auth',
    breadcrumb: 'Auth',
    element: (
      <Suspense fallback={<LoadingIndicator />}>
        <AuthLayout />
      </Suspense>
    ),
    errorElement: <ErrorElement />,
    icon: <LockIcon />,
    collapse: true,
    children: [
      {
        index: true,
        element: <Navigate to="auth-default" replace />,
      },
      {
        name: 'Auth Default',
        title: 'Auth Default',
        path: 'auth-default',
        breadcrumb: 'Auth',
        element: <AuthDefault />,
        icon: <LockIcon />,
        collapse: false,
      },
      {
        name: 'Sign In',
        title: 'SignIn',
        path: 'sign-in',
        breadcrumb: 'Sign In',
        element: <SignInMain />,
        icon: <LockIcon />,
        collapse: false,
        action: (token, userData) => {
          console.log('AUTH_DATA', token, userData);
          // localStorage.setItem('userToken', token);
          localStorage.setItem('user', JSON.stringify(userData));
          dispatch(setField({ field: 'isAuthenticated', value: true }));
        },
      },
      {
        name: 'Sign Up',
        title: 'SignUp',
        path: 'sign-up',
        breadcrumb: 'Sign Up',
        element: <SignUpMain />,
        icon: <PersonAddIcon />,
        collapse: false,
        action: (token, userData) => {
          console.log('AUTH_DATA', token, userData);
          // localStorage.setItem('userToken', token);
          localStorage.setItem('user', JSON.stringify(userData));
          dispatch(setField({ field: 'isAuthenticated', value: true }));
        },
      },
      {
        name: 'SetUp',
        title: 'SetUp',
        path: 'setup',
        breadcrumb: 'SetUp',
        element: <SetUpMain />,
        icon: <PersonAddIcon />,
        collapse: false,
      },
      {
        name: 'Logout',
        title: 'Logout',
        path: 'logout',
        breadcrumb: 'Logout',
        element: <Navigate to="/" />,
        collapse: false,
        icon: <PersonAddIcon />,
        action: logoutAction,
        // async action() {
        //   console.log('Logging out');
        //   return redirect('/');
        // },
      },
    ],
  },
];
// =========================================================
// Root Routes
// =========================================================
const rootRoutes = [
  {
    type: 'root',
    name: 'Root',
    title: 'Root',
    hide: true,
    path: '/',
    element: <RouterLayout />,
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        element: <Navigate to="/land/reedAi" />, // Redirect to '/land/heroDocs'
      },
      ...baseRoutes,
      ...adminRoutes,
      ...authRoutes,
    ],
  },
];
const routes = [...rootRoutes];

export const Router = createBrowserRouter(routes, { history: customHistory });

export default routes;
