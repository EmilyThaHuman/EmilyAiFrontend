import HomeIcon from '@mui/icons-material/Home';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  Tabs,
  Tab,
  Slider,
  Switch,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import React, { useState } from 'react';

export const WorkspaceSettings = () => {
  const [activeTab, setActiveTab] = useState('main');
  const [temperature, setTemperature] = useState(0.5);
  const [contextLength, setContextLength] = useState(4096);
  const [includeProfile, setIncludeProfile] = useState(true);
  const [includeInstructions, setIncludeInstructions] = useState(true);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box bgcolor="black" color="white" py={6} minHeight="100vh">
      <Container maxWidth="md">
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h4" fontWeight="bold">
            Workspace Settings
          </Typography>
          <IconButton color="inherit">
            <HomeIcon />
          </IconButton>
        </Box>

        <Typography color="gray" mb={6}>
          This is your home workspace for personal use.
        </Typography>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
        >
          <Tab label="Main" value="main" />
          <Tab label="Defaults" value="defaults" />
        </Tabs>

        {activeTab === 'main' ? (
          <>
            {/* Workspace Name */}
            <Box mt={4}>
              <InputLabel shrink>Workspace Name</InputLabel>
              <TextField
                fullWidth
                variant="outlined"
                defaultValue="Components"
                InputProps={{
                  style: { backgroundColor: '#333', color: 'white' },
                }}
              />
            </Box>

            {/* Workspace Image */}
            <Box mt={4}>
              <InputLabel shrink>Workspace Image</InputLabel>
              <Button
                fullWidth
                variant="outlined"
                style={{
                  backgroundColor: '#333',
                  color: 'white',
                  justifyContent: 'space-between',
                }}
              >
                <span>Choose File</span>
                <span style={{ color: 'gray' }}>No file chosen</span>
              </Button>
            </Box>

            {/* AI Instructions */}
            <Box mt={4}>
              <InputLabel shrink>
                How would you like the AI to respond in this workspace?
              </InputLabel>
              <TextField
                fullWidth
                multiline
                minRows={4}
                variant="outlined"
                placeholder="Instructions... (optional)"
                InputProps={{
                  style: { backgroundColor: '#333', color: 'white' },
                }}
              />
              <Typography color="gray" variant="caption">
                0/1500
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <Typography color="gray" mb={6}>
              These are the settings your workspace begins with when selected.
            </Typography>

            {/* Model Selection */}
            <Box mt={4}>
              <InputLabel shrink>Model</InputLabel>
              <FormControl fullWidth variant="outlined">
                <Select
                  defaultValue="gpt4"
                  style={{ backgroundColor: '#333', color: 'white' }}
                >
                  <MenuItem value="gpt4">GPT-4 Turbo</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Prompt */}
            <Box mt={4}>
              <InputLabel shrink>Prompt</InputLabel>
              <TextField
                fullWidth
                multiline
                minRows={3}
                variant="outlined"
                defaultValue="You are a friendly, helpful AI assistant."
                InputProps={{
                  style: { backgroundColor: '#333', color: 'white' },
                }}
              />
            </Box>

            {/* Advanced Settings */}
            <Box mt={4}>
              <Typography variant="h6" mb={2}>
                Advanced Settings
              </Typography>

              {/* Temperature Slider */}
              <Box mt={4}>
                <Typography gutterBottom>Temperature: {temperature}</Typography>
                <Slider
                  value={temperature}
                  onChange={(e, value) => setTemperature(value)}
                  max={1}
                  step={0.1}
                  style={{ color: 'white' }}
                />
              </Box>

              {/* Context Length Slider */}
              <Box mt={4}>
                <Typography gutterBottom>
                  Context Length: {contextLength}
                </Typography>
                <Slider
                  value={contextLength}
                  onChange={(e, value) => setContextLength(value)}
                  max={8192}
                  step={1024}
                  style={{ color: 'white' }}
                />
              </Box>

              {/* Toggles */}
              <Box mt={4}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography>Chats Include Profile Context</Typography>
                  <Switch
                    checked={includeProfile}
                    onChange={e => setIncludeProfile(e.target.checked)}
                    color="primary"
                  />
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={2}
                >
                  <Typography>Chats Include Workspace Instructions</Typography>
                  <Switch
                    checked={includeInstructions}
                    onChange={e => setIncludeInstructions(e.target.checked)}
                    color="primary"
                  />
                </Box>
              </Box>

              {/* Embeddings Provider */}
              <Box mt={4}>
                <InputLabel shrink>Embeddings Provider</InputLabel>
                <FormControl fullWidth variant="outlined">
                  <Select
                    defaultValue="openai"
                    style={{ backgroundColor: '#333', color: 'white' }}
                  >
                    <MenuItem value="openai">OpenAI</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </>
        )}

        {/* Footer Buttons */}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={6}>
          <Button
            variant="outlined"
            style={{ color: 'white', borderColor: 'gray' }}
          >
            Cancel
          </Button>
          <Button variant="contained" color="primary">
            Save
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default WorkspaceSettings;
