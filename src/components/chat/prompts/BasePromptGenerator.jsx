// src/components/BasePromptGenerator.jsx
import { Refresh, Clear, PlayArrow } from '@mui/icons-material'; // You can keep MUI icons if necessary
import { motion } from 'framer-motion'; // Import Framer Motion
import React, { useState } from 'react';

import { generatePrompt } from 'api/Ai/chat-hosted/openai';
import { useUserStore } from 'contexts/UserProvider';

import SystemInstructions from './SystemInstructions';

// ApiKeyInput.jsx
export const ApiKeyInput = ({ onSubmit }) => {
  const [apiKeyInput, setApiKeyInput] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(apiKeyInput);
  };

  return (
    <div
      style={{
        padding: '16px',
        marginBottom: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
      }}
    >
      <h6>Set OpenAI API Key</h6>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '16px' }}>
        <input
          type="text"
          placeholder="API Key"
          value={apiKeyInput}
          onChange={e => setApiKeyInput(e.target.value)}
          required
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '8px 16px',
            backgroundColor: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          Save
        </button>
      </form>
    </div>
  );
};

export const BasePromptGenerator = ({
  promptTemplate,
  generatorTitle,
  onTest,
  label,
}) => {
  const {
    state: { user },
  } = useUserStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [generatedInstructions, setGeneratedInstructions] = useState('');
  const [apiKey, setApiKey] = useState(user.profile.openai.apiKey || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [animateComponents, setAnimateComponents] = useState(false);

  const handleGenerate = async () => {
    if (!apiKey) {
      setError('Please set your OpenAI API key first.');
      return;
    }
    if (!userInput.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setIsExpanded(true);
    setAnimateComponents(true);
    try {
      const prompt = promptTemplate.replace('{userInput}', userInput);
      const instructions = await generatePrompt(prompt, apiKey);
      setGeneratedInstructions(instructions);
    } catch (err) {
      setError('Error generating instructions. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setUserInput('');
    setGeneratedInstructions('');
    setIsExpanded(false);
    setError(null);
    setAnimateComponents(false);
  };

  const handleRegenerate = async () => {
    if (userInput) {
      await handleGenerate();
    }
  };

  const handleSetApiKey = key => {
    setApiKey(key);
    setError(null);
  };

  const handleTest = () => {
    if (onTest) {
      onTest(promptTemplate, userInput, generatedInstructions);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        maxWidth: '800px',
        margin: 'auto',
        marginTop: '32px',
        position: 'relative',
      }}
    >
      <h5>{generatorTitle}</h5>
      {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}

      {/* Animated Container */}
      <motion.div
        initial={{ opacity: 1, y: -20 }}
        animate={animateComponents ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <SystemInstructions
          instructions={generatedInstructions}
          title={generatorTitle}
          label={label}
          isLoading={isLoading}
          handleGenerate={handleGenerate}
          userInput={userInput}
          handleInsertPrompt={e => setUserInput(promptTemplate)}
        />
      </motion.div>

      {generatedInstructions && (
        <div
          style={{
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
          }}
        >
          <button
            onClick={handleClear}
            style={{
              padding: '8px 16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              background: 'none',
            }}
          >
            <Clear /> Clear
          </button>
          <button
            onClick={handleRegenerate}
            style={{
              padding: '8px 16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              background: 'none',
            }}
          >
            <Refresh /> Regenerate
          </button>
          <button
            onClick={handleTest}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            <PlayArrow /> Test
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default BasePromptGenerator;

// // src/components/BasePromptGenerator.jsx
// import { Refresh, Clear, PlayArrow } from '@mui/icons-material';
// import {
//   Box,
//   Paper,
//   TextField,
//   Typography,
//   Button,
//   CircularProgress,
//   useTheme,
//   Grow,
// } from '@mui/material';
// import React, { useState } from 'react';

// import { generatePrompt } from 'api/Ai/chat-hosted/openai';
// import { useUserStore } from 'contexts/UserProvider';

// import SystemInstructions from './SystemInstructions';

// // ApiKeyInput.jsx
// export const ApiKeyInput = ({ onSubmit }) => {
//   const [apiKeyInput, setApiKeyInput] = useState('');

//   const handleSubmit = e => {
//     e.preventDefault();
//     onSubmit(apiKeyInput);
//   };

//   return (
//     <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
//       <Typography variant="h6" gutterBottom>
//         Set OpenAI API Key
//       </Typography>
//       <Box
//         component="form"
//         onSubmit={handleSubmit}
//         sx={{ display: 'flex', gap: 2 }}
//       >
//         <TextField
//           label="API Key"
//           variant="outlined"
//           fullWidth
//           value={apiKeyInput}
//           onChange={e => setApiKeyInput(e.target.value)}
//           required
//         />
//         <Button type="submit" variant="contained" color="primary">
//           Save
//         </Button>
//       </Box>
//     </Paper>
//   );
// };

// export const BasePromptGenerator = ({
//   promptTemplate,
//   generatorTitle,
//   onTest,
// }) => {
//   const {
//     state: { user, isAuthenticated },
//   } = useUserStore();
//   const [isExpanded, setIsExpanded] = React.useState(false);
//   const [userInput, setUserInput] = React.useState('');
//   const [generatedInstructions, setGeneratedInstructions] = React.useState('');
//   const [apiKey, setApiKey] = React.useState(user.profile.openai.apiKey || '');
//   const [isLoading, setIsLoading] = React.useState(false);
//   const [error, setError] = React.useState(null);
//   const [animateComponents, setAnimateComponents] = React.useState(false);
//   const theme = useTheme();

//   const handleGenerate = async () => {
//     if (!apiKey) {
//       setError('Please set your OpenAI API key first.');
//       return;
//     }
//     if (!userInput.trim()) {
//       setError('Please enter a prompt.');
//       return;
//     }
//     setIsLoading(true);
//     setError(null);
//     setIsExpanded(true);
//     setAnimateComponents(true);
//     try {
//       const prompt = promptTemplate.replace('{userInput}', userInput);
//       const instructions = await generatePrompt(prompt, apiKey);
//       setGeneratedInstructions(instructions);
//     } catch (err) {
//       setError('Error generating instructions. Please try again.');
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInsertPrompt = e => {
//     console.log(
//       '🚀 ~ file: BasePromptGenerator.jsx:100 ~ handleInsertPrompt ~ prompt:',
//       prompt
//     );
//     setUserInput(prompt);
//   };

//   const handleClear = () => {
//     setUserInput('');
//     setGeneratedInstructions('');
//     setIsExpanded(false);
//     setError(null);
//     setAnimateComponents(false);
//   };

//   const handleRegenerate = async () => {
//     if (userInput) {
//       await handleGenerate();
//     }
//   };

//   const handleSetApiKey = key => {
//     setApiKey(key);
//     setError(null);
//   };

//   const handleTest = () => {
//     if (onTest) {
//       onTest(promptTemplate, userInput, generatedInstructions);
//     }
//   };

//   return (
//     <Box
//       component={Grow}
//       in
//       timeout={500}
//       sx={{
//         maxWidth: '800px',
//         margin: 'auto',
//         mt: theme.spacing(4),
//         position: 'relative',
//       }}
//     >
//       <Typography variant="h5" gutterBottom>
//         {generatorTitle}
//       </Typography>
//       {error && (
//         <Typography color="error" sx={{ mb: theme.spacing(2) }}>
//           {error}
//         </Typography>
//       )}
//       {/* Animated Container */}
//       <Grow in={animateComponents} timeout={500}>
//         <Box
//           sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             gap: theme.spacing(2),
//           }}
//         >
//           {/* EXPAND INSTRUCTIONS GENERATOR INPUT BUTTON */}
//           <SystemInstructions
//             instructions={generatedInstructions}
//             label={generatorTitle}
//             isLoading={isLoading}
//             handleGenerate={handleGenerate}
//             userInput={userInput}
//             handleInsertPrompt={handleInsertPrompt}
//           />
//         </Box>
//       </Grow>
//       {generatedInstructions && (
//         <Box
//           sx={{
//             mb: theme.spacing(2),
//             display: 'flex',
//             justifyContent: 'flex-end',
//             gap: theme.spacing(1),
//           }}
//         >
//           <Button
//             variant="outlined"
//             size="small"
//             startIcon={<Clear />}
//             onClick={handleClear}
//           >
//             Clear
//           </Button>
//           <Button
//             variant="outlined"
//             size="small"
//             startIcon={<Refresh />}
//             onClick={handleRegenerate}
//           >
//             Regenerate
//           </Button>
//           <Button
//             variant="contained"
//             size="small"
//             startIcon={<PlayArrow />}
//             onClick={handleTest}
//           >
//             Test
//           </Button>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default BasePromptGenerator;
