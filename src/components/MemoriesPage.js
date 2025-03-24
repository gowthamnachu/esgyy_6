import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, IconButton,
  Dialog, DialogTitle, DialogContent, TextField, Button,
  Grid, Fade
} from '@mui/material';
import { styled } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Fixed import path
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const MemoryCard = styled(Card)(({ sender }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  borderRadius: '15px',
  overflow: 'hidden',
  boxShadow: sender === 'gow' 
    ? '0 8px 20px rgba(25, 118, 210, 0.2)'
    : '0 8px 20px rgba(255, 64, 129, 0.2)',
  background: sender === 'gow'
    ? 'rgba(227, 242, 253, 0.9)'
    : 'rgba(252, 228, 236, 0.9)',
  backdropFilter: 'blur(5px)',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: sender === 'gow'
      ? '0 12px 30px rgba(25, 118, 210, 0.3)'
      : '0 12px 30px rgba(255, 64, 129, 0.3)',
  }
}));

const StyledCardMedia = styled(Box)({
  position: 'relative',
  height: '250px',
  overflow: 'hidden',
  '&:hover .navigation-arrows': {
    opacity: 1,
  }
});

const ImageNavButton = styled(IconButton)(({ direction }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  [direction]: 8,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  color: '#666',
  zIndex: 2,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  }
}));

const NavigationArrows = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  className: 'navigation-arrows'
});

const MemoryContent = styled(CardContent)(({ sender }) => ({
  position: 'relative',
  padding: '20px',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  borderTop: sender === 'gow'
    ? '2px solid rgba(25, 118, 210, 0.2)'
    : '2px solid rgba(255, 64, 129, 0.2)',
  '&:last-child': {
    paddingBottom: '20px',
  }
}));

const MemoryTitle = styled(Typography)(({ sender }) => ({
  fontWeight: 600,
  fontSize: '1.2rem',
  color: sender === 'gow' ? '#1565C0' : '#C2185B',
  marginBottom: '4px',
  fontFamily: "'Dancing Script', cursive",
}));

const MemoryDescription = styled(Typography)({
  color: '#666',
  fontSize: '0.95rem',
  flexGrow: 1,
  overflow: 'hidden',
  display: '-webkit-box',
  '-webkit-line-clamp': 3,
  '-webkit-box-orient': 'vertical',
});

const MemoryDate = styled(Typography)(({ sender }) => ({
  color: sender === 'gow' ? '#1976D2' : '#D81B60',
  fontSize: '0.85rem',
  fontStyle: 'italic',
  marginTop: 'auto',
}));

const AddMemoryButton = styled(Button)({
  position: 'fixed',
  bottom: '2rem',
  right: '2rem',
  borderRadius: '50%',
  width: '60px',
  height: '60px',
  minWidth: '60px',
  backgroundColor: '#ff4081',
  '&:hover': {
    backgroundColor: '#ff80ab',
  }
});

