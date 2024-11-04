'use client';

import { CheckIcon, ClipboardIcon, XIcon } from 'lucide-react';
import PropTypes from 'prop-types';
import { useState } from 'react';

import { useCopyToClipboard } from '@/hooks';
import { Button } from 'components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from 'components/ui/card';
import { Tabs, TabsList, TabsTrigger } from 'components/ui/tabs';

import { HTMLArtifact } from './html';
import { ReactArtifact } from './react';
import { CodeBlock } from '../markdown/code-block';
import Markdown from '../markdown/markdown';

const artifactPreviewSupportedTypes = ['text/html', 'application/react'];

export const ArtifactPanel = ({
  type,
  title,
  language,
  content,
  onClose,
  recording,
  onCapture,
  generating,
}) => {
  const [mode, setMode] = useState('code');

  const { isCopied, copyToClipboard } = useCopyToClipboard({
    timeout: 2000,
  });

  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(content);
  };

  console.log({ type, title, language, content });

  return (
    <Card className="w-full border-none rounded-none flex flex-col h-full max-h-full">
      <CardHeader className="bg-slate-50 rounded-lg border rounded-b-none py-2 px-4 flex flex-row items-center gap-4 justify-between space-y-0">
        <span className="font-semibold">{title || 'Generating...'}</span>

        <div className="flex gap-2 items-center">
          {type &&
            artifactPreviewSupportedTypes.includes(type) &&
            !generating && (
              <Tabs value={mode} onValueChange={value => setMode(value)}>
                <TabsList className="bg-slate-200">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                </TabsList>
              </Tabs>
            )}

          <Button onClick={onClose} size="icon" variant="ghost">
            <XIcon className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent
        id="artifact-content"
        className="border-l border-r p-0 w-full flex-1 max-h-full overflow-hidden relative"
      >
        {type === 'text/markdown' && (
          <Markdown
            text={content}
            className="h-full max-h-full overflow-auto py-4 px-4"
          />
        )}

        {type === 'application/code' && language && (
          <CodeBlock
            language={language}
            value={content}
            showHeader={false}
            className="h-full max-h-full overflow-auto"
          />
        )}

        {type === 'application/react' && (
          <ReactArtifact
            code={content}
            mode={mode}
            recording={recording}
            onCapture={onCapture}
          />
        )}

        {type === 'text/html' && (
          <HTMLArtifact
            code={content}
            mode={mode}
            recording={recording}
            onCapture={onCapture}
          />
        )}
      </CardContent>

      <CardFooter className="bg-slate-50 border rounded-lg rounded-t-none py-2 px-4 flex items-center flex-row-reverse gap-4">
        <Button
          onClick={onCopy}
          size="icon"
          variant="outline"
          className="w-8 h-8"
        >
          {isCopied ? (
            <CheckIcon className="w-4 h-4" />
          ) : (
            <ClipboardIcon className="w-4 h-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

ArtifactPanel.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string,
  language: PropTypes.string,
  content: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  recording: PropTypes.bool.isRequired,
  onCapture: PropTypes.func.isRequired,
  generating: PropTypes.bool,
};
