import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  styled,
} from '@mui/material';
import React from 'react';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledDialogContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  width: '400px',
  borderRadius: theme.shape.borderRadius,
}));

export function CreateItemDialog({
  open,
  onClose,
  isDirectory,
  fileName,
  onFileNameChange,
  error,
  fileType,
  onFileTypeChange,
  fileContent,
  onFileContentChange,
  onCreateItem,
}) {
  return (
    <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New {isDirectory ? 'Folder' : 'File'}</DialogTitle>
      <StyledDialogContent>
        <TextField
          fullWidth
          label={isDirectory ? 'Folder Name' : 'File Name'}
          value={fileName}
          onChange={onFileNameChange}
          error={!!error}
          helperText={error}
          sx={{ mb: 2, mt: 1 }}
        />
        {!isDirectory && (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>File Type</InputLabel>
              <Select
                value={fileType}
                onChange={onFileTypeChange}
                label="File Type"
              >
                <MenuItem value=".txt">.txt</MenuItem>
                <MenuItem value=".js">.js</MenuItem>
                <MenuItem value=".jsx">.jsx</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="File Content"
              multiline
              rows={4}
              value={fileContent}
              onChange={onFileContentChange}
              sx={{ mb: 2 }}
            />
          </>
        )}
      </StyledDialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={onCreateItem}
          disabled={!fileName.trim() || !!error}
        >
          Create {isDirectory ? 'Folder' : 'File'}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}

export default CreateItemDialog;
