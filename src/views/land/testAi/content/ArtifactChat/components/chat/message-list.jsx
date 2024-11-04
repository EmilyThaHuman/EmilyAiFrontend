import React from 'react';

import { Separator } from '@/components/ui/separator';

import { ChatMessage } from './message';

const models = {
  claude: 'claude',
  gpt4o: 'gpt-4o',
  gpt4oMini: 'gpt-4o-mini',
  gpt35turbo: 'gpt-3.5-turbo',
  gpt4turbo: 'gpt-4-turbo',
};

export function ChatMessageList({
  messages,
  setCurrentArtifact,
  containerRef,
}) {
  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col gap-4 max-w-3xl mx-auto w-full pt-1"
    >
      {messages.map((message, index) => (
        <React.Fragment key={index}>
          <ChatMessage
            role={message.role}
            model={models.claude}
            text={message.content}
            attachments={message.experimental_attachments || []}
            setCurrentArtifact={setCurrentArtifact}
          />
          {index !== messages.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </div>
  );
}

export default {
  ChatMessageList,
};
