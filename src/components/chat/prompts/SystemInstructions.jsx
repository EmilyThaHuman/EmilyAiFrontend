// SystemInstructions.jsx
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Typography,
  Collapse,
  IconButton,
  Paper,
  useTheme,
} from '@mui/material';
import { BookOpen } from 'lucide-react';
import React, { useState } from 'react';

export const SystemInstructions = ({ instructions }) => {
  const [isExpanded, setIsExpanded] = useState(false);
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

  return (
    <Box
      sx={{
        position: 'absolute',
        top: theme.spacing(2),
        right: theme.spacing(2),
        width: isExpanded ? '100%' : 'auto',
        transition: 'width 0.5s ease-in-out, height 0.5s ease-in-out',
      }}
    >
      <Paper elevation={3} sx={{ overflow: 'hidden' }}>
        {!isExpanded ? (
          <IconButton
            onClick={handleExpand}
            aria-label="Expand system instructions"
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
              <Typography variant="h6">System Instructions</Typography>
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
