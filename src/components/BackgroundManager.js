import React, { useState, useEffect } from 'react';
import { Box, Typography, ImageList, ImageListItem, IconButton, Button } from '@mui/material';
import { styled } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
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

const BackgroundManager = () => {
  const [backgrounds, setBackgrounds] = useState([]);

  useEffect(() => {
    fetchBackgrounds();
  }, []);

  const fetchBackgrounds = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/backgrounds');
      if (response.ok) {
        const data = await response.json();
        const allBackgrounds = [
          { id: 'preset1', type: 'preset', url: background1 },
          { id: 'preset2', type: 'preset', url: background2 },
          ...data.filter(bg => bg.backgroundType === 'custom')
            .map(bg => ({
              id: bg._id,
              type: 'custom',
              url: `http://localhost:5000/uploads/${bg.backgroundValue}`
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
      const response = await fetch('http://localhost:5000/api/background', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        fetchBackgrounds();
      }
    } catch (error) {
      console.error('Error uploading background:', error);
    }
  };

  const handleDelete = async (backgroundId) => {
    if (backgroundId.startsWith('preset')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/background/${backgroundId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchBackgrounds();
      }
    } catch (error) {
      console.error('Error deleting background:', error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ color: '#ff4081' }}>
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
            Add New
          </Button>
        </label>
      </Box>

      <ImageList cols={3} gap={16}>
        {backgrounds.map((background) => (
          <ImageListItem key={background.id}>
            <BackgroundThumbnail>
              <img
                src={background.url}
                alt="Background"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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

export default BackgroundManager;