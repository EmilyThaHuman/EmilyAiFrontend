import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Grid,
  Paper,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/system';
import React, { useState, useEffect } from 'react';
import {
  FaFile,
  FaFolder,
  FaSearch,
  FaPlus,
  FaTrash,
  FaCopy,
  FaEdit,
} from 'react-icons/fa';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  overflow: 'auto',
}));

const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  width: '400px',
  borderRadius: theme.shape.borderRadius,
}));

const FileDirectory = () => {
  const [files, setFiles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem('files')) || [];
    setFiles(storedFiles);
  }, []);

  const handleCreateFile = () => {
    if (!fileName.trim()) {
      setError('File name cannot be empty');
      return;
    }

    if (files.some(file => file.name === fileName)) {
      setError('File name already exists');
      return;
    }

    const newFile = { name: fileName, content: fileContent };
    const updatedFiles = [...files, newFile];
    setFiles(updatedFiles);
    localStorage.setItem('files', JSON.stringify(updatedFiles));
    setModalOpen(false);
    setFileName('');
    setFileContent('');
    setError('');
  };

  const handleDeleteFile = file => {
    const updatedFiles = files.filter(f => f.name !== file.name);
    setFiles(updatedFiles);
    localStorage.setItem('files', JSON.stringify(updatedFiles));
    setSelectedFile(null);
  };

  const handleImportFromCodeSnippets = () => {
    // Simulating import from external storage
    const importedFiles = [
      { name: 'imported1.js', content: "console.log('Imported file 1');" },
      { name: 'imported2.py', content: "print('Imported file 2')" },
    ];
    const updatedFiles = [...files, ...importedFiles];
    setFiles(updatedFiles);
    localStorage.setItem('files', JSON.stringify(updatedFiles));
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom>
        File Directory
      </Typography>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<FaPlus />}
                onClick={() => setModalOpen(true)}
              >
                New File
              </Button>
              <Button
                variant="outlined"
                startIcon={<FaFolder />}
                onClick={handleImportFromCodeSnippets}
              >
                Import
              </Button>
            </Box>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search files"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <List>
              {filteredFiles.map(file => (
                <ListItem
                  key={file.name}
                  button
                  selected={selectedFile && selectedFile.name === file.name}
                  onClick={() => setSelectedFile(file)}
                >
                  <ListItemIcon>
                    <FaFile />
                  </ListItemIcon>
                  <ListItemText primary={file.name} />
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteFile(file)}
                  >
                    <FaTrash />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={8}>
          <StyledPaper>
            {selectedFile ? (
              <>
                <Typography variant="h6" gutterBottom>
                  {selectedFile.name}
                </Typography>
                <SyntaxHighlighter language="javascript" style={docco}>
                  {selectedFile.content}
                </SyntaxHighlighter>
              </>
            ) : (
              <Typography variant="body1">
                Select a file to view its content
              </Typography>
            )}
          </StyledPaper>
        </Grid>
      </Grid>

      <StyledModal open={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalContent>
          <Typography variant="h6" gutterBottom>
            Create New File
          </Typography>
          <TextField
            fullWidth
            label="File Name"
            value={fileName}
            onChange={e => setFileName(e.target.value)}
            error={!!error}
            helperText={error}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="File Content"
            multiline
            rows={4}
            value={fileContent}
            onChange={e => setFileContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleCreateFile}>
            Create File
          </Button>
        </ModalContent>
      </StyledModal>
    </Box>
  );
};

export default FileDirectory;
