// src/views/admin/chat/NewChatDialog.jsx
import { Settings, Send } from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Slider,
  Box,
  Typography,
  Stack,
} from '@mui/material';
import { useFormik } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import * as yup from 'yup';

// Define validation schema using Yup
const validationSchema = yup.object().shape({
  topic: yup.string().required('Topic is required'),
  prompt: yup.string().required('Prompt is required'),
  selectedComponent: yup.string().required('Component type is required'),
  temperature: yup
    .number()
    .min(0, 'Temperature must be at least 0')
    .max(1, 'Temperature cannot exceed 1')
    .required('Temperature is required'),
  useGPT4: yup.boolean(),
});

// Define component types
const componentTypes = [
  'button',
  'input',
  'dropdown',
  'checkbox',
  'radio',
  'toggle',
  'slider',
  'datepicker',
  'timepicker',
  'modal',
  'tooltip',
  'accordion',
  'tabs',
  'carousel',
  'pagination',
  'breadcrumb',
  'avatar',
  'badge',
  'card',
  'table',
];

export const NewChatDialog = ({ open, onClose, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      topic: '',
      prompt: '',
      selectedComponent: '',
      temperature: 0.7,
      useGPT4: false,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await onSubmit(values);
        resetForm();
        onClose();
      } catch (error) {
        console.error('Error submitting form:', error);
        // Optionally, handle error feedback to the user here
      } finally {
        setSubmitting(false);
      }
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    setFieldValue,
  } = formik;

  // Local state for advanced settings visibility
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Toggle advanced settings
  const toggleAdvancedSettings = useCallback(() => {
    setIsAdvancedOpen(prev => !prev);
  }, []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">New Chat Session</Typography>
          <TextField
            label="Chat Session Topic"
            name="topic"
            variant="outlined"
            size="small"
            value={values.topic}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.topic && Boolean(errors.topic)}
            helperText={touched.topic && errors.topic}
            sx={{ width: '50%' }}
          />
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            {/* Component Type Selection */}
            <FormControl
              fullWidth
              variant="outlined"
              error={
                touched.selectedComponent && Boolean(errors.selectedComponent)
              }
            >
              <InputLabel id="component-type-label">
                Select a Component Type
              </InputLabel>
              <Select
                labelId="component-type-label"
                id="selectedComponent"
                name="selectedComponent"
                value={values.selectedComponent}
                onChange={handleChange}
                onBlur={handleBlur}
                label="Select a Component Type"
              >
                {componentTypes.map(type => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </Select>
              {touched.selectedComponent && errors.selectedComponent && (
                <Typography variant="caption" color="error">
                  {errors.selectedComponent}
                </Typography>
              )}
            </FormControl>

            {/* Prompt Input */}
            <Box sx={{ position: 'relative' }}>
              <TextField
                label="Enter Your Prompt"
                name="prompt"
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                value={values.prompt}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.prompt && Boolean(errors.prompt)}
                helperText={touched.prompt && errors.prompt}
              />
              <Box
                sx={{
                  position: 'absolute',
                  right: 8,
                  bottom: 8,
                  display: 'flex',
                  gap: 1,
                }}
              >
                <IconButton
                  type="button"
                  color={isAdvancedOpen ? 'primary' : 'default'}
                  onClick={toggleAdvancedSettings}
                  aria-label="Toggle advanced settings"
                >
                  <Settings />
                </IconButton>
                <IconButton
                  type="submit"
                  color="primary"
                  disabled={isSubmitting}
                  aria-label="Send"
                >
                  <Send />
                </IconButton>
              </Box>
            </Box>

            {/* Advanced Settings with Animation */}
            <AnimatePresence>
              {isAdvancedOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <Stack spacing={3} sx={{ mt: 2 }}>
                    {/* Temperature Slider */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography>Temperature: {values.temperature}</Typography>
                      <Slider
                        name="temperature"
                        value={values.temperature}
                        min={0}
                        max={1}
                        step={0.1}
                        onChange={(e, value) =>
                          setFieldValue('temperature', value)
                        }
                        onBlur={handleBlur}
                        aria-labelledby="temperature-slider"
                        sx={{ width: '60%' }}
                      />
                    </Box>

                    {/* Use GPT-4 Switch */}
                    <FormControlLabel
                      control={
                        <Switch
                          name="useGPT4"
                          checked={values.useGPT4}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          color="primary"
                        />
                      }
                      label="Use GPT-4"
                    />
                  </Stack>
                </motion.div>
              )}
            </AnimatePresence>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Define PropTypes for better type checking
NewChatDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default React.memo(NewChatDialog);