const MemoriesPage = () => {
  const [memories, setMemories] = useState([]);
  const [open, setOpen] = useState(false);
  const [newMemory, setNewMemory] = useState({
    title: '',
    description: '',
    date: '',
    image: null
  });
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/memories`);
      if (response.ok) {
        const data = await response.json();
        setMemories(data);
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
    }
  };

  const handleAddMemory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newMemory.title);
    formData.append('description', newMemory.description);
    formData.append('date', newMemory.date);
    formData.append('sender', localStorage.getItem('user')); // Add sender

    // Handle multiple images
    if (newMemory.image) {
      Array.from(newMemory.image).forEach(file => {
        formData.append('images', file);
      });
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/memories`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setOpen(false);
        setNewMemory({ title: '', description: '', date: '', image: null });
        fetchMemories();
      }
    } catch (error) {
      console.error('Error adding memory:', error);
    }
  };

  const handleDelete = async (memoryId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/memories/${memoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Update the local state immediately after successful deletion
        setMemories(prevMemories => prevMemories.filter(memory => memory._id !== memoryId));
      } else {
        console.error('Failed to delete memory:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  };

  const handleImageNavigation = (memoryId, direction) => {
    setCurrentImageIndexes(prev => {
      const currentIndex = prev[memoryId] || 0;
      const imagesLength = memories.find(memory => memory._id === memoryId).images?.length || 1;
      const newIndex = direction === 'next' 
        ? (currentIndex + 1) % imagesLength
        : (currentIndex - 1 + imagesLength) % imagesLength;
      return { ...prev, [memoryId]: newIndex };
    });
  };

  return (
    <Box sx={{ p: 4, background: 'linear-gradient(45deg, #FFE5EC 0%, #FFF0F5 100%)', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate('/home')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ color: '#ff4081' }}>
          Our Beautiful Memories 💝
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {memories.map((memory) => (
          <Grid item xs={12} sm={6} md={4} key={memory._id}>
            <Fade in timeout={500}>
              <MemoryCard sender={memory.sender}>
                <StyledCardMedia>
                  <Box
                    component="img"
                    src={`http://localhost:5000/uploads/${memory.images[currentImageIndexes[memory._id] || 0]}`}
                    alt={memory.title}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      }
                    }}
                  />
                  {memory.images?.length > 1 && (
                    <NavigationArrows>
                      <ImageNavButton
                        direction="left"
                        onClick={() => handleImageNavigation(memory._id, 'prev')}
                      >
                        <ChevronLeftIcon />
                      </ImageNavButton>
                      <ImageNavButton
                        direction="right"
                        onClick={() => handleImageNavigation(memory._id, 'next')}
                      >
                        <ChevronRightIcon />
                      </ImageNavButton>
                    </NavigationArrows>
                  )}
                </StyledCardMedia>
                <MemoryContent sender={memory.sender}>
                  <IconButton
                    onClick={() => handleDelete(memory._id)}
                    sx={{
                      position: 'absolute',
                      top: -20,
                      right: 8,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      width: 40,
                      height: 40,
                      '&:hover': {
                        backgroundColor: memory.sender === 'gow'
                          ? 'rgba(25, 118, 210, 0.1)'
                          : 'rgba(255, 64, 129, 0.1)',
                      }
                    }}
                  >
                    <DeleteIcon 
                      sx={{ 
                        color: memory.sender === 'gow' ? '#1976D2' : '#D81B60' 
                      }} 
                      fontSize="small" 
                    />
                  </IconButton>
                  <MemoryTitle variant="h6" sender={memory.sender}>
                    {memory.title}
                  </MemoryTitle>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    mt: 1
                  }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: memory.sender === 'gow' ? '#1976D2' : '#D81B60',
                        fontWeight: 500
                      }}
                    >
                      Posted by: {memory.sender === 'gow' ? 'Gow' : 'Snig'}
                    </Typography>
                  </Box>
                  <MemoryDescription>
                    {memory.description}
                  </MemoryDescription>
                  <MemoryDate sender={memory.sender}>
                    {new Date(memory.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </MemoryDate>
                </MemoryContent>
              </MemoryCard>
            </Fade>
          </Grid>
        ))}
      </Grid>

      <AddMemoryButton onClick={() => setOpen(true)}>
        <AddIcon />
      </AddMemoryButton>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Memory</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleAddMemory} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              margin="normal"
              value={newMemory.title}
              onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
            />
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={4}
              value={newMemory.description}
              onChange={(e) => setNewMemory({ ...newMemory, description: e.target.value })}
            />
            <TextField
              fullWidth
              type="date"
              margin="normal"
              value={newMemory.date}
              onChange={(e) => setNewMemory({ ...newMemory, date: e.target.value })}
            />
            <input
              accept="image/*"
              type="file"
              multiple
              onChange={(e) => setNewMemory({ ...newMemory, image: e.target.files })}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 2, bgcolor: '#ff4081', '&:hover': { bgcolor: '#ff80ab' } }}
            >
              Add Memory
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MemoriesPage;
