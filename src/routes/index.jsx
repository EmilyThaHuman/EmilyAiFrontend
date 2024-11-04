// Import statements remain the same
import { createBrowserHistory } from 'history';
import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

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
const ReedAiLanding = Loadable(lazy(() => import('views/land/reedAi/Index')));
const TestAiLanding = Loadable(lazy(() => import('views/land/testAi/Index')));

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
// Separate Configuration for Non-Router Data
// =========================================================
const routeConfig = [
  {
    // Root Route Config
    name: 'Root',
    title: 'Root',
    hide: true,
    type: 'root',
    children: [
      {},
      // Base Routes Config
      {
        name: 'Docs',
        title: 'Docs',
        breadcrumb: 'Docs',
        icon: <HomeIcon />,
        collapse: true,
        invisible: false,
        items: ['Hero Docs'],
        children: [
          {},
          {
            name: 'ReedAi',
            title: 'ReedAi',
            breadcrumb: 'ReedAi',
            icon: <FolderRoundedIcon />,
            invisible: false,
            collapse: false,
          },
          {
            name: 'TestAi',
            title: 'TestAi',
            breadcrumb: 'TestAi',
            icon: <FolderRoundedIcon />,
            invisible: false,
            collapse: false,
          },
        ],
      },
      // Admin Routes Config
      {
        name: 'Admin',
        title: 'Admin',
        breadcrumb: 'Admin',
        icon: <AdminPanelSettingsRoundedIcon />,
        collapse: true,
        children: [
          {},
          {
            name: 'Main Dashboard',
            title: 'MainDashboard',
            breadcrumb: 'Main Dashboard',
            icon: <DashboardIcon />,
            description: 'Main Dashboard',
            collapse: false,
          },
          {
            name: 'Profile',
            title: 'Profile',
            breadcrumb: 'Profile',
            icon: <PersonIcon />,
            collapse: false,
          },
          {
            name: 'Workspace',
            title: 'Workspace',
            breadcrumb: 'Workspace',
            icon: <FolderRoundedIcon />,
            collapse: true,
            children: [
              {},
              {
                name: 'Workspace Home',
                title: 'WorkspaceHome',
                breadcrumb: 'Workspace Home',
                icon: <HomeIcon />,
                description: 'Workspace Home',
                collapse: false,
              },
              {
                name: 'Active Workspace',
                title: 'ActiveWorkspace',
                breadcrumb: 'Active Workspace',
                icon: <HomeIcon />,
                description: 'Active Workspace',
                collapse: true,
                children: [
                  {
                    name: 'Chat',
                    title: 'Chat',
                    breadcrumb: 'Chat',
                    icon: <AiIcon />,
                    collapse: true,
                    children: [
                      {
                        name: 'Chat',
                        title: 'Chat',
                        breadcrumb: 'Chat',
                        icon: <AiIcon />,
                        description: 'Chat Home',
                        collapse: false,
                      },
                      {
                        name: 'Chat Session',
                        title: 'ChatSession',
                        breadcrumb: 'Chat Session',
                        icon: <DocumentScannerRoundedIcon />,
                        description: 'Chat Sessions',
                        collapse: false,
                      },
                      {
                        name: 'New Chat',
                        title: 'NewChat',
                        breadcrumb: 'New Chat',
                      },
                      {
                        name: 'Chat Mode',
                        title: 'ChatMode',
                        breadcrumb: 'Chat Mode',
                        icon: <AiIcon />,
                      },
                      {
                        name: 'Chat Test',
                        title: 'ChatTest',
                        breadcrumb: 'Chat Test',
                        icon: <AiIcon />,
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
            breadcrumb: 'CodeEditor',
            icon: <AiIcon />,
            collapse: true,
            children: [
              {
                name: 'CodeEditor Home',
                title: 'CodeEditorHome',
                breadcrumb: 'CodeEditor Home',
                icon: <HomeIcon />,
                description: 'Code Editor',
                collapse: false,
              },
            ],
          },
        ],
      },
      // Auth Routes Config
      {
        name: 'Auth',
        title: 'Auth',
        breadcrumb: 'Auth',
        icon: <LockIcon />,
        collapse: true,
        type: 'layout',
        children: [
          {},
          {
            name: 'Auth Default',
            title: 'Auth Default',
            breadcrumb: 'Auth',
            icon: <LockIcon />,
            collapse: false,
          },
          {
            name: 'Sign In',
            title: 'SignIn',
            breadcrumb: 'Sign In',
            icon: <LockIcon />,
            collapse: false,
          },
          {
            name: 'Sign Up',
            title: 'SignUp',
            breadcrumb: 'Sign Up',
            icon: <PersonAddIcon />,
            collapse: false,
          },
          {
            name: 'SetUp',
            title: 'SetUp',
            breadcrumb: 'SetUp',
            icon: <PersonAddIcon />,
            collapse: false,
          },
          {
            name: 'Logout',
            title: 'Logout',
            breadcrumb: 'Logout',
            icon: <PersonAddIcon />,
            collapse: false,
          },
        ],
      },
    ],
  },
];

// =========================================================
// Simplified Routes
// =========================================================
const routes = [
  {
    path: '/',
    element: <RouterLayout />,
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        element: <Navigate to="/land/reedAi" />,
      },
      // Base Routes
      {
        path: '/land',
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <BlankLayout />
          </Suspense>
        ),
        errorElement: <ErrorElement />,
        children: [
          {
            index: true,
            element: <Navigate to="/land/reedAi" />,
          },
          {
            path: 'reedAi',
            element: <ReedAiLanding />,
          },
          {
            path: 'testAi',
            element: <TestAiLanding />,
          },
        ],
      },
      // Admin Routes
      {
        path: '/admin',
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <AdminLayout />
          </Suspense>
        ),
        errorElement: <ErrorElement />,
        children: [
          {
            index: true,
            element: <Navigate to="/admin/dashboard" />,
          },
          {
            index: true,
            path: 'dashboard',
            element: <MainDashboard />,
          },
          {
            path: 'profile',
            element: <UserProfile />,
          },
          {
            path: 'workspaces',
            element: (
              <Suspense fallback={<LoadingIndicator />}>
                <ChatLayout />
              </Suspense>
            ),
            children: [
              {
                index: true,
                element: <Navigate to="/admin/workspaces/home" />,
              },
              {
                path: 'home',
                element: (
                  <Suspense fallback={<LoadingIndicator />}>
                    <WorkspaceActive />
                  </Suspense>
                ),
                loader: homeWorkspaceLoader,
              },
              {
                path: ':workspaceId',
                element: (
                  <Suspense fallback={<LoadingIndicator />}>
                    <WorkspaceActive />
                  </Suspense>
                ),
                loader: workspaceLoader,
                children: [
                  {
                    path: 'chat',
                    element: (
                      <Suspense fallback={<LoadingIndicator />}>
                        <ChatDefault />
                      </Suspense>
                    ),
                    children: [
                      {
                        path: 'default',
                        element: (
                          <Suspense fallback={<LoadingIndicator />}>
                            <ChatDefault />
                          </Suspense>
                        ),
                        loader: chatSessionLoader,
                      },
                      {
                        path: ':sessionId',
                        element: (
                          <Suspense fallback={<LoadingIndicator />}>
                            <ChatActive />
                          </Suspense>
                        ),
                        loader: chatSessionLoader,
                      },
                      {
                        path: 'new',
                        element: (
                          <Suspense fallback={<LoadingIndicator />}>
                            <NewChat />
                          </Suspense>
                        ),
                        action: createChatAction,
                      },
                      {
                        path: ':modeId',
                        element: (
                          <Suspense fallback={<LoadingIndicator />}>
                            <ChatActive />
                          </Suspense>
                        ),
                        loader: async ({ params }) => {
                          const { workspaceId, modeId } = params;
                          return { modeId };
                        },
                      },
                      {
                        path: 'test',
                        element: (
                          <Suspense fallback={<LoadingIndicator />}>
                            <ChatActive />
                          </Suspense>
                        ),
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            path: 'codeEditor',
            element: (
              <Suspense fallback={<LoadingIndicator />}>
                <BlankLayout />
              </Suspense>
            ),
            children: [
              {
                index: true,
                path: 'codeEditor-home',
                element: (
                  <Suspense fallback={<LoadingIndicator />}>
                    <CodeEditor />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
      // Auth Routes
      {
        path: '/auth',
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <AuthLayout />
          </Suspense>
        ),
        errorElement: <ErrorElement />,
        children: [
          {
            index: true,
            element: <Navigate to="auth-default" replace />,
          },
          {
            path: 'auth-default',
            element: <AuthDefault />,
          },
          {
            path: 'sign-in',
            element: <SignInMain />,
            action: (token, userData) => {
              console.log('AUTH_DATA', token, userData);
              localStorage.setItem('user', JSON.stringify(userData));
              dispatch(setField({ field: 'isAuthenticated', value: true }));
            },
          },
          {
            path: 'sign-up',
            element: <SignUpMain />,
            action: (token, userData) => {
              console.log('AUTH_DATA', token, userData);
              localStorage.setItem('user', JSON.stringify(userData));
              dispatch(setField({ field: 'isAuthenticated', value: true }));
            },
          },
          {
            path: 'setup',
            element: <SetUpMain />,
          },
          {
            path: 'logout',
            element: <Navigate to="/" />,
            action: logoutAction,
          },
        ],
      },
    ],
  },
];

// =========================================================
// Function to Merge Route Configurations
// =========================================================
const applyRouteConfig = (routes, config) => {
  const nonRouterKeys = [
    'name',
    'title',
    'breadcrumb',
    'icon',
    'collapse',
    'invisible',
    'description',
    'items',
    'hide',
    'type',
  ];

  const mergeConfigs = (routesArray, configArray) => {
    return routesArray.map((route, index) => {
      const routeConfig = configArray[index] || {};
      nonRouterKeys.forEach(key => {
        if (routeConfig[key] !== undefined) {
          route[key] = routeConfig[key];
        }
      });
      if (route.children && routeConfig.children) {
        route.children = mergeConfigs(route.children, routeConfig.children);
      }
      return route;
    });
  };

  return mergeConfigs(routes, config);
};

// Apply the configuration to the simplified routes
const routesData = applyRouteConfig(routes, routeConfig);

// Export the router
export const Router = createBrowserRouter(routesData, {
  history: customHistory,
});

export default routesData;
