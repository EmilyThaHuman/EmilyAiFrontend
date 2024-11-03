import { ArrowUpward as ArrowUpwardIcon } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import BarChart from 'components/themed/CommonUi/charts/BarChart';

export const DailyTraffic = props => {
  const { ...rest } = props;
  const theme = useTheme();

  return (
    <Card sx={{ width: '100%', ...rest }}>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="flex-start">
          <Grid item>
            <Typography variant="body2" color="text.secondary">
              Daily Traffic
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Typography variant="h4" component="div">
                2.579
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                Visitors
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ArrowUpwardIcon color="success" fontSize="small" />
              <Typography
                variant="body2"
                color="success.main"
                fontWeight="bold"
              >
                +2.45%
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ height: 240, mt: 'auto' }}>
          <BarChart
            chartData={props.data.data}
            chartOptions={props.data.options}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

DailyTraffic.propTypes = {
  data: PropTypes.object,
};

export default DailyTraffic;
