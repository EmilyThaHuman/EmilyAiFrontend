import { Box, Button, Typography } from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';

import { toast } from '@/services/toastService'; // Updated import
import { executeCode } from 'api/editor';

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Output</title>
    <style>
        .table-container { margin-top: 20px; }
        .code-snippet-table { width: 100%; border-collapse: collapse; }
        .code-snippet-table th, .code-snippet-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .code-snippet-table th { background-color: #f2f2f2; }
        .code-snippet-table tr:hover { background-color: #f5f5f5; }
        .even { background-color: #f9f9f9; }
    </style>
</head>
<body>
    <div id="output"></div>
    <script type="module">
        // JavaScript code will be inserted here
    </script>
</body>
</html>
`;

export const Output = ({ editorRef, language, selectedFile }) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    if ((language === 'html' || language === 'javascript') && output) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(output);
      iframeDoc.close();
    }
  }, [language, output]);

  const runCode = async () => {
    const sourceCode = selectedFile
      ? selectedFile.content
      : editorRef.current.getValue();
    if (!sourceCode) return;

    try {
      setIsLoading(true);
      if (language === 'html') {
        setOutput(sourceCode);
        setIsError(false);
      } else if (language === 'javascript') {
        const modifiedHtml = htmlTemplate.replace(
          '// JavaScript code will be inserted here',
          sourceCode
        );
        setOutput(modifiedHtml);
        setIsError(false);
      } else {
        const { run: result } = await executeCode(language, sourceCode);
        setOutput(result.output);
        setIsError(result.stderr ? true : false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || 'Unable to run code');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box width="100%">
      <Typography variant="h6" mb={2}>
        Output
      </Typography>
      <Button
        variant="outlined"
        color="success"
        sx={{ mb: 2 }}
        disabled={isLoading}
        onClick={runCode}
      >
        Run Code
      </Button>
      {language === 'html' || language === 'javascript' ? (
        <iframe
          ref={iframeRef}
          title="Code Output"
          style={{
            width: '100%',
            height: '75vh',
            border: '1px solid #333',
            borderRadius: '4px',
          }}
        />
      ) : (
        <Box
          height="75vh"
          p={2}
          sx={{
            color: isError ? 'error.main' : 'inherit',
            border: '1px solid',
            borderRadius: 1,
            borderColor: isError ? 'error.main' : '#333',
            whiteSpace: 'pre-wrap',
            overflowY: 'auto',
          }}
        >
          {output ? output : 'Click "Run Code" to see the output here'}
        </Box>
      )}
    </Box>
  );
};

export default Output;
