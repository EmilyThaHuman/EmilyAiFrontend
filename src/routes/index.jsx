import { createBrowserHistory } from 'history';
import React, { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  Navigate,
  redirect,
  useNavigate,
  useRouteError,
} from 'react-router-dom';

import { chatApi } from 'api/Ai/chat-sessions';
import { workspacesApi } from 'api/workspaces';
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
import PublicRoute from 'components/PublicRoute';
import { Loadable } from 'layouts/navigation/navbar/components';
import { dispatch, setField } from 'store/index';
import { NotFoundPage } from 'views/error';

// =========================================================
// Route Loaders
// =========================================================
/* *** Fetch Workspace Loader *** */
export async function workspaceLoader({ params }) {
  const { workspaceId } = params;

  try {
    const workspace = await workspacesApi.getWorkspace(workspaceId);
    if (!workspace) {
      throw new Response('Workspace Not Found', { status: 404 });
    }
    return { workspace };
  } catch (error) {
    throw new Response(error.message || 'Failed to load workspace', {
      status: error.status || 500,
    });
  }
}
/* *** Fetch ChatSession Loader *** */
// export async function chatSessionLoader({ params }) {

// =========================================================
// Route Actions
// =========================================================

/* *** Create Chat Action *** */
export async function createNewChatAction({ request }) {
  const formData = await request.formData();
  const { topic, prompt, selectedComponent, temperature, useGPT4 } =
    Object.fromEntries(formData);

  // Basic validation (already handled by Formik/Yup, but adding server-side validation)
  if (!prompt || prompt.trim() === '') {
    return { errors: [{ message: 'Prompt is required.' }] };
  }

  try {
    // Generate chat title
    const title = await chatApi.generateChatTitle(prompt);

    if (!title) {
      return { errors: [{ message: 'Failed to generate chat title.' }] };
    }

    // Create chat session
    const newChat = await chatApi.createChatSession({
      title,
      prompt,
      selectedComponent,
      temperature: parseFloat(temperature),
      useGPT4: useGPT4 === 'true' || useGPT4 === true,
      sessionId: sessionStorage.getItem('sessionId'),
      workspaceId: sessionStorage.getItem('workspaceId'),
      userId: sessionStorage.getItem('userId'),
      clientApiKey: sessionStorage.getItem('apiKey'),
      newSession: true,
    });

    // Redirect to the new chat session
    return Navigate(
      `/admin/workspaces/${newChat.workspaceId}/chat/${newChat._id}`
    );
  } catch (error) {
    console.error('Error creating chat session:', error);
    return { errors: [{ message: error.message || 'Failed to create chat.' }] };
  }
}

/* *** Create Chat Action *** */
export async function createChatAction({ request }) {
  const formData = await request.formData();
  const firstPrompt = formData.get('firstPrompt');

  // Basic validation
  if (!firstPrompt || firstPrompt.trim() === '') {
    return { errors: [{ message: 'First prompt is required.' }] };
  }

  try {
    // Generate chat title
    const title = await chatApi.generateChatTitle(firstPrompt);

    if (!title) {
      return { errors: [{ message: 'Failed to generate chat title.' }] };
    }

    // Create chat session
    const newChat = await chatApi.createChatSession({
      title,
      firstPrompt,
      sessionId: sessionStorage.getItem('sessionId'),
      workspaceId: sessionStorage.getItem('workspaceId'),
      regenerate: false,
      prompt: firstPrompt,
      userId: sessionStorage.getItem('userId'),
      clientApiKey: sessionStorage.getItem('apiKey'),
      newSession: true,
    });

    // Redirect to the new chat session
    return redirect(`/admin/workspaces/home/chat/${newChat.id}`);
  } catch (error) {
    return { errors: [{ message: error.message }] };
  }
}

/* *** Logout Action *** */
export async function logoutAction() {
  try {
    // clear session storage
    sessionStorage.clear();
    // clear local storage
    localStorage.clear();
    // refresh the page
    window.location.reload();
    // dispatch({ type: 'LOGOUT' }); // Dispatch the logout action
    // navigate('/auth/sign-in'); // Navigate to the sign-in page
    return redirect('/');
  } catch (error) {
    console.error('Logout failed:', error);
    // Even if logout fails, clear local storage and redirect
    sessionStorage.clear();
    localStorage.clear();
    dispatch({ type: 'LOGOUT' });
    return redirect('/auth/sign-in');
    // return { errors: [{ message: error.message }] };
  }
}

/* *** Error Utils *** */
const RootErrorBoundary = Loadable(
  lazy(() => import('utils/app/RouterErrorBoundary.jsx'))
);
export const ErrorBoundary = () => {
  const error = useRouteError();
  return (
    <RootErrorBoundary>
      <NotFoundPage error={error} />
    </RootErrorBoundary>
  );
};

