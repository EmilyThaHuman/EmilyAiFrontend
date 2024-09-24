import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Button,
  Typography,
  Grid,
  Switch,
} from '@mui/material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#e2e8f0',
    },
    primary: {
      main: '#3b82f6',
    },
    secondary: {
      main: '#A0A0A0',
    },
    accent: {
      main: '#22c55e',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    body1: {
      fontSize: '14px',
    },
    body2: {
      fontSize: '16px',
    },
    h6: {
      fontSize: '20px',
    },
  },
  shape: {
    borderRadius: 6,
  },
  spacing: 8,
});

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  width: '100%',
}));

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  height: 4,
  '& .MuiSlider-thumb': {
    '&:hover, &.Mui-focusVisible': {
      boxShadow: `0px 0px 0px 8px ${theme.palette.primary.main}30`,
    },
  },
  '& .MuiSlider-track': {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    color: theme.palette.text.primary,
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.secondary.main,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: '#ffffff',
  borderRadius: theme.shape.borderRadius,
  padding: '8px 16px',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '&:focus': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

const RagChatBotSettingsDialog = ({ open, onClose }) => {
  const { control, handleSubmit } = useForm();
  const debouncedOnChange = debounce(onChange => onChange, 300);

  const onSubmit = data => {
    console.log(data);
    // Handle form submission
    onClose();
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>RAG Chat Bot Settings</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <StyledTextField
                  label="Name"
                  {...control.register('name')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  label="Embeddings Provider"
                  {...control.register('embeddingsProvider')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <StyledFormControl>
                  <InputLabel id="model-label">Model</InputLabel>
                  <Controller
                    name="model"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select {...field} labelId="model-label" label="Model">
                        <MenuItem value="gpt-3">GPT-3</MenuItem>
                        <MenuItem value="gpt-4">GPT-4</MenuItem>
                        {/* Add more AI models as needed */}
                      </Select>
                    )}
                  />
                </StyledFormControl>
              </Grid>
              <Grid item xs={12}>
                <StyledFormControl>
                  <InputLabel id="response-format-label">
                    Response Format
                  </InputLabel>
                  <Controller
                    name="responseFormat"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="response-format-label"
                        label="Response Format"
                      >
                        <MenuItem value="text">Text</MenuItem>
                        <MenuItem value="json_object">JSON Object</MenuItem>
                        <MenuItem value="json_schema">JSON Schema</MenuItem>
                      </Select>
                    )}
                  />
                </StyledFormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography gutterBottom>Temperature</Typography>
                <Controller
                  name="temperature"
                  control={control}
                  defaultValue={0.5}
                  render={({ field }) => (
                    <StyledSlider
                      {...field}
                      onChange={(_, value) =>
                        debouncedOnChange(() => field.onChange(value))
                      }
                      min={0}
                      max={1}
                      step={0.01}
                      valueLabelDisplay="auto"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography gutterBottom>Top P</Typography>
                <Controller
                  name="topP"
                  control={control}
                  defaultValue={0.5}
                  render={({ field }) => (
                    <StyledSlider
                      {...field}
                      onChange={(_, value) =>
                        debouncedOnChange(() => field.onChange(value))
                      }
                      min={0}
                      max={1}
                      step={0.01}
                      valueLabelDisplay="auto"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography gutterBottom>Frequency Penalty</Typography>
                <Controller
                  name="frequencyPenalty"
                  control={control}
                  defaultValue={0.5}
                  render={({ field }) => (
                    <StyledSlider
                      {...field}
                      onChange={(_, value) =>
                        debouncedOnChange(() => field.onChange(value))
                      }
                      min={0}
                      max={1}
                      step={0.01}
                      valueLabelDisplay="auto"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography gutterBottom>Presence Penalty</Typography>
                <Controller
                  name="presencePenalty"
                  control={control}
                  defaultValue={0.5}
                  render={({ field }) => (
                    <StyledSlider
                      {...field}
                      onChange={(_, value) =>
                        debouncedOnChange(() => field.onChange(value))
                      }
                      min={0}
                      max={1}
                      step={0.01}
                      valueLabelDisplay="auto"
                    />
                  )}
                />
              </Grid>

              {/* New Fields */}
              <Grid item xs={12}>
                {/* Context Length */}
                <Controller
                  name="contextLength"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Context Length is required', min: 1 }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledTextField
                      {...field}
                      label="Context Length"
                      type="number"
                      fullWidth
                      error={!!error}
                      helperText={error ? error.message : null}
                    />
                  )}
                />
              </Grid>

              {/* Include Profile Context */}
              <Grid item xs={12}>
                <Typography component="div">
                  Include Profile Context: &nbsp;
                  <Controller
                    name="includeProfileContext"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <Switch {...field} checked={field.value} />
                    )}
                  />
                </Typography>
              </Grid>

              {/* Include Workspace Instructions */}
              <Grid item xs={12}>
                <Typography component="div">
                  Include Workspace Instructions: &nbsp;
                  <Controller
                    name="includeWorkspaceInstructions"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <Switch {...field} checked={field.value} />
                    )}
                  />
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="maxTokens"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Maximum Tokens is required', min: 1 }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledTextField
                      {...field}
                      label="Maximum Tokens"
                      type="number"
                      fullWidth
                      error={!!error}
                      helperText={error ? error.message : null}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="stopSequences"
                  control={control}
                  defaultValue=""
                  rules={{
                    validate: value =>
                      value.trim() !== '' || 'Stop Sequences cannot be empty',
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledTextField
                      {...field}
                      label="Stop Sequences"
                      fullWidth
                      error={!!error}
                      helperText={
                        error
                          ? error.message
                          : 'Separate entries with commas or tabs'
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={onClose}>Cancel</StyledButton>
          <StyledButton
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            color="primary"
          >
            Save Settings
          </StyledButton>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default RagChatBotSettingsDialog;
