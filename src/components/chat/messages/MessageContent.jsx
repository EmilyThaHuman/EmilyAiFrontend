/* eslint-disable react/no-children-prop */
import {
  Typography,
  IconButton,
  Box,
  useTheme,
  TextField,
  Button,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaCopy, FaSave } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

import { DashboardIcon } from 'assets/humanIcons';
import { RCDialog } from 'components/themed';

import CodePreview from './CodePreview'; // Ensure this component is compatible with MUI
import FilePreview from './FilePreview'; // Ensure this component is compatible with MUI

export function SaveSnippetDialog({
  openDialog,
  handleCloseDialog,
  snippetName,
  setSnippetName,
  saveSnippet,
}) {
  return (
    <RCDialog
      open={openDialog}
      onClose={handleCloseDialog}
      title="Save Code Snippet"
      subtitle="Enter the name for your code snippet below."
      actions={
        <>
          <Button onClick={handleCloseDialog} sx={{ color: '#fff' }}>
            Cancel
          </Button>
          <Button
            onClick={saveSnippet}
            variant="contained"
            sx={{ backgroundColor: '#555', color: '#fff' }}
          >
            Save
          </Button>
        </>
      }
    >
      <TextField
        margin="dense"
        id="name"
        label="Snippet Name"
        type="text"
        fullWidth
        variant="outlined"
        value={snippetName}
        onChange={e => setSnippetName(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#555',
            },
            '&:hover fieldset': {
              borderColor: '#777',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#999',
            },
            '& input': {
              color: '#fff',
            },
            '& input::placeholder': {
              color: '#888',
              opacity: 1,
            },
          },
        }}
      />
    </RCDialog>
  );
}

/**
 * MessageContent Component
 *
 * @param {Object} props
 * @param {Object} props.message - The message object containing content, role, and files.
 * @param {boolean} [props.isStreaming] - Indicates if the message is currently streaming.
 */
