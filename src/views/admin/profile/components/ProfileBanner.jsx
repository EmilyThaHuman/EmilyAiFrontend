import { Box, CardContent, Typography } from '@mui/material';

import { useMode } from 'hooks';

import { AvatarWrapper, BannerImage, StyledCard } from './styled';

export const ProfileBanner = props => {
  const { theme } = useMode();
  const { banner, avatar, name, job, posts, followers, following } = props;
  const textColorPrimary = theme.palette.text.primary;
  const textColorSecondary = theme.palette.text.secondary;
  const borderColor = theme.palette.background.paper;

  return (
    <StyledCard className="profile-banner" theme={theme}>
      <BannerImage src={banner} theme={theme} />
      <AvatarWrapper src={avatar} theme={theme} />
      <CardContent theme={theme}>
        <Typography
          color={textColorPrimary}
          variant="h6"
          fontWeight="bold"
          mt={1}
          theme={theme}
        >
          {name}
        </Typography>
        <Typography color={textColorSecondary} variant="body2">
          {job}
        </Typography>
        <Box display="flex" justifyContent="center" mt={3}>
          <Box textAlign="center" mx={3}>
            <Typography color={textColorPrimary} variant="h5" fontWeight="700">
              {posts}
            </Typography>
            <Typography
              color={textColorSecondary}
              variant="body2"
              fontWeight="400"
            >
              Posts
            </Typography>
          </Box>
          <Box textAlign="center" mx={3}>
            <Typography color={textColorPrimary} variant="h5" fontWeight="700">
              {followers}
            </Typography>
            <Typography
              color={textColorSecondary}
              variant="body2"
              fontWeight="400"
            >
              Followers
            </Typography>
          </Box>
          <Box textAlign="center" mx={3}>
            <Typography color={textColorPrimary} variant="h5" fontWeight="700">
              {following}
            </Typography>
            <Typography
              color={textColorSecondary}
              variant="body2"
              fontWeight="400"
            >
              Following
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default ProfileBanner;
