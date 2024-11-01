import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { detectLanguage } from 'utils/format';

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  overflow: 'auto',
}));

export function FileViewerDialog({
  open,
  onClose,
  selectedItem,
  fileContent,
  loading,
  language,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>File Viewer</DialogTitle>
      <StyledDialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : selectedItem ? (
          <>
            <Typography variant="h6" gutterBottom>
              {selectedItem.name}
            </Typography>
            <SyntaxHighlighter
              language={detectLanguage(selectedItem.name)}
              style={docco}
            >
              {fileContent || 'No content available.'}
            </SyntaxHighlighter>
          </>
        ) : (
          <Typography variant="body1">
            Select a file to view its content
          </Typography>
        )}
      </StyledDialogContent>
    </Dialog>
  );
}

FileViewerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedItem: PropTypes.object,
  fileContent: PropTypes.string,
  loading: PropTypes.bool,
};

export default FileViewerDialog;
