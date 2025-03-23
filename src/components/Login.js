import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 400,
  margin: '100px auto',
  textAlign: 'center',
  background: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '15px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const HeartIcon = styled(FavoriteIcon)({
  color: '#ff4081',
  fontSize: 40,
  marginBottom: 20,
  animation: 'pulse 1.5s infinite',
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.2)' },
    '100%': { transform: 'scale(1)' },
  },
});

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validCredentials = {
    'gow': 'loveher',
    'snig': 'lovehim'
  };

  const handleLogin = () => {
    if (validCredentials[username] === password) {
      localStorage.setItem('user', username);
      navigate('/home');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #FF9A9E 0%, #FAD0C4 99%, #FAD0C4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <StyledPaper elevation={3}>
        <HeartIcon />
        <Typography variant="h4" gutterBottom sx={{ color: '#ff4081', fontWeight: 'bold' }}>
          Love Login
        </Typography>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!error}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
          />
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              background: 'linear-gradient(45deg, #FF4081 30%, #FF80AB 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF80AB 30%, #FF4081 90%)',
              },
            }}
            onClick={handleLogin}
          >
            Login with Love
          </Button>
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default Login;