import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { styled } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import ChatIcon from '@mui/icons-material/Chat';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { useNavigate } from 'react-router-dom';

const SidebarContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  left: 0,
  top: 0,
  height: '100vh',
  width: '250px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(5px)',
  boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1000,
  transition: 'transform 0.3s ease-in-out',
  transform: 'translateX(0)',
  '&.closed': {
    transform: 'translateX(-250px)',
  }
}));

const SidebarHeader = styled(Box)({
  textAlign: 'center',
  marginBottom: '20px',
});

const StyledListItem = styled(ListItem)({
  borderRadius: '8px',
  marginBottom: '8px',
  '&:hover': {
    backgroundColor: 'rgba(255, 64, 129, 0.1)',
  }
});

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  return (
    <SidebarContainer className={!isOpen ? 'closed' : ''}>
      <SidebarHeader>
        <FavoriteIcon sx={{ fontSize: 40, color: '#ff4081', marginBottom: 1 }} />
        <Typography variant="h6" sx={{ color: '#ff4081', fontWeight: 'bold' }}>
          Our Love Journey
        </Typography>
      </SidebarHeader>
      
      <Divider sx={{ marginBottom: 2 }} />
      
      <List>
        <StyledListItem button onClick={() => navigate('/background')}>
          <ListItemIcon>
            <WallpaperIcon sx={{ color: '#ff4081' }} />
          </ListItemIcon>
          <ListItemText primary="Background Manager" />
        </StyledListItem>
        
        <StyledListItem button onClick={() => navigate('/messages')}>
          <ListItemIcon>
            <ChatIcon sx={{ color: '#ff4081' }} />
          </ListItemIcon>
          <ListItemText primary="Love Notes" />
        </StyledListItem>

        <StyledListItem button onClick={() => navigate('/memories')}>
          <ListItemIcon>
            <PhotoLibraryIcon sx={{ color: '#ff4081' }} />
          </ListItemIcon>
          <ListItemText primary="Our Memories" />
        </StyledListItem>
      </List>
      
      <Box sx={{ flexGrow: 1 }} />
      
      <Typography variant="body2" sx={{ textAlign: 'center', color: '#666', mt: 2 }}>
        Forever & Always ❤️
      </Typography>
    </SidebarContainer>
  );
};

export default Sidebar;