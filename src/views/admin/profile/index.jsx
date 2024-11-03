import { Bolt as BoltIcon } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  Switch,
  Tab,
  Tabs,
  Typography,
  Button,
  Container,
  CardActions,
  TextField,
  Checkbox,
} from '@mui/material';
import { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

import { banner } from 'assets/img/auth';
import { MainMenu } from 'components';
import DEFAULT_MENU_ITEMS from '@/config/data-configs/menu';
import { useUserStore } from 'contexts/UserProvider';

import {
  ProfileBanner,
  ProfileInfoComponent,
  ProfileIconSelector,
  Storage,
} from './components';
import { ApiKeyTable } from '../account/components/ApiKeyTable';
import EnvKeys from '../account/components/EnvKeys';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const plans = [
  {
    name: 'Free',
    cta: 'Current Plan',
    desc: 'Perfect for tinkering on passion projects',
    price: 0,
    priceAnnual: 0,
    priceIdMonth: '',
    priceIdYear: '',
    isMostPop: false,
    features: [
      '100,000 logs / month',
      'Detailed User Analytics',
      'Track multiple API keys (soon)',
      'Data Exports (soon)',
      'Email / Slack Alerts (soon)',
    ],
  },
  {
    name: 'Pro',
    cta: 'Upgrade to Pro',
    desc: 'For production apps and teams.',
    price: 20,
    priceAnnual: 15,
    priceIdMonth: 'price_1NaV0jB24wj8TkEzdNo0HXp7',
    priceIdYear: 'price_1NaV0jB24wj8TkEzGVbNRFHf',
    isMostPop: true,
    features: [
      'Unlimited logs / month',
      'Detailed User Analytics',
      'Track multiple API keys (soon)',
      'Data Exports (soon)',
      'Email / Slack Alerts (soon)',
      'Weekly / Monthly Reports (soon)',
      'Unlimited team members (soon)',
      'Unlimited projects (soon)',
    ],
  },
  {
    name: 'Enterprise',
    cta: 'Contact Us',
    desc: "For large-scale applications managing serious workloads. Let us know what you need and we'll make it happen.",
    price: 'Contact Us',
    priceAnnual: 'Contact Us',
    priceIdMonth: '',
    priceIdYear: '',
    isMostPop: false,
    features: [
      'SOC 2',
      '24/7/365 Priority Support',
      'Priority Feature Requests',
      'Private Slack channel',
    ],
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const {
    state: { user },
  } = useUserStore();
  const [billingInterval, setBillingInterval] = useState('month');

  const handleCheckout = planName => {
    if (!user) {
      navigate('/auth/sign-in');
      return;
    }

    if (planName === 'Enterprise') {
      window.open('https://cal.com/dillionverma/llm-report-demo', '_blank');
    } else {
      const params = new URLSearchParams({ client_reference_id: user.id });
      const paymentLink =
        plans[process.env.NODE_ENV][planName.toLowerCase()].monthly;
      const url = `${paymentLink}?${params.toString()}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Suspense>
      <Container sx={{ py: 4 }}>
        <Box textAlign="center" maxWidth="md" mx="auto">
          <Typography
            variant="h4"
            component="h3"
            color="text.primary"
            gutterBottom
          >
            Simple pricing.
          </Typography>
          <Typography variant="body1">
            <strong>100k logs free every month.</strong> No credit card
            required.
          </Typography>
        </Box>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {plans.map((plan, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card
                variant="outlined"
                sx={{
                  border: plan.isMostPop ? '2px solid' : '1px solid',
                  borderColor: plan.isMostPop ? 'primary.main' : 'divider',
                  boxShadow: plan.isMostPop ? 3 : 1,
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  {plan.isMostPop && (
                    <Typography
                      variant="caption"
                      color="primary"
                      sx={{
                        position: 'absolute',
                        top: -10,
                        backgroundColor: 'background.paper',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        boxShadow: 1,
                      }}
                    >
                      Most popular
                    </Typography>
                  )}
                  <Typography variant="h6" color="primary" gutterBottom>
                    {plan.name}
                  </Typography>
                  <Typography variant="h4" color="text.primary">
                    {billingInterval === 'month'
                      ? plan.price === 'Contact Us'
                        ? plan.price
                        : formatter.format(plan.price)
                      : plan.priceAnnual === 'Contact Us'
                        ? plan.priceAnnual
                        : formatter.format(plan.priceAnnual)}
                    {plan.price !== 'Contact Us' && (
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        / month
                      </Typography>
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {plan.desc}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center' }}>
                  <Button
                    variant={plan.isMostPop ? 'contained' : 'outlined'}
                    color="primary"
                    startIcon={plan.name === 'Pro' ? <BoltIcon /> : null}
                    fullWidth
                    onClick={() => handleCheckout(plan.name)}
                    disabled={user && plan.cta === 'Current Plan'}
                  >
                    {plan.cta}
                  </Button>
                </CardActions>
                <Box sx={{ px: 2, pb: 2 }}>
                  <Typography variant="subtitle2" color="text.primary">
                    Features
                  </Typography>
                  <ul>
                    {plan.features.map((feature, featureIdx) => (
                      <li key={featureIdx}>
                        <Typography variant="body2" color="text.secondary">
                          {feature}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Suspense>
  );
};

const OrganizationSettings = () => {
  const [orgData, setOrgData] = useState({
    name: 'reed_tha_human',
    id: 'org-8tsuoX9mFwv3xPr9E4nFJZW',
    apiKey: '87b5************************************',
    auditLogging: false,
    accessControl: false,
  });

  useEffect(() => {
    const savedData = localStorage.getItem('organizationSettings');
    if (savedData) {
      setOrgData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = field => event => {
    const newValue =
      field === 'auditLogging' || field === 'accessControl'
        ? event.target.checked
        : event.target.value;
    setOrgData(prevData => {
      const updatedData = { ...prevData, [field]: newValue };
      localStorage.setItem('organizationSettings', JSON.stringify(updatedData));
      return updatedData;
    });
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 10,
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Organization settings
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Details
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body1"
            component="label"
            sx={{ display: 'block', mb: 1 }}
          >
            Organization name
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Human-friendly label for your organization, shown in user interfaces
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={orgData.name}
            onChange={handleChange('name')}
          />
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body1"
            component="label"
            sx={{ display: 'block', mb: 1 }}
          >
            Organization ID
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Identifier for this organization sometimes used in API requests
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={orgData.id}
            InputProps={{ readOnly: true }}
          />
        </Box>
      </Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Integrations
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body1"
            component="label"
            sx={{ display: 'block', mb: 1 }}
          >
            Weights and Biases
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Your organization&apos;s Weights and Biases API Key. If set, enables
            the Weights and Biases integration for the{' '}
            <a
              href="http://localhost:3000/admin/profile"
              style={{ color: 'green' }}
            >
              fine-tuning API
            </a>
            . This key will be used to generate runs in your specified W&B
            project. See the{' '}
            <a
              href="http://localhost:3000/admin/profile"
              style={{ color: 'green' }}
            >
              documentation
            </a>{' '}
            for more information.
          </Typography>
          <Box sx={{ display: 'flex' }}>
            <TextField
              fullWidth
              variant="outlined"
              value={orgData.apiKey}
              onChange={handleChange('apiKey')}
              sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            />
            <Button
              variant="contained"
              color="success"
              sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              Update
            </Button>
          </Box>
        </Box>
      </Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Features and capabilities
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body1"
            component="label"
            sx={{ display: 'block', mb: 1 }}
          >
            Audit logging
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Enable logging of user actions and configuration changes within this
            organization for compliance and security analysis. Once enabled, it
            cannot be disabled without contacting OpenAI.
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={orgData.auditLogging}
                onChange={handleChange('auditLogging')}
                color="success"
              />
            }
            label="Enable"
          />
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body1"
            component="label"
            sx={{ display: 'block', mb: 1 }}
          >
            Access Control
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Disable user-based API keys across your entire organization. You can
            also choose to disable them on a project-by-project basis if needed.
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={orgData.accessControl}
                onChange={handleChange('accessControl')}
                color="success"
              />
            }
            label="Disable user API keys"
          />
        </Box>
      </Box>
      <Button variant="contained" color="success">
        Save
      </Button>
    </Container>
  );
};
const SettingsSwitchCard = props => {
  return (
    <Card
      sx={{ mb: '20px', mt: '40px', mx: 'auto', maxWidth: '410px' }}
      {...props}
    >
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb="30px"
        >
          <Typography variant="h6" fontWeight="bold">
            Notifications
          </Typography>
          <MainMenu items={DEFAULT_MENU_ITEMS} />
        </Box>
        {[
          {
            id: '1',
            label: 'Item update notifications',
            checked: true,
          },
          { id: '2', label: 'Item comment notifications' },
          {
            id: '3',
            label: 'Buyer review notifications',
            checked: true,
          },
          {
            id: '4',
            label: 'Rating reminders notifications',
            checked: true,
          },
          { id: '5', label: 'Meetups near you notifications' },
          { id: '6', label: 'Company news notifications' },
          {
            id: '7',
            label: 'New launches and projects',
            checked: true,
          },
          { id: '8', label: 'Monthly product changes' },
          {
            id: '9',
            label: 'Subscribe to newsletter',
            checked: true,
          },
          { id: '10', label: 'Email me when someone follows me' },
        ].map(item => (
          <FormControlLabel
            key={item.id}
            control={<Switch checked={item.checked} />}
            label={item.label}
            sx={{ mb: '20px', fontSize: '0.875rem' }}
          />
        ))}
      </CardContent>
    </Card>
  );
};

const UserProfileForm = ({ userData, setUserData }) => {
  const handleChange = field => event => {
    const newValue = event.target.value;
    setUserData(prevData => {
      const updatedData = { ...prevData, [field]: newValue };
      localStorage.setItem('userProfile', JSON.stringify(updatedData));
      return updatedData;
    });
  };

  return (
    <form>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body1"
          component="label"
          sx={{ display: 'block', mb: 1 }}
        >
          Name
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          The name associated with this account
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value={userData.name}
          onChange={handleChange('name')}
        />
      </Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body1"
          component="label"
          sx={{ display: 'block', mb: 1 }}
        >
          Email address
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          The email address associated with this account
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value={userData.email}
          onChange={handleChange('email')}
        />
      </Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body1"
          component="label"
          sx={{ display: 'block', mb: 1 }}
        >
          Phone number
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          The phone number associated with this account
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value={userData.phone}
          onChange={handleChange('phone')}
        />
      </Box>
      <Button type="button" variant="contained" color="success">
        Save
      </Button>
    </form>
  );
};

export default function Overview() {
  const {
    state: { user, selectedProfileImage },
  } = useUserStore();

  const [userData, setUserData] = useState({
    name: user.username,
    email: user.email,
    phone: user.phone || 'No phone provided',
    bio: user.profile.bio || 'No bio provided',
    image: selectedProfileImage,
    job: user.profile.job || 'No job provided',
    posts: '17',
    followers: '9700',
    following: '274',
  });

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box pt={{ xs: '130px', sm: '80px' }}>
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Dashboard" />
        <Tab label="Profile" />
        <Tab label="Account" />
        <Tab label="Settings" />
      </Tabs>
      {selectedTab === 0 && (
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
                <ProfileBanner
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
                <ProfileInfoComponent userData={userData} />
              </Grid>
            </Grid>
            <Grid container id="row-2" direction="row" spacing={2}>
              <Grid id="row-2-col-1" item xs={12}>
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
                  ]}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
      {selectedTab === 1 && (
        <Box>
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
                <Grid id="row-1-col-1" item xs={12}>
                  <ProfileIconSelector />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} id="col-1">
              <Grid container id="row-2" direction="row" spacing={2}>
                <Grid id="row-2-col-1" item xs={12}>
                  <UserProfileForm
                    userData={userData}
                    setUserData={setUserData}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      )}
      {selectedTab === 2 && (
        <Box>
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
                <Grid id="row-1-col-1" item xs={12}>
                  <Pricing />
                </Grid>
              </Grid>
              <Grid container id="row-2" direction="row" spacing={2}>
                <Grid id="row-2-col-1" item xs={12}>
                  <Storage used={25.6} total={50} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      )}
      {selectedTab === 3 && (
        <Box>
          <Grid
            id="profile-layout-container"
            container
            spacing={2}
            sx={{
              m: 'auto',
            }}
          >
            <Grid container id="row-1" direction="row" spacing={2}>
              <Grid id="row-1-col-1" item xs={12}>
                <EnvKeys />
              </Grid>
            </Grid>
            <Grid item xs={12} id="col-1">
              <Grid container id="row-1" direction="row" spacing={2}>
                <Grid id="row-1-col-2" item xs={12}>
                  <SettingsSwitchCard />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} id="col-1">
              <Grid container id="row-1" direction="row" spacing={2}>
                <Grid id="row-1-col-2" item xs={12}>
                  <OrganizationSettings />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}
