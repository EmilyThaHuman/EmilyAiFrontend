import EmojiPicker from '@emoji-mart/react';
import { Box, Menu, MenuItem } from '@mui/material';
import React, {
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
  useMemo,
} from 'react';

import { useMenu, useMode, useTipTapEditor } from '@/hooks';
import {
  CodeIcon,
  EmojiEmotionsIcon,
  InsertDriveFileOutlined,
  ApiIcon,
} from 'assets/humanIcons';
import { RCSpeedDial } from 'components/themed';
import { useChatStore } from 'contexts/ChatProvider';
import { useUserStore } from 'contexts/UserProvider';

import { ApiModal } from './ApiModal';

const MemoizedRCSpeedDial = React.memo(RCSpeedDial);
const MemoizedApiModal = React.memo(ApiModal);
const MemoizedEmojiPicker = React.memo(EmojiPicker);

export const ToolDial = ({ containerRef }) => {
  const {
    actions: { setApiKey },
  } = useChatStore();
  const {
    state: {
      user: { profile },
    },
  } = useUserStore();
  const { insertForm, insertCodeBlock, insertContentAndSync, editor } =
    useTipTapEditor();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [inputCode, setInputCode] = useState(profile?.openai?.apiKey);
  const [apiModalOpen, setApiModalOpen] = useState(false);

  const toggleSpeedDial = useCallback(() => {
    setSpeedDialOpen(prevOpen => !prevOpen);
  }, []);

  const formMenu = useMenu();

  const handleCloseDial = useCallback(() => {
    formMenu.handleMenuClose();
    toggleSpeedDial();
  }, [formMenu, toggleSpeedDial]);

  const handleInsertCodeBlock = useCallback(() => {
    if (editor) {
      insertCodeBlock();
    }
  }, [editor, insertCodeBlock]);

  const handleChange = useCallback(event => {
    setInputCode(event.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    setApiKey(inputCode);
    setApiModalOpen(false);
  }, [inputCode]);

  const handleApiModalToggle = useCallback(() => {
    setApiModalOpen(prev => !prev);
  }, []);

  const actions = useMemo(
    () => [
      {
        icon: <CodeIcon />,
        name: 'CodeBlock',
        title: 'Insert Code',
        onClick: handleInsertCodeBlock,
      },
      {
        icon: <EmojiEmotionsIcon />,
        name: 'Emoji',
        title: 'Insert Emoji',
        onClick: () => setShowEmojiPicker(prev => !prev),
      },
      {
        icon: <InsertDriveFileOutlined />,
        name: 'Form',
        title: 'Insert Form',
        onClick: formMenu.toggle,
      },
      {
        icon: <ApiIcon />,
        name: 'Api',
        title: 'API Settings',
        onClick: handleApiModalToggle,
      },
    ],
    [handleInsertCodeBlock, formMenu.toggle, handleApiModalToggle]
  );

  useEffect(() => {
    // Cleanup on unmount if necessary
    return () => {
      setShowEmojiPicker(false);
      setSpeedDialOpen(false);
      setInputCode('');
    };
  }, []);

  useLayoutEffect(() => {
    const updatePosition = () => {
      setToolDialStyles({
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
      });
    };

    // Call on mount using requestAnimationFrame to wait for the DOM to be fully ready
    const rafId = requestAnimationFrame(() => {
      updatePosition();
    });

    // Call on window resize
    window.addEventListener('resize', updatePosition);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updatePosition);
    };
  }, [speedDialOpen]);

  const [toolDialStyles, setToolDialStyles] = useState({
    zIndex: 1000,
    bottom: 20,
    right: 20,
  });

  return (
    <Box sx={toolDialStyles}>
      <MemoizedRCSpeedDial
        actions={actions}
        onOpen={toggleSpeedDial}
        onClose={handleCloseDial}
        open={speedDialOpen}
        hidden={false}
        variant="darkMode"
      />
      <MemoizedApiModal
        open={apiModalOpen}
        onClose={handleApiModalToggle}
        inputCode={inputCode}
        onInputChange={handleChange}
        onSubmit={handleSubmit}
      />
      {formMenu.isOpen && (
        <Menu
          open={formMenu.isOpen}
          anchorEl={formMenu.anchorEl}
          onClose={formMenu.handleMenuClose}
          onOpen={formMenu.handleMenuOpen}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          {['Select input', 'Text input'].map(form => (
            <MenuItem key={form} onClick={() => insertForm(editor, form)}>
              {form}
            </MenuItem>
          ))}
        </Menu>
      )}
      {showEmojiPicker && (
        <MemoizedEmojiPicker
          onEmojiSelect={emoji => {
            insertContentAndSync(emoji.native);
            setShowEmojiPicker(false);
          }}
          theme="dark"
          style={{ position: 'absolute', bottom: '60px', left: '20px' }}
        />
      )}
    </Box>
  );
};

export default ToolDial;
