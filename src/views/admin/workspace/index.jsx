'use client';
/* eslint-disable no-constant-condition */
import React, { useEffect } from 'react';
import { useNavigate, useLoaderData } from 'react-router-dom';

import { useChatStore } from 'contexts/ChatProvider';

export const MainWorkspace = () => {
  const navigate = useNavigate();
  const { workspace } = useLoaderData(); // The workspace object returned from your loader
  const {
    actions: {
      setWorkspaceId,
      setHomeWorkSpace,
      setSelectedWorkspace,
      setChatSessions,
      setSessionId,
      setSelectedChatSession,
      setAssistants,
      setFolders,
      setPrompts,
      setTools,
    },
  } = useChatStore();

  // UseEffect for workspace initialization
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

      if (chatSessions?.length > 0) {
        setSessionId(chatSessions[0]._id);
        setSelectedChatSession(chatSessions[0]);
      }
    }
  }, [workspace]);

  // If workspace is not available, show loading or navigate
  if (!workspace) {
    return <div>Loading workspace...</div>;
  }

  return (
    <div>
      {/* Render the MainChat component, passing necessary props if needed */}
      <MainChat workspace={workspace} />
    </div>
  );
};

export default MainWorkspace;
