// PreviewTab.js
import React, { useEffect, useRef, useState } from 'react';
import useThrottle from '../hooks/useThrottle';
import { FaBug } from 'react-icons/fa';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

function PreviewTab({ code, device, appState, fixBug }) {
  const throttledCode = useThrottle(code, 500);
  const iframeRef = useRef(null);
  const [showDebug, setShowDebug] = useState(false);
  const [errorObj, setErrorObj] = useState({
    message: '',
    stack: '',
  });

  useEffect(() => {
    const iframe = iframeRef.current;
    const errorIframe = `
    <script>
      window.addEventListener('error', (event) => {
          window.parent.postMessage({
            message: event.message,
            error: event.error
          }, '*')
      })
    </script>  
    `;
    let content = '';
    if (appState === 'CODE_READY' && throttledCode) {
      var patternHead = /<title[^>]*>((.|[\n\r])*)<\/title>/im;
      const headMatch = throttledCode.match(patternHead);
      if (headMatch) {
        const headContent = headMatch[0] + errorIframe;
        content = throttledCode.replace(patternHead, headContent);
      }

      if (iframe && iframe.contentDocument) {
        iframe.contentDocument.open();
        iframe.contentDocument.write(content || code);
        iframe.contentDocument.close();
      }
    }
  }, [throttledCode, appState]);

  useEffect(() => {
    const messageHandler = e => {
      if (e.data && e.data.error) {
        setErrorObj({
          message: e.data.error.message,
          stack: e.data.error.stack,
        });
        setShowDebug(true);
      }
    };
    window.addEventListener('message', messageHandler);
    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, []);

  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center', mx: 2, height: '100%' }}
    >
      {showDebug && (
        <IconButton
          onClick={() => {
            fixBug(errorObj);
          }}
          sx={{
            color: 'red',
            position: 'absolute',
            right: 56,
            top: 64,
            zIndex: 50,
            '&:hover': { bgcolor: 'grey.200' },
            borderRadius: 1,
            p: 2,
          }}
        >
          <FaBug />
        </IconButton>
      )}
      {/* Uncomment and style the iframe as needed */}
      {/* <iframe
        id={`preview-${device}`}
        ref={iframeRef}
        title="Preview"
        style={{
          border: "4px solid black",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
          width: "100%",
          transform: "scale(0.9)",
          transformOrigin: "top",
        }}
      ></iframe> */}
    </Box>
  );
}

PreviewTab.propTypes = {
  code: PropTypes.string.isRequired,
  device: PropTypes.oneOf(['mobile', 'desktop']).isRequired,
  appState: PropTypes.string.isRequired,
  fixBug: PropTypes.func.isRequired,
};

export default PreviewTab;