export function MessageContent({ message, isStreaming }) {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);
  const [snippets, setSnippets] = useState([]);
  const [snippetName, setSnippetName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('');

  useEffect(() => {
    const storedSnippets = localStorage.getItem('codeSnippets');
    if (storedSnippets) {
      setSnippets(JSON.parse(storedSnippets));
    }
  }, []);

  const handlePreviewCode = (code, language) => {
    console.log('Previewing code:', code, 'Language:', language);
    setCurrentCode(code);
    setCurrentLanguage(language === 'jsx' ? 'javascript' : language);
    setOpenDialog(true);
  };

  const handleOpenDialog = (code, language) => {
    setCurrentCode(code);
    setCurrentLanguage(language === 'jsx' ? 'javascript' : language);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSnippetName('');
  };

  const saveSnippet = () => {
    if (snippetName.trim() === '') {
      alert('Please enter a name for the snippet');
      return;
    }
    const newSnippet = {
      filename: snippetName,
      name: snippetName,
      content: currentCode,
      language: currentLanguage,
    };
    const updatedSnippets = [...snippets, newSnippet];
    setSnippets(updatedSnippets);
    localStorage.setItem('codeSnippets', JSON.stringify(updatedSnippets));
    setSnippetName('');
    alert('Snippet saved successfully!');
    handleCloseDialog();
  };

  const components = {
    p({ children }) {
      return <p className="mb-2 last:mb-0">{children}</p>;
    },
    img({ ...props }) {
      return <img className="max-w-[67%]" {...props} alt={props.alt} />;
    },
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';

      const handleCopy = () => {
        navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      };

      if (!inline) {
        return (
          <Box
            sx={{
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
              lineHeight: 1.5,
              wordBreak: 'break-word',
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#333',
                padding: 1,
                color: '#fff',
                borderRadius: '4px 4px 0 0',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 'bold', ml: 2 }}>
                {language || 'code'}
              </Typography>
              <Box>
                <IconButton
                  size="small"
                  onClick={() =>
                    handlePreviewCode(
                      String(children).replace(/\n$/, ''),
                      language
                    )
                  }
                >
                  <DashboardIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() =>
                    handleOpenDialog(
                      String(children).replace(/\n$/, ''),
                      language
                    )
                  }
                >
                  <FaSave />
                </IconButton>
                {copied ? (
                  <Typography variant="caption" color="success.main">
                    Copied!
                  </Typography>
                ) : (
                  <IconButton size="small" onClick={handleCopy}>
                    <FaCopy />
                  </IconButton>
                )}
              </Box>
            </Box>
            <Box sx={{ overflowY: 'auto' }}>
              <SyntaxHighlighter
                style={oneDark}
                language={language || 'text'}
                PreTag="div"
                customStyle={{ margin: '0' }}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </Box>
          </Box>
        );
      } else {
        return (
          <Box
            component="code"
            sx={{
              backgroundColor: theme.palette.grey[800],
              padding: '0.25rem 0.5rem',
              borderRadius: theme.shape.borderRadius,
              fontFamily: 'Monospace',
              fontSize: '0.875rem',
            }}
            {...props}
          >
            {children}
          </Box>
        );
      }
    },
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{
            maxWidth: '80%',
            borderRadius: theme.shape.borderRadius * 2,
            padding: theme.spacing(1, 2),
            backgroundColor:
              message.role === 'user'
                ? theme.palette.grey[800]
                : theme.palette.grey[900],
            color: theme.palette.common.white,
            border:
              message.role !== 'user'
                ? `1px solid ${theme.palette.grey[700]}`
                : 'none',
            margin: theme.spacing(1, 0),
          }}
        >
          <ReactMarkdown
            className="markdown-body prose max-w-none dark:prose-invert"
            children={message.content}
            remarkPlugins={[remarkGfm]}
            components={components}
          />
          {isStreaming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1 }}
              style={{
                display: 'inline-block',
                marginLeft: theme.spacing(0.5),
              }}
            >
              ▊
            </motion.div>
          )}

          {message?.files && message?.files.length > 0 && (
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              {message.files.map((file, index) => (
                <FilePreview
                  key={index}
                  file={file}
                  onRemove={() => {}} // Read-only in chat
                />
              ))}
            </Box>
          )}
        </motion.div>
      </AnimatePresence>

      <SaveSnippetDialog
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        snippetName={snippetName}
        setSnippetName={setSnippetName}
        saveSnippet={saveSnippet}
      />
    </>
  );
}

export default MessageContent;

// /* eslint-disable react/no-children-prop */
// import {
//   Typography,
//   Chip,
//   useTheme,
//   Box,
//   IconButton,
//   TextField,
//   Button,
// } from '@mui/material';
// import { motion, AnimatePresence } from 'framer-motion';
// import React, { useEffect, useState } from 'react';
// import { FaCopy, FaSave } from 'react-icons/fa';
// import ReactMarkdown from 'react-markdown';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import remarkGfm from 'remark-gfm';
// import gfm from 'remark-gfm';

// import { DashboardIcon } from 'assets/humanIcons';
// import { RCDialog } from 'components/themed';

