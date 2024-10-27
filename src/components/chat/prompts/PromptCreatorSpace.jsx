// src/App.jsx
import { Container, Tabs, Tab, Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';

import {
  APIAssistantInstructionsGenerator,
  EnhancedQueryOptimizerGenerator,
  FunctionsToolsGenerator,
} from '@/lib/chat-utils';

import { TestChatUI } from './TestChatUi';

export const PromptCreatorSpace = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [isTestMode, setIsTestMode] = useState(false);
  const [testConfig, setTestConfig] = useState({
    promptTemplate: '',
    initialPrompt: '',
  });

  const handleChange = (event, newValue) => {
    console.log('Changing tab to', newValue);
    setCurrentTab(newValue);
  };

  const handleTest = (promptTemplate, initialPrompt, generatedInstructions) => {
    setTestConfig({
      promptTemplate,
      initialPrompt: generatedInstructions,
    });
    setIsTestMode(true);
  };

  const handleCloseTest = () => {
    setIsTestMode(false);
    setTestConfig({
      promptTemplate: '',
      initialPrompt: '',
    });
  };

  return (
    <Container>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
        <Tabs
          value={currentTab}
          onChange={handleChange}
          aria-label="Generator Tabs"
        >
          <Tab label="API Instructions Generator" />
          <Tab label="Functions/Tools Generator" />
          <Tab label="Enhanced Query Optimizer" />
        </Tabs>
      </Box>
      <Box sx={{ mt: 4 }}>
        <AnimatePresence mode="wait">
          {!isTestMode ? (
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              styles={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              {currentTab === 0 && (
                <APIAssistantInstructionsGenerator onTest={handleTest} />
              )}
              {currentTab === 1 && (
                <FunctionsToolsGenerator onTest={handleTest} />
              )}
              {currentTab === 2 && (
                <EnhancedQueryOptimizerGenerator onTest={handleTest} />
              )}
            </motion.div>
          ) : (
            <TestChatUI
              key="test-chat-ui"
              promptTemplate={testConfig.promptTemplate}
              initialPrompt={testConfig.initialPrompt}
              onClose={handleCloseTest}
            />
          )}
        </AnimatePresence>
      </Box>
    </Container>
  );
};

export default PromptCreatorSpace;
