import React from 'react';
import { AppBar, Typography, Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles/index.js';
import { makeStyles } from '@mui/material/styles/index.js';
import { createTheme, ThemeProvider } from '@mui/material/styles/index.js';
import MessageIcon from '@mui/icons-material/Message';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import WallpaperIcon from '@mui/icons-material/Wallpaper';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1100,
  padding: '10px 0',
}));

const ProjectTitle = styled(Typography)({
  fontFamily: '"Dancing Script", cursive',
  color: '#ff4081',
  fontSize: '2rem',
  flexGrow: 1,
  textAlign: 'center',
});

const IconContainer = styled(Box)({
  display: 'flex',
  gap: '15px',
  marginRight: '20px',
});

const StyledIconButton = styled(IconButton)({
  color: '#ff4081',
  '&:hover': {
    transform: 'scale(1.1)',
    transition: 'transform 0.2s',
  },
});

const Header = ({ onMessagesClick, onMemoriesClick, onBackgroundClick }) => {
  return (
    <StyledAppBar>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 3 }}>
        <ProjectTitle>esgyy_6</ProjectTitle>
        <IconContainer>
          <StyledIconButton onClick={onMessagesClick}>
            <MessageIcon />
          </StyledIconButton>
          <StyledIconButton onClick={onMemoriesClick}>
            <PhotoLibraryIcon />
          </StyledIconButton>
          <StyledIconButton onClick={onBackgroundClick}>
            <WallpaperIcon />
          </StyledIconButton>
        </IconContainer>
      </Box>
    </StyledAppBar>
  );
};

export default Header;