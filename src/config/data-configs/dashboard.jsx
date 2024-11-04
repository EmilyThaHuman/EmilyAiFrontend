import { MdAddTask } from 'react-icons/md';

export const DEFAULT_BAR_CHART_CONFIG = {
  data: [
    {
      name: 'Daily Traffic',
      data: [20, 30, 40, 20, 45, 50, 30],
    },
  ],
  options: {
    chart: {
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
        fontFamily: undefined,
      },
      onDatasetHover: {
        style: {
          fontSize: '12px',
          fontFamily: undefined,
        },
      },
      theme: 'dark',
    },
    xaxis: {
      categories: ['00', '04', '08', '12', '14', '16', '18'],
      show: false,
      labels: {
        show: true,
        colors: '#A3AED0',
        fontSize: '14px',
        fontWeight: '500',
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      color: 'black',
      labels: {
        colors: '#CBD5E0',
      },
    },
    grid: {
      strokeDashArray: 5,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        type: 'vertical',
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        colorStops: [
          {
            offset: 0,
            color: '#129370',
            opacity: 1,
          },
          {
            offset: 100,
            color: 'rgba(67, 24, 255, 1)',
            opacity: 0.28,
          },
        ],
      },
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: '40px',
      },
    },
  },
};

export const DEFAULT_PIE_CHART_CONFIG = {
  data: [63, 25, 12],
  options: {
    labels: ['Your files', 'System', 'Empty'],
    colors: ['#129370', '#6AD2FF', '#EFF4FB'],
    states: {
      hover: {
        filter: {
          type: 'none',
        },
      },
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
    },
  },
};

export const DEFAULT_TABLE_DATA = {};

export const DEFAULT_FILE_TREE_DATA = [
  {
    id: 'workspaces',
    label: 'src',
    children: [
      { id: 'components', label: 'components' },
      { id: 'pages', label: 'pages' },
      { id: 'utils', label: 'utils' },
    ],
  },
  {
    id: 'public',
    label: 'public',
    children: [
      { id: 'images', label: 'images' },
      { id: 'fonts', label: 'fonts' },
    ],
  },
  { id: 'package.json', label: 'package.json' },
  { id: 'README.md', label: 'README.md' },
];

export const MINI_STATS_DATA = {
  interviewsEarned: {
    name: 'Interviews Earned',
    value: 10,
    icon: <MdAddTask />,
  },
  responsesBack: { name: 'Responses Back', value: 15, icon: <MdAddTask /> },
  rejectionRatio: {
    name: 'Rejection Ratio',
    value: '3:1',
    icon: <MdAddTask />,
  },
  jobsAppliedThisWeek: {
    name: 'Jobs Applied This Week',
    value: 7,
    icon: <MdAddTask />,
  },
  followUpsSent: { name: 'Follow-ups Sent', value: 5, icon: <MdAddTask /> },
};
export const DASHBOARD_CONFIGS = {
  data: {
    tree: DEFAULT_FILE_TREE_DATA,
  },
  charts: {
    bar: DEFAULT_BAR_CHART_CONFIG,
    pie: DEFAULT_PIE_CHART_CONFIG,
  },
  tables: {
    default: DEFAULT_TABLE_DATA,
  },
};
