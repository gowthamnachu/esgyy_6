import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Typography, Button } from '@mui/material';
import { styled } from '@mui/material';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import background1 from '../assets/background1.jpg';
import background from '../assets/background.jpg';

const FloatingButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: 20,
  right: 20,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)'
  }
}));

const UploadInput = styled('input')({display: 'none'});

const BackgroundSelector = ({ onBackgroundChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePresetSelect = async (backgroundValue) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/background`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          backgroundType: 'preset',
          backgroundValue: backgroundValue.toString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        onBackgroundChange && onBackgroundChange({
          backgroundType: 'preset',
          backgroundValue: backgroundValue
        });
      }
    } catch (error) {
      console.error('Error updating background:', error);
    }
    handleClose();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('backgroundImage', file);
    formData.append('backgroundType', 'custom');
    formData.append('backgroundValue', file.name);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/background`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        onBackgroundChange && onBackgroundChange({
          backgroundType: 'custom',
          backgroundValue: `${process.env.REACT_APP_API_URL}/uploads/${data.backgroundValue}`
        });
      }
    } catch (error) {
      console.error('Error uploading background:', error);
    }
    handleClose();
  };

  return (
    <>
      <FloatingButton
        onClick={handleClick}
        size="large"
        aria-controls={open ? 'background-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <WallpaperIcon />
      </FloatingButton>
      <Menu
        id="background-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => handlePresetSelect(background1)}>
          <Typography>Preset Background 1</Typography>
        </MenuItem>
        <MenuItem onClick={() => handlePresetSelect(background)}>
          <Typography>Preset Background 2</Typography>
        </MenuItem>
        <MenuItem>
          <label htmlFor="background-upload">
            <UploadInput
              accept="image/*"
              id="background-upload"
              type="file"
              onChange={handleFileUpload}
            />
            <Button component="span">
              Upload Custom Background
            </Button>
          </label>
        </MenuItem>
      </Menu>
    </>
  );
};

export default BackgroundSelector;