import { useCopilotChat } from '@copilotkit/react-core';
import { Role, TextMessage } from '@copilotkit/runtime-client-gql';

export function CoPilotAssistant() {
  const {
    visibleMessages,
    appendMessage,
    setMessages,
    deleteMessage,
    reloadMessages,
    stopGeneration,
    isLoading,
  } = useCopilotChat();

  const sendMessage = content => {
    appendMessage(new TextMessage({ content, role: Role.User }));
  };
  // Define Copilot readable state
  useCopilotReadable({
    description: "The current user's colleagues",
    value: colleagues,
  });

  useCopilotAction({
    name: 'simpleAction',
    description: 'A simple action with string rendering',
    parameters: [
      {
        name: 'taskName',
        type: 'string',
        description: 'Name of the task',
        required: true,
      },
    ],
    handler: async ({ taskName }) => {
      return await longRunningOperation(taskName);
    },

    render: ({ status, result }) => {
      return status === 'complete' ? result : 'Processing...';
    },
  });

  return <div>{/* Implement your custom chat UI here */}</div>;
}

export default CoPilotAssistant;
