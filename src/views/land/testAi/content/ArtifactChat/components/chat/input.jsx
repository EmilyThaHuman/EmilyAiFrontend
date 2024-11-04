'use strict';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  CircleStopIcon,
  Loader2Icon,
  MicIcon,
  PaperclipIcon,
  PauseIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Textarea from 'react-textarea-autosize';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import useEnterSubmit from '@/hooks/util/useEnterSubmit';
import { getSettings, updateSettings } from '@/lib/userSettings';
import { convertFileToBase64 } from '@/lib/utils/fileUtils';

import { AttachmentPreviewButton } from './attachment-preview-button';

const models = {
  claude: 'claude',
  gpt4o: 'gpt-4o',
  gpt4oMini: 'gpt-4o-mini',
  gpt35turbo: 'gpt-3.5-turbo',
  gpt4turbo: 'gpt-4-turbo',
};

export const ChatInput = ({
  input,
  setInput,
  onSubmit,
  isLoading,
  recording,
  onStartRecord,
  onStopRecord,
  attachments,
  onRemoveAttachment,
  onAddAttachment,
  showScrollButton,
  handleManualScroll,
  stopGenerating,
}) => {
  const inputRef = useRef(null);
  const { onKeyDown } = useEnterSubmit({ onSubmit });
  const [model, setModel] = useState(getSettings().model);
  const fileInputRef = useRef(null);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async e => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newAttachments = await Promise.all(
        filesArray.map(async file => ({
          url: await convertFileToBase64(file),
          name: file.name,
          contentType: file.type,
        }))
      );
      onAddAttachment(newAttachments);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleModelChange = newModel => {
    setModel(newModel);
    updateSettings({ ...getSettings(), model: newModel });
  };

  return (
    <div className="sticky bottom-0 mx-auto w-full pt-6 flex flex-col gap-4 items-center">
      {showScrollButton && (
        <Button
          onClick={handleManualScroll}
          variant="outline"
          size="icon"
          className="rounded-full shadow-lg w-8 h-8"
        >
          <ArrowDownIcon className="h-4 w-4" />
        </Button>
      )}

      <div className="w-full flex flex-col gap-1 bg-[#F4F4F4] p-2.5 pl-4 rounded-md border border-b-0 rounded-b-none shadow-md">
        {attachments && (
          <div className="flex items-center gap-2 mb-2">
            {attachments.map((attachment, index) => (
              <AttachmentPreviewButton
                key={index}
                value={attachment}
                onRemove={onRemoveAttachment}
              />
            ))}
          </div>
        )}

        <div className="flex gap-2 items-start">
          <Textarea
            ref={inputRef}
            tabIndex={0}
            onKeyDown={onKeyDown}
            placeholder="Send a message."
            className="min-h-15 max-h-96 overflow-auto w-full bg-transparent border-none resize-none focus-within:outline-none"
            // autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            name="message"
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 bg-transparent"
            onClick={handleFileUpload}
          >
            <PaperclipIcon className="w-4 h-4" />
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => (recording ? onStopRecord() : onStartRecord())}
                  size="icon"
                  variant="outline"
                  className="w-8 h-8 bg-transparent disabled:pointer-events-auto"
                >
                  {recording ? (
                    <PauseIcon className="w-4 h-4" />
                  ) : (
                    <MicIcon className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {getSettings().openaiApiKey
                    ? 'Click to record voice and crop artifacts for editing'
                    : 'Missing OpenAI API Key in Settings for Speech to Text'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            onClick={isLoading ? stopGenerating : onSubmit}
            size="icon"
            className="w-8 h-8"
          >
            {isLoading ? (
              <CircleStopIcon className="w-4 h-4" />
            ) : (
              <ArrowUpIcon className="w-4 h-4" />
            )}
          </Button>
        </div>

        <Select value={model || undefined} onValueChange={handleModelChange}>
          <SelectTrigger className="w-fit bg-[#F4F4F4] flex items-center gap-2 border-none">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent className="w-fit">
            <SelectItem value={models.claude}>Claude Sonnet</SelectItem>
            <SelectItem value={models.gpt4oMini}>GPT-4o Mini</SelectItem>
            <SelectItem value={models.gpt4o}>GPT-4o</SelectItem>
            <SelectItem value={models.gpt4turbo}>GPT-4 Turbo</SelectItem>
            <SelectItem value={models.gpt35turbo}>GPT-3.5 Turbo</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default {
  ChatInput,
};
