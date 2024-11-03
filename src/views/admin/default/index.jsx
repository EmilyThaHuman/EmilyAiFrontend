import { alpha, Box, Grid, Icon, Paper, styled } from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { useEffect, useState } from 'react';
import { MdAddChart, MdBarChart, MdFileCopy, MdMoney } from 'react-icons/md';
import { useDispatch } from 'react-redux';

import ErrorDisplay from '@/components/chat/sidebar/panel/items/sidebar-items/components/sidebar-error';
import useFileOperations from '@/components/chat/sidebar/panel/items/sidebar-items/components/useFileOperations';
import {
  DASHBOARD_CONFIGS,
  DEFAULT_FILE_TREE_DATA,
} from '@/config/data-configs/dashboard';
import { useChatStore } from '@/contexts';
import { MdAddTask } from 'assets/humanIcons';
import IconBox from 'assets/humanIcons/utils/IconBox';
import { FileTreeWidget, MiniStatistics, Spinner } from 'components/index';

import ChatPromptDisplay from './components/ChatPromptDisplay';
import DailyTraffic from './components/DailyTraffic';
import { CalendarComponent } from './components/DashboardCalendar';
import PieCard from './components/PieCard';
import { Conversion } from './components/Tasks';
import Chart from 'react-google-charts';

