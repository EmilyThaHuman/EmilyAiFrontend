import { InputAdornment, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { FaSearch } from 'react-icons/fa';

export const SearchField = ({ value, onChange }) => (
  <TextField
    fullWidth
    variant="outlined"
    placeholder="Search files"
    value={value}
    onChange={onChange}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <FaSearch />
        </InputAdornment>
      ),
    }}
    sx={{ mb: 2 }}
  />
);

SearchField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SearchField;
