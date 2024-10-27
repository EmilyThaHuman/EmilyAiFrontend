import AttachFileIcon from '@mui/icons-material/AttachFile';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import SendIcon from '@mui/icons-material/Send';
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Chip,
} from '@mui/material';
import React, { useState, useRef } from 'react';

// Import your custom FilePreview component or create a MUI equivalent
import FilePreview from './FilePreview'; // Ensure this component is compatible with MUI

/**
 * ChatInput Component
 *
 * @param {Object} props
 * @param {Function} props.onSubmit - Function to handle form submission
 */
export function ChatInput({ onSubmit }) {
  const [input, setInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  /**
   * Handles form submission
   *
   * @param {React.FormEvent} e - Form event
   */
  const handleSubmit = e => {
    e.preventDefault();
    if (!input.trim() && selectedFiles.length === 0) return;
    onSubmit(input, selectedFiles);
    setInput('');
    setSelectedFiles([]);
  };

  /**
   * Handles file selection
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Change event
   */
  const handleFileSelect = e => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
    }));
    setSelectedFiles(prev => [...prev, ...newPreviews]);
    // Reset the input value to allow re-uploading the same file if needed
    e.target.value = null;
  };

  /**
   * Removes a selected file
   *
   * @param {number} index - Index of the file to remove
   */
  const removeFile = index => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      if (prev[index].preview) {
        URL.revokeObjectURL(prev[index].preview);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  return (
    <Box
      sx={{
        p: 2,
        borderTop: '1px solid',
        borderColor: 'grey.800',
        backgroundColor: 'background.paper',
      }}
    >
      {selectedFiles.length > 0 && (
        <Box
          sx={{
            mb: 2,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          {selectedFiles.map((file, index) => (
            <Chip
              key={index}
              label={file.file.name}
              onDelete={() => removeFile(index)}
              deleteIcon={<InsertDriveFileIcon />}
              icon={file.preview ? <ImageIcon /> : <InsertDriveFileIcon />}
              variant="outlined"
              sx={{
                maxWidth: '80%',
              }}
            />
          ))}
        </Box>
      )}
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: '48rem', margin: '0 auto', position: 'relative' }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* File Upload Button */}
          <IconButton
            color="primary"
            aria-label="upload files"
            onClick={() => fileInputRef.current.click()}
            sx={{
              border: '1px solid',
              borderColor: 'grey.700',
              '&:hover': {
                backgroundColor: 'grey.800',
              },
            }}
          >
            <AttachFileIcon />
          </IconButton>
          {/* Hidden File Input */}
          <input
            type="file"
            multiple
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.txt,.jsx,.tsx"
          />
          {/* Text Input */}
          <TextField
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            multiline
            minRows={2}
            maxRows={4}
            variant="outlined"
            fullWidth
            sx={{
              backgroundColor: 'grey.900',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'grey.700',
                },
                '&:hover fieldset': {
                  borderColor: 'grey.600',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
              input: {
                color: 'white',
              },
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          {/* Submit Button */}
          <IconButton
            type="submit"
            color="primary"
            disabled={!input.trim() && selectedFiles.length === 0}
            sx={{
              backgroundColor: 'grey.800',
              '&:hover': {
                backgroundColor: 'grey.700',
              },
              '&.Mui-disabled': {
                backgroundColor: 'grey.800',
                color: 'grey.500',
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </form>
    </Box>
  );
}

export default ChatInput;