// =========================================================
// [DASHBOARD] | ...
// =========================================================
export const MainDashboard = () => {
  const brandColor = '#18b984';
  const boxBg = '#cdd5df';
  const [uiState, setUiState] = useState({
    loading: false,
    error: null,
  });
  const [sessionData, setSessionData] = useState([]);
  const [userData, setUserData] = useState([]);
  const {
    state: { workspaces, folders, prompts, selectedWorkspace },
  } = useChatStore();
  const { tables, charts } = DASHBOARD_CONFIGS;
  const validWorkspace = !selectedWorkspace ? workspaces[0] : selectedWorkspace;
  const validFolders = !folders ? selectedWorkspace?.folders : folders;
  const validPrompts = !prompts ? selectedWorkspace?.prompts : prompts;
  const space = 'prompts';
  const initialItems = validPrompts;
  const initialFolders = validFolders;
  const dispatch = useDispatch();
  const { loading, fetchItems } = useFileOperations(
    space,
    initialItems,
    initialFolders,
    dispatch
  );

  useEffect(() => {
    const initializeData = async () => {
      try {
        setUiState(prev => ({ ...prev, loading: true }));
        await fetchItems(space, initialItems, initialFolders, dispatch);
      } catch (err) {
        setUiState(prev => ({ ...prev, error: err.message }));
      } finally {
        setUiState(prev => ({ ...prev, loading: false }));
      }
    };

    initializeData();
  }, [space, initialItems, initialFolders, fetchItems, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      // This example assumes you have an endpoint set up to pull Google Analytics data.
      const response = await fetch('/api/analytics/sessions');
      const sessionResult = await response.json();
      setSessionData(sessionResult);

      const userResponse = await fetch('/api/analytics/users');
      const userResult = await userResponse.json();
      setUserData(userResult);
    };

    fetchData();
  }, []);

  const sessionOptions = {
    title: 'User Sessions Over Time',
    curveType: 'function',
    legend: { position: 'bottom' },
  };

  const userOptions = {
    title: 'Active Users',
    pieHole: 0.4,
    is3D: false,
  };

  if (uiState.loading) return <Spinner />;

  if (uiState.error) return <ErrorDisplay error={uiState.error} />;

  return (
    <Box marginTop={{ xs: '260px', sm: '160px' }}>
      {/* <----- Mini Statistics Section -----> */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={6} md={4} lg={2}>
          <MiniStatistics
            startContent={
              <IconBox
                width={56}
                height={56}
                bgcolor={boxBg}
                icon={
                  <Icon
                    component={MdBarChart}
                    sx={{ width: 32, height: 32, color: brandColor }}
                  />
                }
              />
            }
            name="Tasks Completed"
            value="350"
          />
        </Grid>
        <Grid item xs={6} md={4} lg={2}>
          <MiniStatistics
            startContent={
              <IconBox
                width={56}
                height={56}
                bgcolor={boxBg}
                icon={
                  <Icon
                    component={MdMoney}
                    sx={{ width: 32, height: 32, color: brandColor }}
                  />
                }
              />
            }
            name="Hours Logged"
            value="642"
          />
        </Grid>
        <Grid item xs={6} md={4} lg={2}>
          <MiniStatistics
            startContent={
              <IconBox
                width={56}
                height={56}
                bgcolor={boxBg}
                icon={
                  <Icon
                    component={MdMoney}
                    sx={{ width: 32, height: 32, color: brandColor }}
                  />
                }
              />
            }
            name="Overdue Tasks"
            value="42"
          />
        </Grid>
        <Grid item xs={6} md={4} lg={2}>
          <MiniStatistics
            startContent={
              <IconBox
                width={56}
                height={56}
                bgcolor={boxBg}
                icon={
                  <Icon
                    component={MdAddChart}
                    sx={{ width: 32, height: 32, color: brandColor }}
                  />
                }
              />
            }
            name="Active Projects"
            value="10"
          />
        </Grid>
        <Grid item xs={6} md={4} lg={2}>
          <MiniStatistics
            startContent={
              <IconBox
                width={56}
                height={56}
                bgcolor={boxBg}
                icon={
                  <Icon
                    component={MdAddTask}
                    sx={{ width: 32, height: 32, color: brandColor }}
                  />
                }
              />
            }
            name="New Tasks"
            value="154"
          />
        </Grid>
        <Grid item xs={6} md={4} lg={2}>
          <MiniStatistics
            startContent={
              <IconBox
                width={56}
                height={56}
                bgcolor={boxBg}
                icon={
                  <Icon
                    component={MdFileCopy}
                    sx={{ width: 32, height: 32, color: brandColor }}
                  />
                }
              />
            }
            name="Total Projects"
            value="2935"
          />
        </Grid>
      </Grid>
      {/* <----- Job Status Tracker Section -----> */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12}>
          <Box sx={{ height: '100%' }}>
            <ChatPromptDisplay promptData={validPrompts} />

            {/* <RCBox variant="card"> */}
            {/* <JobStatusTracker tableData={careerTrackerTable} /> */}
            {/* </RCBox> */}
          </Box>
        </Grid>
      </Grid>
      {/* <----- Task Tracker Section -----> */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%' }}>
            <Box paddingTop={{ xs: '130px', md: '80px', xl: '80px' }}>
              <Conversion />
            </Box>
          </Box>
        </Grid>
        {/* <----- Dashboard Calendar Section -----> */}
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%' }}>
            <Box paddingTop={{ xs: '130px', md: '80px', xl: '80px' }}>
              <CalendarComponent />
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* <----- Site Traffic Data Section -----> */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <DailyTraffic data={charts.bar} />
                </Grid>
                <Grid item xs={12}>
                  <PieCard data={charts.pie} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* <----- User Session Data Section -----> */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <h2>Project Structure</h2>
            <RichTreeView
              defaultExpandedItems={['src']}
              slots={{ item: FileTreeWidget }}
              items={DEFAULT_FILE_TREE_DATA}
            />
          </Paper>
        </Grid>
      </Grid>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="User Sessions"
            data={sessionData}
            options={sessionOptions}
            type="LineChart"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="User Distribution"
            data={userData}
            options={userOptions}
            type="PieChart"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

const ChartCard = ({ title, data, options, type }) => (
  <Card>
    <CardContent>
      <Typography variant="h6">{title}</Typography>
      <Chart
        chartType={type}
        width="100%"
        height="400px"
        data={data}
        options={options}
      />
    </CardContent>
  </Card>
);

export default MainDashboard;
