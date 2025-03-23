import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardMedia, CardContent, Typography, Button, Modal, TextField } from '@mui/material';
import { styled } from '@mui/material/styles/index.js';
import { makeStyles } from '@mui/material/styles/index.js';
import { createTheme, ThemeProvider } from '@mui/material/styles/index.js';
import { responsiveFontSizes } from '@mui/material/styles/index.js';
import axios from 'axios';
import api, { uploadFormData } from '../config/api.js';

const MemoriesContainer = styled(Box)({
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

const Memories = () => {
  const [memories, setMemories] = useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const currentUser = localStorage.getItem('user');

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const response = await api.get('/memories');
      const sortedMemories = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setMemories(sortedMemories);
    } catch (error) {
      console.error('Error fetching memories:', error);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title) return;

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('uploader', currentUser);
    formData.append('title', title);
    formData.append('description', description || '');

    try {
      await uploadFormData('/memories', formData);
      setOpen(false);
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      await fetchMemories();
    } catch (error) {
      console.error('Error uploading memory:', error);
    }
  };

  return (
    <MemoriesContainer>
      <Grid container spacing={3}>
        {memories.map((memory, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={`http://localhost:5000${memory.imageUrl}`}
                alt={memory.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {memory.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {memory.description}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Uploaded by {memory.uploader} on {new Date(memory.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
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
            Upload Memory
          </Typography>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
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
    </MemoriesContainer>
  );
};

export default Memories;