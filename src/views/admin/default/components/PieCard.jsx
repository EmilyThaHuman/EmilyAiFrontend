import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import PieChart from 'components/themed/CommonUi/charts/PieChart';

export const PieCard = props => {
  const { ...rest } = props;
  const theme = useTheme();

  return (
    <Card sx={{ width: '100%', ...rest }}>
      <CardContent>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Grid item>
            <Typography variant="h6" component="div">
              Your Pie Chart
            </Typography>
          </Grid>
          <Grid item>
            <Select
              defaultValue="monthly"
              size="small"
              sx={{ fontWeight: 'bold' }}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </Grid>
        </Grid>

        <PieChart
          height="100%"
          width="100%"
          chartData={props.data.data}
          chartOptions={props.data.options}
        />

        <Card sx={{ mt: 2, p: 2, boxShadow: theme.shadows[1] }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    mr: 1,
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  Your files
                </Typography>
              </Box>
              <Typography variant="h6" component="div">
                63%
              </Typography>
            </Grid>
            <Divider orientation="vertical" flexItem />
            <Grid item xs={5}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: '#6AD2FF',
                    mr: 1,
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  System
                </Typography>
              </Box>
              <Typography variant="h6" component="div">
                25%
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </CardContent>
    </Card>
  );
};

PieCard.propTypes = {
  data: PropTypes.object,
};

export default PieCard;
