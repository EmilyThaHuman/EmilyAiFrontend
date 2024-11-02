import { TextField, Box, Typography, CircularProgress } from '@mui/material';
import React, { useState, useCallback } from 'react';

import { toast } from '@/services';
import { userApi } from 'api/user';
import { CancelIcon, CheckCircleIcon } from 'assets/humanIcons';

export const ProfileStep = ({
  username,
  displayName,
  setProfileData,
  usernameAvailable,
  setUsernameAvailable,
}) => {
  const [loading, setLoading] = useState(false);

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const checkUsernameAvailability = useCallback(
    debounce(async username => {
      if (!username) return setUsernameAvailable(false);
      setLoading(true);
      try {
        const data = await userApi.checkUsernameAvailability(username);
        setUsernameAvailable(data.isAvailable);
      } catch (error) {
        toast.error('Error checking username availability');
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleUsernameChange = e => {
    const { value } = e.target;
    setProfileData(prev => ({ ...prev, username: value }));
    checkUsernameAvailability(value);
  };

  return (
    <Box
      sx={{
        backgroundColor: 'black',
        color: 'white',
        p: 4,
        borderRadius: 2,
        maxWidth: 500,
        mx: 'auto',
      }}
    >
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          label="Username"
          value={username}
          onChange={handleUsernameChange}
        />
        {loading ? (
          <CircularProgress size={20} />
        ) : usernameAvailable ? (
          <CheckCircleIcon
            color="success"
            sx={{
              marginLeft: '-40px',
            }}
          />
        ) : (
          <CancelIcon
            color="error"
            sx={{
              marginLeft: '-40px',
            }}
          />
        )}
      </Box>
      <Box>
        <TextField
          fullWidth
          variant="outlined"
          label="Display Name"
          value={displayName}
          onChange={e =>
            setProfileData(prev => ({ ...prev, displayName: e.target.value }))
          }
        />
      </Box>
    </Box>
  );
};

export default ProfileStep;
