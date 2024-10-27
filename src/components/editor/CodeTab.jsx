// CodeTab.js
import React from 'react';
import Button from '@mui/material/Button';
import copy from 'copy-to-clipboard';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import * as monaco from 'monaco-editor';
import Editor, { loader } from '@monaco-editor/react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';

loader.config({ monaco });

function CodeTab({ code, setCode, settings }) {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        border: '1px solid',
        borderColor: 'grey.400',
      }}
    >
      <Editor
        defaultLanguage="html"
        defaultValue=""
        value={code}
        onChange={value => {
          setCode(value || '');
        }}
      />
    </Box>
  );
}

CodeTab.propTypes = {
  code: PropTypes.string.isRequired,
  setCode: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
};

export default CodeTab;
