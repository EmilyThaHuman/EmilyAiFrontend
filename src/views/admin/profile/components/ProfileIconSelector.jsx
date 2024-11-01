import {
  Box,
  Typography,
  Grid,
  IconButton,
  Paper,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/system';
import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

import { reedThaHumansIconLibrary } from '../../../../assets/humanIcons/index';

const icons = Object.keys(reedThaHumansIconLibrary).map((key, index) => ({
  id: index + 1,
  name: key,
  Component: reedThaHumansIconLibrary[key],
}));

const colorThemes = {
  default: { primary: '#000000', secondary: '#666666', background: '#ffffff' },
  cool: { primary: '#4287f5', secondary: '#42c5f5', background: '#e6f3ff' },
  warm: { primary: '#f54242', secondary: '#f59642', background: '#fff2e6' },
  nature: { primary: '#42f554', secondary: '#42f5c5', background: '#e6fff2' },
  royal: { primary: '#9642f5', secondary: '#c542f5', background: '#f2e6ff' },
};

const StyledIconButton = styled(IconButton)(({ theme, selected }) => ({
  border: selected
    ? `2px solid ${theme.palette.primary.main}`
    : '1px solid #ccc',
  borderRadius: '8px',
  padding: '8px',
  transition: 'all 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[2],
  },
}));

const StyledIconContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  justifyContent: 'flex-start',
  maxHeight: '400px',
  overflowY: 'auto',
  padding: '10px',
});

const StyledPreviewContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  height: '100%',
  backgroundColor: theme.palette.background.default,
}));

const ColorPickerContainer = styled(Box)({
  marginTop: '20px',
  padding: '15px',
  borderRadius: '8px',
  backgroundColor: '#f5f5f5',
});

export const ProfileIconSelector = () => {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [customColors, setCustomColors] = useState({
    primary: '#000000',
    secondary: '#666666',
    background: '#ffffff',
  });
  const [scale, setScale] = useState(1);

  const handleIconClick = icon => {
    setSelectedIcon(icon);
  };

  const handleThemeChange = event => {
    const theme = event.target.value;
    setSelectedTheme(theme);
    setCustomColors(colorThemes[theme]);
  };

  const handleColorChange = (color, type) => {
    setCustomColors(prev => ({
      ...prev,
      [type]: color,
    }));
  };

  const handleScaleChange = (event, newValue) => {
    setScale(newValue);
  };

  const renderIcon = (IconComponent, size = 40) => (
    <IconComponent
      style={{
        width: size * scale,
        height: size * scale,
        color: customColors.primary,
        fill: customColors.secondary,
        backgroundColor: customColors.background,
      }}
    />
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Customize Your Profile Icon
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <StyledIconContainer>
            {icons.map(icon => (
              <StyledIconButton
                key={icon.id}
                onClick={() => handleIconClick(icon)}
                selected={selectedIcon?.id === icon.id}
                aria-label={`Select ${icon.name}`}
                aria-pressed={selectedIcon?.id === icon.id}
              >
                {renderIcon(icon.Component)}
              </StyledIconButton>
            ))}
          </StyledIconContainer>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPreviewContainer elevation={3}>
            {selectedIcon ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Selected Icon:
                </Typography>
                {renderIcon(selectedIcon.Component, 150)}
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {selectedIcon.name}
                </Typography>

                <ColorPickerContainer>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Color Theme</InputLabel>
                    <Select
                      value={selectedTheme}
                      onChange={handleThemeChange}
                      label="Color Theme"
                    >
                      {Object.keys(colorThemes).map(theme => (
                        <MenuItem key={theme} value={theme}>
                          {theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Typography gutterBottom>Primary Color</Typography>
                  <HexColorPicker
                    color={customColors.primary}
                    onChange={color => handleColorChange(color, 'primary')}
                  />

                  <Typography gutterBottom sx={{ mt: 2 }}>
                    Secondary Color
                  </Typography>
                  <HexColorPicker
                    color={customColors.secondary}
                    onChange={color => handleColorChange(color, 'secondary')}
                  />

                  <Typography gutterBottom sx={{ mt: 2 }}>
                    Background Color
                  </Typography>
                  <HexColorPicker
                    color={customColors.background}
                    onChange={color => handleColorChange(color, 'background')}
                  />

                  <Typography gutterBottom sx={{ mt: 2 }}>
                    Icon Scale
                  </Typography>
                  <Slider
                    value={scale}
                    onChange={handleScaleChange}
                    min={0.5}
                    max={1.5}
                    step={0.1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </ColorPickerContainer>
              </>
            ) : (
              <Typography variant="body1">
                No icon selected. Please choose an icon from the left.
              </Typography>
            )}
          </StyledPreviewContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileIconSelector;