// import CodePreview from './CodePreview'; // Ensure this component is compatible with MUI
// import FilePreview from './FilePreview'; // Ensure this component is compatible with MUI
// export function SaveSnippetDialog({
//   openDialog,
//   handleCloseDialog,
//   snippetName,
//   setSnippetName,
//   saveSnippet,
// }) {
//   return (
//     <RCDialog
//       open={openDialog}
//       onClose={handleCloseDialog}
//       title="Save Code Snippet"
//       subtitle="Enter the name for your code snippet below."
//       actions={
//         <>
//           <Button onClick={handleCloseDialog} sx={{ color: '#fff' }}>
//             Cancel
//           </Button>
//           <Button
//             onClick={saveSnippet}
//             variant="contained"
//             sx={{ backgroundColor: '#555', color: '#fff' }}
//           >
//             Save
//           </Button>
//         </>
//       }
//     >
//       <TextField
//         margin="dense"
//         id="name"
//         label="Snippet Name"
//         type="text"
//         fullWidth
//         variant="outlined"
//         value={snippetName}
//         onChange={e => setSnippetName(e.target.value)}
//         sx={{
//           '& .MuiOutlinedInput-root': {
//             '& fieldset': {
//               borderColor: '#555',
//             },
//             '&:hover fieldset': {
//               borderColor: '#777',
//             },
//             '&.Mui-focused fieldset': {
//               borderColor: '#999',
//             },
//             '& input': {
//               color: '#fff',
//             },
//             '& input::placeholder': {
//               color: '#888',
//               opacity: 1,
//             },
//           },
//         }}
//       />
//     </RCDialog>
//   );
// }
// /**
//  * MessageContent Component
//  *
//  * @param {Object} props
//  * @param {Object} props.message - The message object containing content, role, and files.
//  * @param {boolean} [props.isStreaming] - Indicates if the message is currently streaming.
//  */
// export function MessageContent({ message, isStreaming }) {
//   const theme = useTheme();
//   const [copied, setCopied] = useState(false);
//   const [snippets, setSnippets] = useState([]);
//   const [snippetName, setSnippetName] = useState('');
//   const [openDialog, setOpenDialog] = useState(false);
//   const [currentCode, setCurrentCode] = useState('');
//   const [currentLanguage, setCurrentLanguage] = useState('');

//   useEffect(() => {
//     const storedSnippets = localStorage.getItem('codeSnippets');
//     if (storedSnippets) {
//       setSnippets(JSON.parse(storedSnippets));
//     }
//   }, []);

//   const handlePreviewCode = (code, language) => {
//     console.log('Previewing code:', code, 'Language:', language);
//     setCurrentCode(code);
//     setCurrentLanguage(language === 'jsx' ? 'javascript' : language);
//     setOpenDialog(true);
//   };
//   const handleOpenDialog = (code, language) => {
//     setCurrentCode(code);
//     setCurrentLanguage(language === 'jsx' ? 'javascript' : language);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSnippetName('');
//   };

//   const saveSnippet = () => {
//     if (snippetName.trim() === '') {
//       alert('Please enter a name for the snippet');
//       return;
//     }
//     const newSnippet = {
//       filename: snippetName,
//       name: snippetName,
//       content: currentCode,
//       language: currentLanguage,
//     };
//     const updatedSnippets = [...snippets, newSnippet];
//     setSnippets(updatedSnippets);
//     localStorage.setItem('codeSnippets', JSON.stringify(updatedSnippets));
//     setSnippetName('');
//     alert('Snippet saved successfully!');
//     handleCloseDialog();
//   };

//   function codeBlock({ node, inline, className, children, ...props }) {
//     if (!children) {
//       return null;
//     }
//     const value = String(children).replace(/\n$/, '');
//     if (!value) {
//       return null;
//     }

//     const handleCopy = () => {
//       navigator.clipboard.writeText(children);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     };
//     const match = /language-(\w+)/.exec(className || '');
//     const language = match ? match[1] : '';

