import { createBrowserHistory } from 'history';
import React, { lazy, Suspense, useState } from 'react';
import {
  Form,
  Navigate,
  createBrowserRouter,
  redirect,
  useActionData,
} from 'react-router-dom';

import { chatApi } from 'api/Ai/chat-sessions';
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
import { Loadable } from 'layouts/navigation/navbar/components';
import { dispatch, setField } from 'store/index';

/* *** Router Utils *** */
const NewChatForm = () => {
  const actionData = useActionData();
  const [firstPrompt, setFirstPrompt] = useState('');

  return (
    <Form method="post">
      <h2>Start a New Chat</h2>
      {actionData?.errors && (
        <ul>
          {actionData.errors.map((error, index) => (
            <li key={index}>{error.message}</li>
          ))}
        </ul>
      )}
      <textarea
        name="firstPrompt"
        value={firstPrompt}
        onChange={e => setFirstPrompt(e.target.value)}
        placeholder="Enter your first prompt..."
        required
      />
      <button type="submit">Create Chat</button>
    </Form>
  );
};

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
/* *** Layouts *** */
const BlankLayout = Loadable(lazy(() => import('layouts/blank')));
const AdminLayout = Loadable(lazy(() => import('layouts/admin')));
const AuthLayout = Loadable(lazy(() => import('layouts/auth')));
const ChatLayout = Loadable(lazy(() => import('layouts/chat')));
const RouterLayout = Loadable(lazy(() => import('layouts/router')));
/* *** Views *** */
const HeroDocs = Loadable(lazy(() => import('views/land/heroDocs')));

const SignInCentered = Loadable(lazy(() => import('views/auth/signIn')));
const SignUpCentered = Loadable(lazy(() => import('views/auth/signUp')));

const MainDashboard = Loadable(lazy(() => import('views/admin/default')));
const UserProfile = Loadable(lazy(() => import('views/admin/profile')));

const ChatMain = lazy(() => import('views/admin/chat'));
const CodeEditor = Loadable(lazy(() => import('views/admin/editor')));

export const customHistory = createBrowserHistory();

customHistory.listen((location, action) => {
  console.log(`[History]: ${action} - ${location.pathname}`);
});

// =========================================================
// Route Actions
// =========================================================
export function LogoutRoute() {
  return <p>Logging out...</p>;
}

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
            collapse: false,
          },
          {
            name: 'Active Workspace',
            title: 'ActiveWorkspace',
            path: ':workspaceId', // Dynamic route for workspace
            breadcrumb: 'Active Workspace',
            element: (
              <Suspense fallback={<LoadingIndicator />}>
                <ChatMain />
              </Suspense>
            ),
            icon: <HomeIcon />,
            description: 'Active Workspace',
            collapse: true,
            children: [
              {
                index: true,
                element: <Navigate to="/admin/workspaces/:workspaceId/chat" />, // Fallback to Workspace Chat
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
                    ), // Fallback to Workspace Chat Session
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
                  // {
                  //   name: 'New Chat',
                  //   title: 'NewChat',
                  //   path: 'new',
                  //   breadcrumb: 'New Chat',
                  //   element: (
                  //     <Suspense fallback={<LoadingIndicator />}>
                  //       <NewChatForm />
                  //     </Suspense>
                  //   ),
                  //   icon: <AiIcon />,
                  //   action: async ({ request }) => {
                  //     const formData = await request.formData();
                  //     const firstPrompt = formData.get('firstPrompt');

                  //     try {
                  //       // Make API call to create a new chat session
                  //       const response =
                  //         await chatApi.getNewChatSessionWithCompletion(
                  //           '/chats',
                  //           {
                  //             firstPrompt,
                  //           }
                  //         );
                  //       const { chatId } = response.data;

                  //       // Redirect to the new chat session
                  //       return redirect(
                  //         `/admin/workspaces/${chatId}/chat/${chatId}`
                  //       );
                  //     } catch (error) {
                  //       console.error('Error creating chat session:', error);
                  //       return {
                  //         errors: [
                  //           { message: 'Failed to create chat session.' },
                  //         ],
                  //       };
                  //     }
                  //   },
                  // },
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
                        return { chatSession: chat };
                      } catch (error) {
                        throw new Response(error.message, { status: 404 });
                      }
                    },
                    // action: async ({ request, params }) => {
                    //   const { sessionId } = params;
                    //   const formData = await request.formData();
                    //   const message = formData.get('message');

                    //   if (!message || message.trim() === '') {
                    //     return {
                    //       errors: [{ message: 'Message cannot be empty.' }],
                    //     };
                    //   }

                    //   try {
                    //     // Update chat session with new message via API
                    //     await updateChatSession(sessionId, message);

                    //     // Optionally, you can refetch the chat session or handle AI response
                    //     return redirect(
                    //       `/admin/workspaces/${params.workspaceId}/chat/${sessionId}`
                    //     );
                    //   } catch (error) {
                    //     return { errors: [{ message: error.message }] };
                    //   }
                    // },
                  },
                  {
                    name: 'New Chat',
                    title: 'NewChat',
                    path: 'new',
                    breadcrumb: 'New Chat',
                    element: <NewChatForm />,
                    action: createChatAction,
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
      // Optional: Templates section
      // {
      //   name: 'Templates',
      //   title: 'Templates',
      //   path: 'templates',
      //   breadcrumb: 'Templates',
      //   element: (
      //     <Suspense fallback={<LoadingIndicator />}>
      //       <BlankLayout />
      //     </Suspense>
      //   ),
      //   icon: <DocumentScannerRoundedIcon />,
      //   collapse: true,
      //   children: [
      //     {
      //       index: true,
      //       name: 'Templates Home',
      //       title: 'TemplatesHome',
      //       path: 'templates-home',
      //       breadcrumb: 'Templates Home',
      //       element: <Templates />,
      //       icon: <HomeIcon />,
      //       description: 'Templates',
      //       collapse: false,
      //     },
      //   ],
      // },
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
    errorElement: <RootErrorBoundary />,
    icon: <LockIcon />,
    collapse: true,
    children: [
      {
        index: true,
        element: <Navigate to="sign-in" replace />,
      },
      {
        name: 'Sign In',
        title: 'SignIn',
        path: 'sign-in',
        breadcrumb: 'Sign In',
        element: <SignInCentered />,
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
        element: <SignUpCentered />,
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
        element: <Navigate to="/land/heroDocs" />,
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
