import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { detectLanguage } from 'utils/format';

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  // Add any custom styles from StyledPaper here
  padding: theme.spacing(2),
  height: '100%',
  overflow: 'auto',
}));

export function FileViewerDialog({ open, onClose, selectedFile }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>File Viewer</DialogTitle>
      <StyledDialogContent>
        {selectedFile ? (
          <>
            <Typography variant="h6" gutterBottom>
              {selectedFile.name}
            </Typography>
            <SyntaxHighlighter
              language={detectLanguage(selectedFile.name)}
              style={docco}
            >
              {selectedFile.content}
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

export default FileViewerDialog;
