import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, ImageList, ImageListItem, IconButton, Button } from '@mui/material';
import { styled } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import background1 from '../assets/background1.jpg';
import background2 from '../assets/background.jpg';

const UploadInput = styled('input')({ display: 'none' });

const BackgroundThumbnail = styled(Box)({
  position: 'relative',
  '&:hover .actions': {
    opacity: 1,
  },
});

const ThumbnailActions = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0, 0, 0, 0.5)',
  opacity: 0,
  transition: 'opacity 0.3s ease',
});

const BackgroundPage = () => {
  const [backgrounds, setBackgrounds] = useState([]);
  const navigate = useNavigate();

  const ws = useRef(null);

  useEffect(() => {
    fetchBackgrounds();

    // Initialize WebSocket connection
    ws.current = new WebSocket('ws://localhost:5000');

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'background_update') {
        fetchBackgrounds();
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const fetchBackgrounds = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/backgrounds`);
      if (response.ok) {
        const data = await response.json();
        const allBackgrounds = [
          { id: 'preset1', type: 'preset', url: background1 },
          { id: 'preset2', type: 'preset', url: background2 },
          ...data.map(bg => ({
            id: bg._id,
            type: bg.backgroundType,
            url: bg.backgroundValue.data // Update to use the base64 data
          }))
        ];
        setBackgrounds(allBackgrounds);
      }
    } catch (error) {
      console.error('Error fetching backgrounds:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('backgroundImage', file);
    formData.append('backgroundType', 'custom');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/background`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        await fetchBackgrounds();
        // Force background refresh in Home component
        window.dispatchEvent(new CustomEvent('backgroundsUpdated'));
      }
    } catch (error) {
      console.error('Error uploading background:', error);
    }
  };

  const handleDelete = async (backgroundId) => {
    if (backgroundId.startsWith('preset')) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/background/${backgroundId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setBackgrounds(prev => prev.filter(bg => bg.id !== backgroundId));
        // Force background refresh in Home component
        window.dispatchEvent(new CustomEvent('backgroundsUpdated'));
      }
    } catch (error) {
      console.error('Error deleting background:', error);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', margin: '0 auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate('/home')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ color: '#ff4081', flexGrow: 1 }}>
          Background Management
        </Typography>
        <label htmlFor="background-upload">
          <UploadInput
            accept="image/*"
            id="background-upload"
            type="file"
            onChange={handleFileUpload}
          />
          <Button
            component="span"
            startIcon={<AddPhotoAlternateIcon />}
            variant="contained"
            sx={{
              backgroundColor: '#ff4081',
              '&:hover': { backgroundColor: '#ff80ab' }
            }}
          >
            Add New Background
          </Button>
        </label>
      </Box>

      <ImageList cols={3} gap={24}>
        {backgrounds.map((background) => (
          <ImageListItem key={background.id}>
            <BackgroundThumbnail>
              <img
                src={background.url}
                alt="Background"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB...'; // Add fallback image
                }}
                style={{ 
                  width: '100%', 
                  height: '200px', 
                  objectFit: 'cover', 
                  borderRadius: '8px' 
                }}
              />
              <ThumbnailActions className="actions">
                {background.type !== 'preset' && (
                  <IconButton
                    onClick={() => handleDelete(background.id)}
                    sx={{ color: 'white' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </ThumbnailActions>
            </BackgroundThumbnail>
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default BackgroundPage;