import { Save, Edit, Delete, Close } from '@mui/icons-material';
import {
  Modal,
  Button,
  TextField,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import styled from 'styled-components';

const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled(Box)`
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
  width: 60%;
  max-width: 800px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const PromptTemplatesDisplay = ({ prompt, onClose, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...prompt });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  if (!prompt) return null;

  return (
    <StyledModal open={Boolean(prompt)} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ModalContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h5" component="h2">
              {isEditing ? (
                <TextField
                  variant="outlined"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  fullWidth
                />
              ) : (
                formData.title
              )}
            </Typography>
            <Box>
              {isEditing ? (
                <IconButton onClick={handleSave} color="primary">
                  <Save />
                </IconButton>
              ) : (
                <IconButton onClick={() => setIsEditing(true)} color="primary">
                  <Edit />
                </IconButton>
              )}
              <IconButton onClick={() => onDelete(prompt)} color="secondary">
                <Delete />
              </IconButton>
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            </Box>
          </Box>
          <Typography variant="body1" mb={2}>
            <strong>Description:</strong>
            {isEditing ? (
              <TextField
                variant="outlined"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
              />
            ) : (
              formData.description
            )}
          </Typography>
          <Typography variant="body1" mb={2}>
            <strong>Full Prompt Content:</strong>
            {isEditing ? (
              <TextField
                variant="outlined"
                name="content"
                value={formData.content}
                onChange={handleChange}
                fullWidth
                multiline
              />
            ) : (
              formData.content
            )}
          </Typography>
          <Typography variant="body1">
            <strong>Sample Output:</strong>
            {isEditing ? (
              <TextField
                variant="outlined"
                name="output"
                value={formData.output}
                onChange={handleChange}
                fullWidth
                multiline
              />
            ) : (
              formData.output
            )}
          </Typography>
        </ModalContent>
      </motion.div>
    </StyledModal>
  );
};

export default PromptTemplatesDisplay;
