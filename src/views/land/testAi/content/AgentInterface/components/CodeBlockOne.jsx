// CodeBlock.js
import copy from 'copy-to-clipboard';
import React, { useState } from 'react';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlockOne = ({ language, value }) => {
  const [showPreview, setShowPreview] = useState(false);

  const togglePreview = () => setShowPreview(!showPreview);

  const copyCode = () => {
    copy(value);
    alert('Code copied to clipboard!');
  };

  const downloadCode = () => {
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const isReactComponent = language === 'jsx' || language === 'javascript';

  return (
    <div className="code-block">
      <div className="code-buttons">
        {isReactComponent && (
          <button onClick={togglePreview} className="preview-btn">
            {showPreview ? 'Hide Preview' : 'Preview Code'}
          </button>
        )}
        <button onClick={copyCode} className="copy-btn">
          Copy
        </button>
        <button onClick={downloadCode} className="download-btn">
          Download
        </button>
      </div>

      {showPreview && isReactComponent && (
        <LiveProvider code={value} noInline={true}>
          <div className="live-preview">
            <LivePreview />
            <LiveError />
          </div>
        </LiveProvider>
      )}

      <SyntaxHighlighter language={language} style={coy}>
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlockOne;