//     return !inline && match ? (
//       <Box
//         sx={{
//           padding: { xs: '10px', sm: '15px', md: '20px' },
//           fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
//           lineHeight: 1.5,
//           wordBreak: 'break-word',
//         }}
//       >
//         <Box
//           sx={{
//             // mb: 1,
//             display: 'flex',
//             width: '100%',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             backgroundColor: '#333',
//             padding: 1, // equal to 24px (MuiBox)
//             color: '#fff',
//             borderRadius: '4px 4px 0 0',
//           }}
//         >
//           <Typography variant="caption" sx={{ fontWeight: 'bold', ml: 2 }}>
//             {match[1]}
//           </Typography>
//           <Box>
//             <IconButton
//               size="small"
//               onClick={() => handlePreviewCode(value, match[1])}
//             >
//               <DashboardIcon />
//             </IconButton>
//             <IconButton
//               size="small"
//               onClick={() => handleOpenDialog(value, match[1])}
//             >
//               <FaSave />
//             </IconButton>
//             {copied ? (
//               <Typography variant="caption" color="success.main">
//                 Copied!
//               </Typography>
//             ) : (
//               <IconButton size="small" onClick={handleCopy}>
//                 <FaCopy />
//               </IconButton>
//             )}
//           </Box>
//         </Box>
//         <Box sx={{ overflowY: 'auto' }}>
//           <SyntaxHighlighter
//             // children={String(children).replace(/\n$/, '')}
//             children={value}
//             style={oneDark}
//             language={match[1]}
//             PreTag="div"
//             customStyle={{ margin: '0' }}
//             // {...props}
//           />
//         </Box>
//       </Box>
//     ) : (
//       <code className={className} {...props}>
//         {value}
//       </code>
//     );
//   }
//   const renderers = {
//     p({ children }) {
//       return <p className="mb-2 last:mb-0">{children}</p>;
//     },
//     img({ node, ...props }) {
//       return <img className="max-w-[67%]" {...props} alt={props.alt} />;
//     },
//     code: codeBlock,
//   };
//   // const match = /language-(\w+)/.exec(className || '');

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -20 }}
//         style={{
//           maxWidth: '80%',
//           borderRadius: theme.shape.borderRadius * 2, // Rounded-lg equivalent
//           padding: theme.spacing(1, 2), // px-4 py-2
//           backgroundColor:
//             message.role === 'user'
//               ? theme.palette.grey[800]
//               : theme.palette.grey[900],
//           color: theme.palette.common.white,
//           border:
//             message.role !== 'user'
//               ? `1px solid ${theme.palette.grey[700]}`
//               : 'none',
//           margin: theme.spacing(1, 0),
//         }}
//       >
//         <ReactMarkdown
//           className="markdown-body prose max-w-none dark:prose-invert"
//           children={message.content}
//           remarkPlugins={[gfm]}
//           // remarkPlugins={[remarkGfm]}
//           components={renderers}
//           // components={{
//           //   code({ inline, className, children, ...props }) {
//           //     const match = /language-(\w+)/.exec(className || '');
//           //     const language = match ? match[1] : 'typescript';
//           //     const codeString = String(children).replace(/\n$/, '');

//           //     if (!inline) {
//           //       return (
//           //         <Box sx={{ my: 2 }}>
//           //           <SyntaxHighlighter
//           //             language={language}
//           //             style={oneDark}
//           //             PreTag="div"
//           //             customStyle={{
//           //               margin: 0,
//           //               borderRadius: theme.shape.borderRadius,
//           //               background: '#1a1b26',
//           //               padding: theme.spacing(2),
//           //               fontSize: '0.875rem',
//           //             }}
//           //             {...props}
//           //           >
//           //             {codeString}
//           //           </SyntaxHighlighter>
//           //           <CodePreview code={codeString} language={language} />
//           //         </Box>
//           //       );
//           //     } else {
//           //       return (
//           //         <Box
//           //           component="code"
//           //           sx={{
//           //             backgroundColor: theme.palette.grey[800],
//           //             padding: '0.25rem 0.5rem',
//           //             borderRadius: theme.shape.borderRadius,
//           //             fontFamily: 'Monospace',
//           //             fontSize: '0.875rem',
//           //           }}
//           //           {...props}
//           //         >
//           //           {children}
//           //         </Box>
//           //       );
//           //     }
//           //   },
//           // }}
//         />
//         {/* {message.content}
//         </ReactMarkdown> */}

//         {isStreaming && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ repeat: Infinity, duration: 1 }}
//             style={{ display: 'inline-block', marginLeft: theme.spacing(0.5) }}
//           >
//             ▊
//           </motion.div>
//         )}

//         {message?.files && message?.files.length > 0 && (
//           <Box
//             sx={{
//               mt: 2,
//               display: 'flex',
//               flexWrap: 'wrap',
//               gap: 1,
//             }}
//           >
//             {message.files.map((file, index) => (
//               <FilePreview
//                 key={index}
//                 file={file}
//                 onRemove={() => {}} // Read-only in chat
//               />
//             ))}
//           </Box>
//         )}
//       </motion.div>
//     </AnimatePresence>
//   );
// }

// export default MessageContent;
