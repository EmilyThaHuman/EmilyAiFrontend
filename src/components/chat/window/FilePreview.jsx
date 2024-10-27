import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Card, IconButton, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import React, { useEffect, useState } from 'react';
export const getFilePreviewContent = async file => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      e.preventDefault();
      resolve(
        e.target && e.target.result ? e.target.result.slice(0, 200) + '...' : ''
      );
    };
    reader.readAsText(file);
  });
};
/**
 * Styled Components using MUI's styled API
 */

// Styled Card with relative positioning
const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(1),
  position: 'relative',
}));

// Styled Image
const StyledImage = styled('img')({
  width: 80,
  height: 80,
  objectFit: 'cover',
  borderRadius: 8, // Equivalent to Tailwind's rounded
});

// Styled Code Preview Container
const CodePreviewContainer = styled('div')(({ theme }) => ({
  width: 80,
  height: 80,
  overflow: 'hidden',
  backgroundColor: theme.palette.grey[100],
  borderRadius: 8,
  padding: theme.spacing(0.5),
}));

// Styled Icon Container for generic files
const FileIconContainer = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[100],
  borderRadius: 8,
}));

/**
 * FilePreview Component
 *
 * @param {Object} props
 * @param {Object} props.file - The file object containing `file` (File) and `preview` (string URL).
 * @param {Function} props.onRemove - Function to handle removal of the file preview.
 */
export function FilePreview({ file, onRemove }) {
  const [codeContent, setCodeContent] = useState('');

  useEffect(() => {
    if (file.file.type === 'text/jsx' || file.file.type === 'text/tsx') {
      getFilePreviewContent(file.file).then(setCodeContent);
    }

    // Cleanup function to revoke object URLs when component unmounts
    return () => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  /**
   * Determines if the file is a code file based on its MIME type.
   * @returns {boolean}
   */
  const isCodeFile =
    file.file.type === 'text/jsx' || file.file.type === 'text/tsx';

  return (
    <StyledCard>
      {file.preview ? (
        <StyledImage src={file.preview} alt={file.file.name} />
      ) : isCodeFile ? (
        <CodePreviewContainer>
          <Typography
            variant="body2"
            sx={{
              fontSize: '6px',
              lineHeight: 1,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              color: 'text.primary',
            }}
          >
            {codeContent || 'Loading...'}
          </Typography>
        </CodePreviewContainer>
      ) : (
        <FileIconContainer>
          <InsertDriveFileIcon sx={{ fontSize: 32, color: 'grey.400' }} />
        </FileIconContainer>
      )}
      {/* Remove Button */}
      <IconButton
        onClick={onRemove}
        sx={{
          position: 'absolute',
          top: -12,
          right: -12,
          width: 24,
          height: 24,
          backgroundColor: 'error.main',
          color: 'error.contrastText',
          '&:hover': {
            backgroundColor: 'error.dark',
          },
        }}
        aria-label={`Remove ${file.file.name}`}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      {/* File Name */}
      <Typography
        variant="caption"
        sx={{
          mt: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: 80,
        }}
      >
        {file.file.name}
      </Typography>
    </StyledCard>
  );
}

export default FilePreview;
