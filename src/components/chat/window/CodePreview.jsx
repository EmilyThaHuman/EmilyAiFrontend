import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';

/**
 * CodePreview Component
 *
 * @param {Object} props
 * @param {string} props.code - The JSX code to preview.
 * @param {string} props.language - The language of the code (e.g., 'jsx', 'tsx').
 */
export function CodePreview({ code, language }) {
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState(null);
  const previewContainerRef = useRef(null);

  useEffect(() => {
    if (!showPreview || language !== 'jsx') return;

    const renderPreview = async () => {
      try {
        // Clear any previous errors
        setError(null);

        // Create sandbox iframe for preview
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '200px';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '8px'; // Equivalent to Tailwind's rounded-lg

        const previewContainer = previewContainerRef.current;
        if (previewContainer) {
          previewContainer.innerHTML = '';
          previewContainer.appendChild(iframe);

          // Write content to iframe
          const html = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8" />
                <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
                <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
              </head>
              <body>
                <div id="root"></div>
                <script type="text/babel">
                  ${code}

                  // Automatically render the last exported component
                  const exports = {};
                  ${code}
                  if (exports.default) {
                    ReactDOM.render(
                      React.createElement(exports.default),
                      document.getElementById('root')
                    );
                  }
                </script>
              </body>
            </html>
          `;

          iframe.contentWindow.document.open();
          iframe.contentWindow.document.write(html);
          iframe.contentWindow.document.close();
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to render preview'
        );
      }
    };

    renderPreview();

    // Cleanup function to revoke object URLs or perform any necessary cleanup
    return () => {
      if (previewContainerRef.current) {
        previewContainerRef.current.innerHTML = '';
      }
    };
  }, [code, language, showPreview]);

  // If the language is not JSX or TSX, do not render the preview
  if (language !== 'jsx' && language !== 'tsx') {
    return null;
  }

  return (
    <Card
      sx={{
        mt: 2,
        p: 2,
        backgroundColor: 'grey.900',
        border: '1px solid',
        borderColor: 'grey.800',
        borderRadius: 2, // Equivalent to Tailwind's rounded-lg
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Typography variant="subtitle2" color="grey.200">
          Live Preview
        </Typography>
        <IconButton
          onClick={() => setShowPreview(!showPreview)}
          aria-label={showPreview ? 'Hide preview' : 'Show preview'}
          sx={{
            color: 'grey.400',
            '&:hover': {
              color: 'common.white',
            },
          }}
        >
          {showPreview ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>
      </Box>

      {showPreview && (
        <>
          <Box
            ref={previewContainerRef}
            sx={{
              minHeight: '200px',
              backgroundColor: 'common.white',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            {/* Preview will be rendered here */}
          </Box>
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              Preview Error: {error}
            </Typography>
          )}
        </>
      )}
    </Card>
  );
}

export default CodePreview;
