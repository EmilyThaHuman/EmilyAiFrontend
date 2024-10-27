// CodePreview.js
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';

function CodePreview({ code }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [code]);

  return (
    <Box
      ref={scrollRef}
      sx={{
        width: '100%',
        px: 2,
        bgcolor: 'black',
        color: 'green',
        whiteSpace: 'nowrap',
        display: 'flex',
        overflowX: 'auto',
        fontFamily: 'monospace',
        fontSize: '10px',
        my: 4,
      }}
    >
      {code}
    </Box>
  );
}

CodePreview.propTypes = {
  code: PropTypes.string.isRequired,
};

export default CodePreview;
