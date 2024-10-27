import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import React from 'react';

function CreateAssistant() {
  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <DialogTitle>
        Create assistant
        <IconButton
          aria-label="close"
          style={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" gutterBottom>
          Profile picture
        </Typography>
        <Button variant="outlined" style={{ marginRight: 8 }}>
          Upload
        </Button>
        <Button variant="outlined">Generate</Button>
        <TextField
          margin="normal"
          label="Name"
          fullWidth
          placeholder="Enter name"
        />
        <TextField
          margin="normal"
          label="Handle"
          fullWidth
          placeholder="@ handle"
        />
        <TextField
          margin="normal"
          label="What should the assistant know to provide better responses?"
          fullWidth
          multiline
          rows={3}
          placeholder="e.g. I’m a software developer and only use Python for data analysis."
        />
        <TextField
          margin="normal"
          label="How would you like the assistant to respond?"
          fullWidth
          multiline
          rows={3}
          placeholder="e.g. When I ask you for code, please just give me the code without any explanation on how it works. Bias towards the most efficient solution. Include comments throughout the code."
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateAssistant;
