import { Editor } from '@monaco-editor/react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/system';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid'; // Make sure to install uuid
import apiUtils from '@/lib/apiUtils';
import { attachmentsApi } from 'api/Ai/chat-sessions';
import { CODE_SNIPPETS, CODE_SNIPPETS_FILES } from 'config/data-configs/editor';
import { FileListing } from './FileListing';
import { LanguageSelector } from './LanguageSelector';
import { Output } from './Output';

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
const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Output</title>
</head>
<body>
    <div id="output"></div>
    <script>
        // Your code will be inserted here
    </script>
</body>
</html>
`;
const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [fileLanguage, setFileLanguage] = useState('javascript');

  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem('codeSnippets')) || [];
    const combinedFiles = [
      ...storedFiles,
      ...CODE_SNIPPETS_FILES.map(file => ({
        ...file,
        name: file.filename, // Rename 'filename' to 'name' for consistency
        isSnippet: true,
      })),
    ];
    setFiles(combinedFiles);
  }, []);

  const editorOptions = {
    fontSize: 14,
    padding: { top: 8 },
    scrollbar: {
      verticalScrollbarSize: 10,
      alwaysConsumeMouseWheel: false,
    },
    minimap: {
      enabled: false,
    },
    formatOnPaste: true,
    formatOnType: true,
    fontFamily: '"Source Code Pro", monospace',
    glyphMargin: true,

    autoClosingBrackets: 'languageDefined',
    autoClosingDelete: 'always',
    autoClosingOvertype: 'always',

    cursorStyle: 'line',
    automaticLayout: true,
    wordWrap: 'on',
    wrappingIndent: 'deepIndent',

    lineNumbers: 'on',
    folding: true,
    autoIndent: 'full',
    suggestOnTriggerCharacters: true,
  };

  const onMount = editor => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = language => {
    setLanguage(language);
    const snippetFile = files.find(file => file.name === `example.${language}`);
    if (snippetFile) {
      setSelectedFile(snippetFile);
      setValue(snippetFile.content);
    } else {
      setSelectedFile(null);
      setValue(CODE_SNIPPETS[language] || '');
    }
  };

  const handleCreateFile = async () => {
    if (!fileName.trim()) {
      toast.error('File name cannot be empty');
      return;
    }

    if (files.some(file => file.name === fileName)) {
      toast.error('File name already exists');
      return;
    }

    const fileId = uuidv4(); // Generate a unique file ID
    const fileBlob = new Blob([fileContent], { type: 'text/plain' });
    const file = new File([fileBlob], fileName, { type: 'text/plain' });
    const fileExtension = fileName.split('.').pop().toLowerCase();

    try {
      const payload = {
        name: fileName,
        userId: sessionStorage.getItem('userId'),
        fileId: 'local',
        workspaceId: sessionStorage.getItem('workspaceId'),
        folderId: null,
        space: 'files',
        contentType: file.type,
        size: file.size,
        relativePath: null,
        type: fileExtension,
      };

      const uploadedFile = await attachmentsApi.uploadFile(file, payload);

      if (uploadedFile) {
        const newFile = {
          name: fileName,
          content: fileContent,
          language: fileLanguage,
          id: fileId,
          path: uploadedFile.path, // Assuming the API returns a path
        };

        const updatedFiles = [...files, newFile];
        setFiles(updatedFiles);
        localStorage.setItem(
          'codeSnippets',
          JSON.stringify(updatedFiles.filter(f => !f.isSnippet))
        );
        setModalOpen(false);
        setFileName('');
        setFileContent('');
        setFileLanguage('javascript');
        toast.success('File created and uploaded successfully');
      } else {
        throw new Error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error creating file:', error);
      toast.error('Failed to create file');
    }
  };

  const handleDeleteFile = file => {
    if (file.isSnippet) {
      toast.error('Cannot delete example snippets');
      return;
    }
    const updatedFiles = files.filter(f => f.name !== file.name);
    setFiles(updatedFiles);
    localStorage.setItem(
      'codeSnippets',
      JSON.stringify(updatedFiles.filter(f => !f.isSnippet))
    );
    if (selectedFile && selectedFile.name === file.name) {
      setSelectedFile(null);
      setValue('');
      setLanguage('');
    }
    toast.success('File deleted successfully');
  };

  const handleImportFromCodeSnippets = () => {
    const importedFiles = [
      {
        name: 'imported1.js',
        content: "console.log('Imported file 1');",
        language: 'javascript',
      },
      {
        name: 'imported2.py',
        content: "print('Imported file 2')",
        language: 'python',
      },
    ];
    const updatedFiles = [...files, ...importedFiles];
    setFiles(updatedFiles);
    localStorage.setItem(
      'codeSnippets',
      JSON.stringify(updatedFiles.filter(f => !f.isSnippet))
    );
    toast.success('Files imported successfully');
  };

  const handleFileSelect = file => {
    setSelectedFile(file);
    setValue(file.content);
    setLanguage(file.language);
  };

  const handleLanguageChange = newLanguage => {
    setLanguage(newLanguage);
    if (selectedFile) {
      const updatedFiles = files.map(f =>
        f.name === selectedFile.name ? { ...f, language: newLanguage } : f
      );
      setFiles(updatedFiles);
      if (!selectedFile.isSnippet) {
        localStorage.setItem(
          'codeSnippets',
          JSON.stringify(updatedFiles.filter(f => !f.isSnippet))
        );
      }
    }
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <FileListing
            files={files}
            onFileSelect={handleFileSelect}
            onFileDelete={handleDeleteFile}
            onNewFile={() => setModalOpen(true)}
            onImport={handleImportFromCodeSnippets}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <LanguageSelector
            language={language}
            onSelect={handleLanguageChange}
          />
          <Editor
            options={editorOptions}
            height="75vh"
            theme="vs-dark"
            language={language}
            value={value}
            onChange={newValue => {
              setValue(newValue);
              if (selectedFile) {
                const updatedFiles = files.map(f =>
                  f.name === selectedFile.name ? { ...f, content: newValue } : f
                );
                setFiles(updatedFiles);
                if (!selectedFile.isSnippet) {
                  localStorage.setItem(
                    'codeSnippets',
                    JSON.stringify(updatedFiles.filter(f => !f.isSnippet))
                  );
                }
              }
            }}
            onMount={onMount}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Output
            editorRef={editorRef}
            language={language}
            selectedFile={selectedFile}
          />
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
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="language-select-label">Language</InputLabel>
            <Select
              labelId="language-select-label"
              value={fileLanguage}
              onChange={e => setFileLanguage(e.target.value)}
              label="Language"
            >
              <MenuItem value="javascript">JavaScript</MenuItem>
              <MenuItem value="python">Python</MenuItem>
              <MenuItem value="java">Java</MenuItem>
              {/* Add more language options as needed */}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleCreateFile}>
            Create File
          </Button>
        </ModalContent>
      </StyledModal>
    </Box>
  );
};

export default CodeEditor;
