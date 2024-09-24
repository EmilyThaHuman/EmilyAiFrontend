import { Box, Typography, IconButton } from '@mui/material';

const SidebarContentHeader = ({ space = '', onSave, icon }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={2}
    >
      <Typography
        sx={{
          ml: 3,
          flex: 1,
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: '#fff',
        }}
        variant="h4"
        fontWeight="bold"
      >
        {space}
      </Typography>

      <IconButton onClick={onSave}>{icon}</IconButton>
    </Box>
  );
};

export default SidebarContentHeader;
