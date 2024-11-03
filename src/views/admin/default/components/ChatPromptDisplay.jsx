import {
  Avatar,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';

import DEFAULT_MENU_ITEMS from '@/config/data-configs/menu';
import { Card } from 'components/index';
import MainMenu from 'components/themed/CommonUi/menu/MainMenu';
import { useMode } from 'hooks';

// ==============================|| CHAT PROMPT DISPLAY ||============================== //

const ChatPromptDisplay = ({ promptData }) => {
  const columns = useMemo(
    () => [
      { Header: 'Name', accessor: 'name' },
      { Header: 'Content', accessor: 'content' },
      { Header: 'Role', accessor: 'role' },
      { Header: 'Type', accessor: 'type' },
      { Header: 'Rating', accessor: 'rating' },
      { Header: 'Tags', accessor: 'tags' },
    ],
    []
  );

  const data = useMemo(() => promptData, [promptData]);

  const tableInstance = useTable(
    { columns, data },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState,
  } = tableInstance;
  initialState.pageSize = 10;

  const { theme } = useMode();
  const textColor = '#1B2559';
  const borderColor = '#cdd5df';

  const renderCellData = cell => {
    const { Header } = cell.column;
    const value = cell.value;

    if (Header === 'Tags') {
      return value.join(', ');
    } else {
      return value;
    }
  };

  return (
    <Card
      mode="dark"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(4),
        width: '100%',
        overflowX: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingX: '25px',
          marginBottom: '20px',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: '#1B2559',
            fontWeight: 700,
            lineHeight: '100%',
          }}
        >
          Chat Prompt Display
        </Typography>
        <MainMenu items={DEFAULT_MENU_ITEMS} />
      </Box>
      <TableContainer component={Paper}>
        <Table {...getTableProps()} aria-label="chat prompt table">
          <TableHead>
            {headerGroups.map((headerGroup, index) => (
              <TableRow {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <TableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={index}
                    style={{
                      borderColor: borderColor,
                      padding: '8px',
                      textAlign: 'left',
                      width: `${100 / headerGroup.headers.length}%`,
                    }}
                  >
                    {column.render('Header')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()} key={rowIndex}>
                  {row.cells.map((cell, cellIndex) => (
                    <TableCell
                      {...cell.getCellProps()}
                      key={cellIndex}
                      sx={{
                        borderColor: 'transparent',
                        padding: '8px',
                        textAlign: 'left',
                        width: `${100 / headerGroups[0].headers.length}%`,
                      }}
                    >
                      {renderCellData(cell)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

ChatPromptDisplay.propTypes = {
  promptData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
};

export default ChatPromptDisplay;
