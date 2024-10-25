import React, { useState } from 'react';
import { FaHourglass } from 'react-icons/fa';
import {
  Excalidraw,
  useHandleLibrary,
  exportToCanvas,
} from '@excalidraw/excalidraw';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';

function Whiteboard({ doCreate, closeWhiteboard }) {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  useHandleLibrary({ excalidrawAPI });

  const exportImg = async () => {
    if (!excalidrawAPI) {
      return;
    }

    const elements = excalidrawAPI.getSceneElements();
    if (!elements || !elements.length) {
      return;
    }

    const canvas = await exportToCanvas({
      elements,
      appState: {
        exportWithDarkMode: false,
      },
      files: excalidrawAPI.getFiles(),
    });

    doCreate([canvas.toDataURL()]);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      {Excalidraw ? (
        <Excalidraw
          renderTopRightUI={() => (
            <>
              <Tooltip title="Export Image">
                <IconButton
                  onClick={exportImg}
                  sx={{
                    margin: '4px',
                    opacity: 0.7,
                    '&:hover': { opacity: 1 },
                  }}
                >
                  <FaHourglass color="#b100e8" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Close Whiteboard">
                <IconButton
                  onClick={closeWhiteboard}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    top: 8,
                    opacity: 0.7,
                    '&:hover': { opacity: 1 },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
          excalidrawRef={api => setExcalidrawAPI(api)}
        />
      ) : null}
    </Box>
  );
}

export default Whiteboard;