// =========================================================
// Route Components
// =========================================================
export const NewChatDialog = lazy(() => import('components/chat'));
export const NewChatRoute = () => {
  const navigate = useNavigate();

  const handleNewChat = async chatData => {
    try {
      const response = await chatApi.createChatSession(chatData);
      const { chatSessionId } = response.data;
      navigate(`/admin/workspaces/home/chat/${chatSessionId}`);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <NewChatDialog
        open={true}
        onClose={() => navigate(-1)}
        onSubmit={handleNewChat}
      />
    </Suspense>
  );
};
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

const AuthDefault = Loadable(lazy(() => import('views/auth/default')));
const SignInMain = Loadable(lazy(() => import('views/auth/login')));
const SignUpMain = Loadable(lazy(() => import('views/auth/signup')));
const SetUpMain = Loadable(lazy(() => import('views/auth/setup')));

const MainDashboard = Loadable(lazy(() => import('views/admin/default')));
const UserProfile = Loadable(lazy(() => import('views/admin/profile')));

const ChatMain = lazy(() => import('views/admin/chat'));
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
    errorElement: <RootErrorBoundary />,
    icon: <HomeIcon />,
    collapse: true,
    invisible: false,
    items: ['Hero Docs'],
    children: [
      {
        index: true,
        element: <Navigate to="/land/heroDocs" />, // Fallback to Hero Docs
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
    errorElement: <RootErrorBoundary />,
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
                <ChatMain />
              </Suspense>
            ),
            icon: <HomeIcon />,
            description: 'Workspace Home',
            loader: workspaceLoader,
            collapse: false,
          },
          {
            name: 'Active Workspace',
            title: 'ActiveWorkspace',
            path: ':workspaceId',
            breadcrumb: 'Active Workspace',
            element: (
              <Suspense fallback={<LoadingIndicator />}>
                <ChatMain />
              </Suspense>
            ),
            icon: <HomeIcon />,
            description: 'Active Workspace',
            loader: workspaceLoader,
            collapse: true,
            children: [
              {
                index: true,
                element: <Navigate to="/admin/workspaces/:workspaceId/chat" />,
              },
              {
                name: 'Chat',
                title: 'Chat',
                path: 'chat',
                breadcrumb: 'Chat',
                element: (
                  <Suspense fallback={<LoadingIndicator />}>
                    <ChatMain />
                  </Suspense>
                ),
                icon: <AiIcon />,
                collapse: true,
                children: [
                  {
                    index: true,
                    element: (
                      <Navigate to="/admin/workspaces/:workspaceId/chat/:sessionId" />
                    ),
                  },
                  {
                    name: 'Chat',
                    title: 'Chat',
                    path: 'default',
                    breadcrumb: 'Chat',
                    element: (
                      <Suspense fallback={<LoadingIndicator />}>
                        <ChatMain />
                      </Suspense>
                    ),
                    icon: <AiIcon />,
                  },
                  {
                    name: 'Chat Session',
                    title: 'ChatSession',
                    path: ':sessionId', // Dynamic route for chat session
                    breadcrumb: 'Chat Session',
                    element: (
                      <Suspense fallback={<LoadingIndicator />}>
                        <ChatMain />
                      </Suspense>
                    ),
                    icon: <DocumentScannerRoundedIcon />,
                    description: 'Chat Sessions',
                    collapse: false,
                    loader: async ({ params }) => {
                      const { workspaceId, sessionId } = params;
                      try {
                        const chat = await chatApi.getChatSession(sessionId);
                        if (!chat) {
                          throw new Error('Chat session not found');
                        }
                        return {
                          chatSession: chat,
                        };
                      } catch (error) {
                        throw new Response(error.message, { status: 404 });
                      }
                    },
                    // errorElement: (
                    //   <Suspense fallback={<LoadingIndicator />}></Suspense>
                    // ),
                  },
                  {
                    name: 'New Chat',
                    title: 'NewChat',
                    path: 'new',
                    breadcrumb: 'New Chat',
                    element: <NewChatRoute />,
                    action: createChatAction,
                  },
                  {
                    name: 'Chat Mode',
                    title: 'ChatMode',
                    path: ':modeId', // Dynamic modeId route
                    breadcrumb: 'Chat Mode',
                    element: (
                      <Suspense fallback={<LoadingIndicator />}>
                        <ChatMain />
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
                        <ChatMain />
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
      <PublicRoute>
        <Suspense fallback={<LoadingIndicator />}>
          <AuthLayout />
        </Suspense>
      </PublicRoute>
    ),
    errorElement: <RootErrorBoundary />,
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
        onLoginSuccess: (token, userData) => {
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
        onSignupSuccess: (token, userData) => {
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
    errorElement: <RootErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/land/heroDocs" />, // Redirect to '/land/heroDocs'
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
