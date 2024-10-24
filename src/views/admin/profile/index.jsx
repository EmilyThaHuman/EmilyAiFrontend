import { Box, Grid } from '@mui/material';

import { banner } from 'assets/img/auth';
import { useUserStore } from 'contexts/UserProvider';
import Banner from 'views/admin/profile/components/Banner';
import General from 'views/admin/profile/components/General';
import Notifications from 'views/admin/profile/components/Notifications';
import Projects from 'views/admin/profile/components/Projects';
import Storage from 'views/admin/profile/components/Storage';
import Upload from 'views/admin/profile/components/Upload';

import { ApiKeyTable } from '../account/components/ApiKeyTable';
import EnvKeys from '../account/components/EnvKeys';

// =========================================================
// [USER PROFILE] | ...
// =========================================================

export default function Overview() {
  const {
    state: { user, selectedProfileImage },
  } = useUserStore();

  const userData = {
    name: user.username,
    email: user.email,
    bio: user.profile.bio || 'No bio provided',
    image: selectedProfileImage,
    job: user.profile.job || 'No job provided',
    posts: '17',
    followers: '9700',
    following: '274',
  };

  return (
    <Box pt={{ xs: '130px', sm: '80px' }}>
      <Grid
        id="profile-layout-container"
        container
        spacing={2}
        sx={{
          m: 'auto',
        }}
      >
        <Grid item xs={12} id="col-1">
          <Grid container id="row-1" direction="row" spacing={2}>
            <Grid id="row-1-col-1" item xs={12} md={4}>
              <Banner
                banner={banner}
                avatar={userData.image}
                name={userData.name}
                job={userData.job}
                posts={userData.posts}
                followers={userData.followers}
                following={userData.following}
              />
            </Grid>
            <Grid id="row-1-col-2" item xs={12} md={8}>
              <ApiKeyTable
                apiKeys={[
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
                ]}
              />
              {/* <EnvKeys /> */}
              {/* <Storage used={25.6} total={50} /> */}
              {/* </Grid>
            <Grid id="row-1-col-3" item xs={12} md={5}> */}
              {/* <Upload /> */}
            </Grid>
          </Grid>
          <Grid id="row-2" container direction="row">
            <Grid
              item
              id="row-2-col-1"
              xs={12}
              md={6}
              sx={{ marginBottom: '20px' }}
            >
              <Projects />
            </Grid>
            <Grid item id="row-2-col-2" xs={12} md={6}>
              <General minHeight="365px" paddingRight="20px" />
            </Grid>
          </Grid>
          <Grid id="row-3" container direction="row">
            <Grid item id="row-3-col-1" xs={12}>
              <Notifications />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
