import { Alert } from '@mui/material';
import { AlertCircle, Eye, Loader2 } from 'lucide-react';
import React, { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Utility to detect code type
const detectCodeType = code => {
  const patterns = {
    react: /(import.*?react|useState|useEffect|<.*?\/>)/i,
    html: /<[^>]*>/,
    tailwind: /class(Name)?="[^"]*?(bg-|text-|flex|grid|p-|m-)/,
    unsupportedLibs:
      /(styled-components|@emotion|@material-ui|chakra|nextui|mantine|bootstrap|jquery)/i,
  };

  const types = [];
  if (patterns.react.test(code)) types.push('react');
  if (patterns.html.test(code)) types.push('html');
  if (patterns.tailwind.test(code)) types.push('tailwind');

  const unsupportedMatches = code.match(patterns.unsupportedLibs);
  return {
    types,
    unsupportedLib: unsupportedMatches ? unsupportedMatches[0] : null,
  };
};

// Safe component renderer
const SafePreview = ({ code }) => {
  const [count, setCount] = useState(0);

  // Example components that can be safely rendered
  const components = {
    Counter: () => (
      <div className="p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Counter Component</h2>
        <p className="text-gray-600">Count: {count}</p>
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => setCount(prev => prev + 1)}
        >
          Increment
        </button>
      </div>
    ),
    SimpleDiv: () => (
      <div className="p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Simple Component</h2>
        <p className="text-gray-600">This is a basic example</p>
      </div>
    ),
    ErrorBoundary: ({ error }) => (
      <div className="p-4 bg-red-50 text-red-500 rounded-md">
        Error rendering preview: {error}
      </div>
    ),
  };

  try {
    // For HTML content, render it directly
    if (code.trim().startsWith('<') && !code.includes('useState')) {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: code }}
          className="preview-container"
        />
      );
    }

    // For React components, render a safe example
    return <components.Counter />;
  } catch (error) {
    return <components.ErrorBoundary error={error.message} />;
  }
};

const PreviewDialogButton = ({ codeContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewState, setPreviewState] = useState({
    loading: false,
    error: null,
    code: codeContent,
    needsConversion: false,
    conversionInProgress: false,
  });

  const handleConversion = async () => {
    setPreviewState(prev => ({ ...prev, conversionInProgress: true }));

    // Mock conversion - in reality, this would call your OpenAI API
    await new Promise(resolve => setTimeout(resolve, 1500));

    const convertedCode = `
      () => (
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Converted Component</h2>
          <p className="text-gray-600">This was converted to use Tailwind</p>
        </div>
      )
    `;

    setPreviewState(prev => ({
      ...prev,
      code: convertedCode,
      needsConversion: false,
      conversionInProgress: false,
      error: null,
    }));
  };

  const renderPreview = () => {
    if (previewState.conversionInProgress) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Converting code...</span>
        </div>
      );
    }

    if (previewState.needsConversion) {
      return (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          {/* <AlertTitle>Unsupported Libraries Detected</AlertTitle>
          <AlertDescription>
            <p className="mb-2">{previewState.error}</p>
            <button
              onClick={handleConversion}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Convert to Supported Format
            </button>
          </AlertDescription> */}
        </Alert>
      );
    }

    return <SafePreview code={previewState.code} />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-md 
                     bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          aria-label="Preview code"
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Live Preview</DialogTitle>
          <DialogDescription>
            Detected formats:{' '}
            {detectCodeType(previewState.code).types.join(', ')}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 bg-white rounded-lg border">
          {isOpen && renderPreview()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
