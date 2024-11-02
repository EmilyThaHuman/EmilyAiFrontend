import { Box, Typography, Card, CardContent, Divider } from '@mui/material';
import React from 'react';

import { useMode } from 'hooks/app';

import { StyledCard } from './styled';

export const ProfileInfoComponent = ({ userData }) => {
  const { theme } = useMode();
  const textColorPrimary = theme.palette.grey[900];

  return (
    <StyledCard className="profile-banner" theme={theme}>
      <CardContent>
        <Typography
          color={textColorPrimary}
          fontWeight="bold"
          fontSize="2xl"
          mt={2}
          mb={1}
          textAlign="start"
          mr={2}
        >
          General Information
        </Typography>
        <Divider />
        <Typography variant="h5" component="div" gutterBottom>
          {userData.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {userData.job}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1.5 }}>
          {userData.bio}
        </Typography>
        <Divider />
        <Box mt={2}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Email:</strong> {userData.email}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Location:</strong> {userData.location || 'Not specified'}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Website:</strong> {userData.website || 'Not specified'}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Posts:</strong> {userData.posts}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Followers:</strong> {userData.followers}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Following:</strong> {userData.following}
          </Typography>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default ProfileInfoComponent;
