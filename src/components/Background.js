import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardMedia, Typography, Button, Modal } from '@mui/material';
import { styled } from '@mui/material/styles/index.js';
import axios from 'axios';
import api, { uploadFormData } from '../config/api.js';

const BackgroundContainer = styled(Box)({
  padding: '20px',
  marginTop: '64px',
});

const UploadButton = styled(Button)({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  borderRadius: '50%',
  width: '60px',
  height: '60px',
  minWidth: 'unset',
  background: '#ff4081',
  '&:hover': {
    background: '#f50057',
  },
});

const ModalContent = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '400px',
  background: 'white',
  borderRadius: '15px',
  padding: '20px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
});

const Background = () => {
  const [backgrounds, setBackgrounds] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const currentUser = localStorage.getItem('user');

  useEffect(() => {
    fetchBackgrounds();
  }, []);

  const fetchBackgrounds = async () => {
    try {
      const response = await api.get('/backgrounds');
      setBackgrounds(response.data);
    } catch (error) {
      console.error('Error fetching backgrounds:', error);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('uploader', currentUser);

    try {
      await uploadFormData('/backgrounds', formData);
      setOpen(false);
      setSelectedFile(null);
      await fetchBackgrounds();
    } catch (error) {
      console.error('Error uploading background:', error);
    }
  };

  const setAsActive = async (id) => {
    try {
      await api.patch(`/backgrounds/${id}/activate`);
      await fetchBackgrounds();
    } catch (error) {
      console.error('Error setting background as active:', error);
    }
  };

  return (
    <BackgroundContainer>
      <Grid container spacing={3}>
        {backgrounds.map((background, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="200"
                image={`http://localhost:5000${background.imageUrl}`}
                alt="Background"
                sx={{ objectFit: 'cover' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  p: 1,
                }}
              >
                <Typography variant="caption" sx={{ display: 'block' }}>
                  Uploaded by {background.uploader}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  disabled={background.isActive}
                  onClick={() => setAsActive(background._id)}
                  sx={{
                    mt: 1,
                    bgcolor: background.isActive ? '#4caf50' : '#ff4081',
                    '&:hover': { bgcolor: background.isActive ? '#4caf50' : '#f50057' },
                  }}
                >
                  {background.isActive ? 'Active' : 'Set as Active'}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <UploadButton
        variant="contained"
        onClick={() => setOpen(true)}
      >
        +
      </UploadButton>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Upload Background
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            style={{ marginBottom: '20px' }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleUpload}
            sx={{
              background: '#ff4081',
              '&:hover': { background: '#f50057' },
            }}
          >
            Upload
          </Button>
        </ModalContent>
      </Modal>
    </BackgroundContainer>
  );
};

export default Background;