import { useChat } from 'ai/react';
import { Loader2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSupabaseChatStore } from '@/contexts';
import { useFakeWhisper } from '@/hooks/chat/useFakeWhisper';
import { useScrollAnchor } from '@/hooks/ui/useScrollAnchor';
import useMutation from '@/hooks/util/useMutation';
import { getSettings } from '@/lib/userSettings';
import { toast } from '@/services/toastService';

import { ArtifactPanel } from '../artifact';
import { ChatInput } from './input';
import { ChatMessageList } from './message-list';

import { apiUtils } from '@/lib/apiUtils'; // Import your apiUtils

export function ChatPanel({ id }) {
  const settings = getSettings();
  const { supabase } = useSupabaseChatStore();
  const navigate = useNavigate();

  const [chatId, setChatId] = useState(id);
  const [initialMessages, setInitialMessages] = useState([]);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const [currentArtifact, setCurrentArtifact] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [selectedArtifacts, setSelectedArtifacts] = useState([]);
  const [chats, setChats] = useState([]); // Local state to manage chats

  // Custom useMutation hooks
  const {
    mutate: createChatMutate,
    isLoading: creatingChat,
    error: createChatError,
  } = useMutation('POST');

  const {
    mutate: addMessageMutate,
    isLoading: addingMessage,
    error: addMessageError,
  } = useMutation('POST');

  const {
    mutate: fetchMessagesMutate,
    isLoading: fetchingMessagesLoading,
    error: fetchMessagesError,
    data: fetchedMessagesData,
  } = useMutation('GET');

  const fetchMessages = async () => {
    if (chatId) {
      setFetchingMessages(true);
      try {
        const data = await apiUtils.get(`/chats/${chatId}/messages`);
        setInitialMessages(
          data.map(message => ({
            id: String(message.id),
            role: message.role,
            content: message.text,
            experimental_attachments: message.attachments || [],
          }))
        );
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to fetch messages');
      } finally {
        setFetchingMessages(false);
      }
    } else {
      setInitialMessages([]);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  const {
    messages,
    input,
    setInput,
    append,
    stop: stopGenerating,
    isLoading: generatingResponse,
  } = useChat({
    initialMessages,
    onFinish: async message => {
      if (chatId) {
        await addMessageMutate(`/chats/${chatId}/messages`, message);
      }
    },
    sendExtraMessageFields: true,
  });

  const { messagesRef, scrollRef, showScrollButton, handleManualScroll } =
    useScrollAnchor(messages);

  useEffect(() => {
    const createNewChat = async () => {
      if (!chatId && messages.length === 2 && !generatingResponse) {
        try {
          const newChat = await createChatMutate('/chats', {
            title: messages[0].content.slice(0, 100),
          });

          // Update local chats state
          setChats(prevChats => [...prevChats, newChat]);
          setChatId(newChat.id);

          // Add the first two messages to the new chat
          await addMessageMutate(`/chats/${newChat.id}/messages`, messages[0]);
          await addMessageMutate(`/chats/${newChat.id}/messages`, messages[1]);

          navigate(`/chat/NewChat/${newChat.id}`);
        } catch (error) {
          console.error('Error creating chat:', error);
          toast.error('Failed to create chat');
        }
      }
    };

    createNewChat();
  }, [chatId, messages, generatingResponse]);

  const useWhisperHook = settings.openaiApiKey
    ? useRealWhisper
    : useFakeWhisper;
  const { recording, transcribing, transcript, startRecording, stopRecording } =
    useWhisperHook({
      apiKey: settings.openaiApiKey,
    });

  useEffect(() => {
    if (!recording && !transcribing && transcript?.text) {
      setInput(prev => prev + ` ${transcript.text}`);
    }
  }, [recording, transcribing, transcript?.text, setInput]);

  const handleCapture = ({ selectionImg, artifactImg }) => {
    setAttachments(prev => [
      ...prev,
      {
        contentType: 'image/png',
        url: selectionImg,
      },
    ]);

    setSelectedArtifacts(prev => {
      if (prev.includes(artifactImg)) return prev;
      return [...prev, artifactImg];
    });
  };

  const handleAddAttachment = newAttachments => {
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const handleRemoveAttachment = attachment => {
    setAttachments(prev => prev.filter(item => item.url !== attachment.url));
  };

  const handleSend = async () => {
    const query = input.trim();
    if (!query) return;

    const settings = getSettings();

    if (settings.model === 'claude' && !settings.anthropicApiKey) {
      toast.error('Please enter your Claude API Key');
      return;
    }

    if (settings.model.startsWith('gpt') && !settings.openaiApiKey) {
      toast.error('Please enter your OpenAI API Key');
      return;
    }

    const messageAttachments = [
      ...attachments
        .filter(item => item.contentType?.startsWith('image'))
        .map(item => ({ url: item.url, contentType: item.contentType })),
      ...selectedArtifacts.map(url => ({ url })),
    ];

    append(
      {
        role: 'user',
        content: query,
        experimental_attachments: messageAttachments,
      },
      {
        body: {
          model: settings.model,
          apiKey: settings.model.startsWith('gpt')
            ? settings.openaiApiKey
            : settings.anthropicApiKey,
        },
      }
    );

    setInput('');
    stopRecording();

    if (chatId) {
      try {
        await addMessageMutate(`/chats/${chatId}/messages`, {
          role: 'user',
          content: query,
          attachments: messageAttachments,
        });
      } catch (error) {
        console.error('Error adding message:', error);
        toast.error('Failed to add message');
      }
    }

    setAttachments([]);
    setSelectedArtifacts([]);
  };

  return (
    <>
      <div
        className="relative flex w-full flex-1 overflow-x-hidden overflow-y-scroll pt-6"
        ref={scrollRef}
      >
        <div className="relative mx-auto flex h-full w-full min-w-[400px] max-w-3xl flex-1 flex-col md:px-2">
          {fetchingMessages && <Loader2Icon className="animate-spin mx-auto" />}

          <ChatMessageList
            messages={messages}
            setCurrentArtifact={setCurrentArtifact}
            containerRef={messagesRef}
          />

          <ChatInput
            input={input}
            setInput={setInput}
            onSubmit={handleSend}
            isLoading={generatingResponse}
            recording={recording}
            onStartRecord={startRecording}
            onStopRecord={stopRecording}
            attachments={attachments}
            onAddAttachment={handleAddAttachment}
            onRemoveAttachment={handleRemoveAttachment}
            showScrollButton={showScrollButton}
            handleManualScroll={handleManualScroll}
            stopGenerating={stopGenerating}
          />
        </div>
      </div>

      {currentArtifact && (
        <div className="w-full max-w-xl h-full max-h-full pt-6 pb-4">
          <ArtifactPanel
            title={currentArtifact.title}
            id={currentArtifact.id}
            type={currentArtifact.type}
            generating={currentArtifact.generating}
            content={currentArtifact.content}
            language={currentArtifact.language}
            onClose={() => setCurrentArtifact(null)}
            recording={recording}
            onCapture={handleCapture}
          />
        </div>
      )}
    </>
  );
}

export default ChatPanel;
