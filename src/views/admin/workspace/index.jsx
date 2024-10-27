'use client';
/* eslint-disable no-constant-condition */
import React, { useEffect } from 'react';
import {
  Outlet,
  useLoaderData,
  useParams,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { useChatStore } from 'contexts/ChatProvider';

export const MainWorkspace = () => {
  const { workspaceId } = useParams();
  const { workspace } = useLoaderData(); // Loaded via workspaceLoader
  const location = useLocation();
  const navigate = useNavigate();

  const {
    selectedWorkspace,
    selectedChatSession,
    actions: {
      setWorkspaceId,
      setHomeWorkSpace,
      setSelectedWorkspace,
      setSelectedChatSession,
      setChatSessions,
      setAssistants,
      setFolders,
      setPrompts,
      setTools,
    },
  } = useChatStore();

  // Initialize workspace data in the store
  useEffect(() => {
    if (!workspace) {
      // Create or load a default workspace
      const defaultWorkspace = {
        _id: 'default',
        name: 'Default Workspace',
        folders: [],
        chatSessions: [],
        assistants: [],
        prompts: [],
        tools: [],
      };

      setWorkspaceId(defaultWorkspace._id);
      setSelectedWorkspace(defaultWorkspace);
      setFolders(defaultWorkspace.folders);
      setHomeWorkSpace(defaultWorkspace);
      setChatSessions(defaultWorkspace.chatSessions);
      setSelectedChatSession(defaultWorkspace.chatSessions[0] || null); // Ensure this is set
      setAssistants(defaultWorkspace.assistants);
      setPrompts(defaultWorkspace.prompts);
      setTools(defaultWorkspace.tools);
    } else {
      const { chatSessions, assistants, prompts, tools } = workspace[0];

      setWorkspaceId(workspace[0]._id);
      setSelectedWorkspace(workspace[0]);
      setFolders(workspace[0].folders);
      setHomeWorkSpace(workspace[0]);
      setChatSessions(chatSessions);
      setSelectedChatSession(workspace[0]?.chatSessions[0] || null); // Handle undefined
      setAssistants(assistants);
      setPrompts(prompts);
      setTools(tools);
    }
  }, [
    workspace,
    setWorkspaceId,
    setSelectedWorkspace,
    setFolders,
    setHomeWorkSpace,
    setChatSessions,
    setSelectedChatSession,
    setAssistants,
    setPrompts,
    setTools,
  ]);

  // Function to check conditions and navigate if necessary
  useEffect(() => {
    const isValidWorkspace = workspace[0] && workspace[0]._id;
    const isValidChatSession =
      workspace[0].chatSessions[0] && workspace[0].chatSessions[0]._id;
    const isHomePath = location.pathname === '/admin/workspaces/home';
    const isActiveWorkspacePath = location.pathname.startsWith(
      `/admin/workspaces/${workspace[0]._id}`
    );
    if (
      !isActiveWorkspacePath &&
      isValidWorkspace &&
      isValidChatSession &&
      isHomePath
    ) {
      navigate(
        `/admin/workspaces/${workspace[0]._id}/chat/${workspace[0].chatSessions[0]._id}`,
        { replace: true }
      );
    } else {
      // Logging each condition that is not satisfied
      if (!isValidWorkspace) {
        console.warn(
          `Invalid Workspace: ${
            workspace[0]
              ? `Workspace ID is missing. Workspace: ${JSON.stringify(
                  workspace[0]
                )}`
              : 'No workspace selected.'
          }`
        );
      }

      if (!isValidChatSession) {
        console.warn(
          `Invalid Chat Session: ${
            workspace[0].chatSessions[0]
              ? `Chat Session ID is missing. Chat Session: ${JSON.stringify(
                  workspace[0].chatSessions[0]
                )}`
              : 'No chat session selected.'
          }`
        );
      }

      if (!isHomePath) {
        console.warn(
          `Invalid Pathname: Expected '/admin/workspaces/home' but found '${location.pathname}'.`
        );
      }
    }
  }, [
    selectedWorkspace,
    selectedChatSession,
    location.pathname,
    navigate,
    workspace,
  ]);

  return (
    <div>
      {/* Render child routes, e.g., MainChat */}
      <Outlet />
    </div>
  );
};

export default MainWorkspace;
