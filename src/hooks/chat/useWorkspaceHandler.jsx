import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { userApi } from 'api/user';
import { useChatStore } from 'contexts/ChatProvider';

export const useWorkspaceHandler = () => {
  const {
    actions: { setSelectedWorkspace, setWorkspaceId, setWorkspaces },
  } = useChatStore();
  const navigate = useNavigate();

  const handleWorkspaceChange = useCallback(
    (workspaceId, workspaceName) => {
      setWorkspaceId(workspaceId);
      setSelectedWorkspace(workspaceName);
      navigate(`/admin/workspace/${workspaceId}`);
    },
    [setWorkspaceId, setSelectedWorkspace, navigate]
  );
  const setupWorkspaceAndNavigate = async userId => {
    const workspaces = await userApi.getWorkspacesByUserId(userId);
    const homeWorkspace = workspaces.find(w => w.isHome);
    const list = JSON.parse(sessionStorage.getItem('dataPopulationChecklist'));

    setWorkspaces(workspaces);
    setSelectedWorkspace(homeWorkspace);
    setWorkspaceId(homeWorkspace?._id);
    const updatedList = {
      ...list,
      workspaces: 'true',
    };
    sessionStorage.setItem(
      'dataPopulationChecklist',
      JSON.stringify(updatedList)
    );
    return navigate(`/admin/workspaces/${homeWorkspace?._id}`);
  };
  return {
    handleWorkspaceChange,
    setupWorkspaceAndNavigate,
  };
};

export default useWorkspaceHandler;
