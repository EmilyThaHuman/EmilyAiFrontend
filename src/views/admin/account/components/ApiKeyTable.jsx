import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Chip,
  Box,
} from '@mui/material';
import { useState, useMemo } from 'react';

export function RevokeDialog({ apiKey, open, onClose }) {
  const handleRevoke = () => {
    console.log(`Revoking API key ${apiKey}`);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Revoke API Key</DialogTitle>
      <DialogContent>
        {`Are you sure you want to revoke client key *****${apiKey.clientKey} and server key *****${apiKey.serverKey}?`}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleRevoke} color="secondary">
          Revoke Key
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Actions({ apiKey }) {
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        disabled={apiKey.status !== 'valid'}
        onClick={() => setIsRevokeModalOpen(true)}
      >
        Revoke
      </Button>
      <RevokeDialog
        apiKey={apiKey}
        open={isRevokeModalOpen}
        onClose={() => setIsRevokeModalOpen(false)}
      />
    </>
  );
}

export function ApiKeyTable({ apiKeys }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredKeys = useMemo(() => {
    return apiKeys
      .filter(key =>
        key.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a.status === b.status) {
          return new Date(b.expiresAt) - new Date(a.expiresAt);
        }
        return a.status === 'valid' ? -1 : 1;
      });
  }, [apiKeys, searchTerm]);

  return (
    <Box>
      <TextField
        placeholder="Search table"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        fullWidth
        variant="outlined"
        margin="normal"
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Client Key</TableCell>
              <TableCell>Server Key</TableCell>
              <TableCell>Expires At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredKeys.map(key => (
              <TableRow key={key.clientKey}>
                <TableCell>{key.description}</TableCell>
                <TableCell>
                  <Chip
                    label={key.status}
                    color={
                      key.status === 'valid'
                        ? 'success'
                        : key.status === 'expired'
                          ? 'default'
                          : 'error'
                    }
                  />
                </TableCell>
                <TableCell>*******{key.clientKey}</TableCell>
                <TableCell>*******{key.serverKey}</TableCell>
                <TableCell>
                  {new Date(key.expiresAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Actions apiKey={key} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// Example data using EnvKeys
const apiKeys = [
  {
    description: 'OpenAI Key',
    clientKey: '1234',
    serverKey: '5678',
    expiresAt: '2025-01-01',
    status: 'valid',
  },
  {
    description: 'Anthropic Key',
    clientKey: '4321',
    serverKey: '8765',
    expiresAt: '2023-12-31',
    status: 'expired',
  },
  {
    description: 'Google Gemini Key',
    clientKey: '0987',
    serverKey: '6543',
    expiresAt: '2024-06-15',
    status: 'valid',
  },
  // Add more key objects based on your EnvKeys structure
];
