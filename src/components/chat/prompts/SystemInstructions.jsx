// SystemInstructions.jsx
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Typography,
  Collapse,
  IconButton,
  Paper,
  useTheme,
  TextField,
} from '@mui/material';
import { BookOpen } from 'lucide-react';
import React, { useState } from 'react';

import { GenerateButton } from './GenerateButton';

export const SystemInstructions = ({
  instructions = '',
  title = '',
  label = 'System Instructions',
  isLoading = false,
  handleGenerate = () => {},
  userInput = '',
  handleInsertPrompt = () => {},
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [ariaLabel, setAriaLabel] = useState(`Expand ${label}`);
  const [isFullyExpanded, setIsFullyExpanded] = useState(false);
  const theme = useTheme();

  const handleExpand = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setTimeout(() => setIsFullyExpanded(true), 500); // Delay vertical expansion
    } else {
      setIsFullyExpanded(false);
      setTimeout(() => setIsExpanded(false), 500); // Delay horizontal collapse
    }
  };

  const handleInput = e => {
    e.preventDefault();
    handleInsertPrompt(e.target.value);
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: theme.spacing(2),
        right: theme.spacing(2),
        width: isExpanded ? '100%' : 'auto',
        height: isExpanded ? '100%' : 'auto',
        transition: 'width 0.5s ease-in-out, height 0.5s ease-in-out',
      }}
    >
      <Paper elevation={3} sx={{ overflow: 'auto' }}>
        {!isExpanded ? (
          <IconButton
            onClick={handleExpand}
            aria-label={ariaLabel}
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'text.primary' },
            }}
          >
            <BookOpen fontSize="medium" />
          </IconButton>
        ) : (
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
              }}
            >
              <div>
                <Typography variant="h6">System Instructions</Typography>
                <Paper
                  elevation={3}
                  sx={{
                    p: theme.spacing(2),
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter your prompt..."
                    value={userInput}
                    onChange={e => handleInput(e)}
                    sx={{ mr: theme.spacing(2) }}
                  />
                  <GenerateButton
                    onClick={handleGenerate}
                    isLoading={isLoading}
                    text={isLoading ? 'Generating...' : 'Generate'}
                  />
                </Paper>
              </div>
              <IconButton
                onClick={handleExpand}
                aria-label={isFullyExpanded ? 'Collapse' : 'Expand'}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary' },
                }}
              >
                {isFullyExpanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
            <Collapse in={isFullyExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="body2"
                  component="div"
                  dangerouslySetInnerHTML={{ __html: instructions }}
                />
              </Box>
            </Collapse>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default SystemInstructions;
