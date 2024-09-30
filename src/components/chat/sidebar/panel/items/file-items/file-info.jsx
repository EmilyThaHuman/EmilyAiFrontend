import { Box } from '@mui/material';
import { StyledButton, StyledTextField } from 'components/chat/styled';
import { TextFieldSection } from 'components/themed';

export const FileInfo = ({ fileDescription, setFileDescription }) => (
  <Box
  // sx={{
  //   display: 'flex',
  //   flexDirection: 'column',
  //   width: '100%',
  //   padding: '1rem',
  //   // justifyContent: 'space-between',
  // }}
  >
    <div style={{ marginBottom: '16px' }}>
      <TextFieldSection
        label="File Description"
        value={fileDescription}
        onChange={e => setFileDescription(e.target.value)}
        variant="darkMode"
        placeholder="File description..."
        fullWidth
      />
    </div>
    <StyledButton variant="outlined" component="label">
      Choose File <input type="file" hidden />
    </StyledButton>
  </Box>
);

export default FileInfo;
