import {
  Box,
  Card,
  CardContent,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';

import BarChart from 'components/themed/CommonUi/charts/BarChart';

export const UserActivity = props => {
  return (
    <Card sx={{ width: '100%' }} {...props}>
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          px="15px"
          py="10px"
        >
          <Typography variant="h6" fontWeight="bold">
            User Activity
          </Typography>
          <Select defaultValue="Weekly">
            <MenuItem value="Weekly">Weekly</MenuItem>
            <MenuItem value="Daily">Daily</MenuItem>
            <MenuItem value="Monthly">Monthly</MenuItem>
          </Select>
        </Box>
        <Box height="240px" mt="auto">
          <BarChart
            chartData={props.data.data}
            chartOptions={props.data.options}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

UserActivity.propTypes = {
  data: PropTypes.object,
};

export default UserActivity;
