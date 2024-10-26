// MainWorkspace.js
'use client';
/* eslint-disable no-constant-condition */
import React, { useEffect } from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';

import { useChatStore } from 'contexts/ChatProvider';

export const MainWorkspace = () => {
  const { workspace } = useLoaderData(); // Loaded via workspaceLoader
  const {
    actions: {
      setWorkspaceId,
      setHomeWorkSpace,
      setSelectedWorkspace,
      setChatSessions,
      setAssistants,
      setFolders,
      setPrompts,
      setTools,
    },
  } = useChatStore();

  // Initialize workspace data in the store
  useEffect(() => {
    if (workspace) {
      const { chatSessions, assistants, prompts, tools } = workspace;

      setWorkspaceId(workspace._id);
      setSelectedWorkspace(workspace);
      setFolders(workspace.folders);
      setHomeWorkSpace(workspace);
      setChatSessions(chatSessions);
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
    setAssistants,
    setPrompts,
    setTools,
  ]);

  if (!workspace) {
    return <div>Loading workspace...</div>;
  }

  return (
    <div>
      {/* Render child routes, e.g., MainChat */}
      <Outlet />
    </div>
  );
};

export default MainWorkspace;
