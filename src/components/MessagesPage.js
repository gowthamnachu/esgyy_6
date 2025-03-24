import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, TextField, IconButton, Typography, Paper, Button, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { keyframes } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const MessageContainer = styled(Box)({
  padding: '20px',
  minHeight: '100vh',
  background: 'linear-gradient(45deg, #FFE5EC 0%, #FFF0F5 100%)',
});

const StickyBoard = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: '20px',
  padding: '20px',
  marginBottom: '100px',
});

const StickyNote = styled(Paper)(({ isOwn }) => ({
  padding: '30px 20px 20px 20px', // Added extra top padding for delete button
  backgroundColor: isOwn ? '#E3F2FD' : '#FCE4EC',
  borderRadius: '2px',
  boxShadow: '3px 3px 10px rgba(0,0,0,0.1)',
  position: 'relative',
  transform: 'rotate(-1deg)',
  minHeight: '150px',
  display: 'flex',
  flexDirection: 'column',
  animation: `${fadeIn} 0.5s ease-out`,
  '&:nth-of-type(even)': {
    transform: 'rotate(1deg)',
  },
  '&:nth-of-type(3n)': {
    transform: 'rotate(-2deg)',
  },
  '&:nth-of-type(5n)': {
    transform: 'rotate(2deg)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-12px',
    left: '50%',
    width: '40px',
    height: '12px',
    backgroundColor: isOwn ? '#90CAF9' : '#F48FB1',
    transform: 'translateX(-50%)',
    clipPath: 'polygon(0% 0%, 100% 0%, 85% 100%, 15% 100%)',
  },
  '&:hover': {
    transform: 'scale(1.05) rotate(0deg)',
    zIndex: 2,
  },
  transition: 'all 0.3s ease'
}));

const DeleteButton = styled(IconButton)(({ isOwn }) => ({
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: isOwn ? 'rgba(144, 202, 249, 0.2)' : 'rgba(244, 143, 177, 0.2)',
  color: isOwn ? '#1976D2' : '#D81B60',
  padding: '4px',
  minWidth: '24px',
  height: '24px',
  '&:hover': {
    backgroundColor: isOwn ? 'rgba(144, 202, 249, 0.4)' : 'rgba(244, 143, 177, 0.4)',
    transform: 'scale(1.1)',
  },
  transition: 'all 0.3s ease'
}));

const InputContainer = styled(Box)({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '20px',
  background: 'rgba(255,255,255,0.9)',
  backdropFilter: 'blur(5px)',
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
  boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
  zIndex: 3,
});

const CuteMessageOptions = styled(Box)({
  display: 'flex',
  gap: '10px',
  marginBottom: '10px',
  overflowX: 'auto',
  padding: '10px',
  '&::-webkit-scrollbar': {
    height: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(255, 64, 129, 0.3)',
    borderRadius: '3px',
  }
});

const CuteOption = styled(Button)({
  whiteSpace: 'nowrap',
  borderRadius: '20px',
  padding: '8px 16px',
  minWidth: 'auto',
  backgroundColor: 'rgba(255, 64, 129, 0.1)',
  color: '#ff4081',
  '&:hover': {
    backgroundColor: 'rgba(255, 64, 129, 0.2)',
  }
});

const SeenStatus = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '12px',
  color: 'rgba(0,0,0,0.5)',
});

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [newNoteAlert, setNewNoteAlert] = useState(false);
  const [lastCheckedTime, setLastCheckedTime] = useState(Date.now());
  const navigate = useNavigate();
  const username = localStorage.getItem('user');
  const messagesEndRef = useRef(null);

  const cuteMessages = [
    "I miss you! 💕",
    "You're my everything! 🥰",
    "Thinking of you... 💭",
    "Love you to the moon and back! 🌙",
    "You make me smile! 😊",
    "Can't wait to see you! 🤗",
    "You're my favorite person! ⭐",
    "Forever yours! 💝",
    "You're amazing! ✨",
    "My heart is yours! 💖"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = useCallback(async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/messages`);
      if (response.ok) {
        const data = await response.json();
        const hasNewMessages = data.some(msg => 
          msg.sender !== username && 
          new Date(msg.createdAt).getTime() > lastCheckedTime &&
          !msg.seenBy.includes(username)
        );
        
        if (hasNewMessages) {
          setNewNoteAlert(true);
        }
        
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [username, lastCheckedTime]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: username,
          content: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/messages/${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(messages.filter(msg => msg._id !== messageId));
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleMarkAsSeen = async (messageId) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      await fetch(`${API_URL}/messages/seen/${messageId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as seen:', error);
    }
  };

  const handleAlertClose = () => {
    setNewNoteAlert(false);
    setLastCheckedTime(Date.now());
  };

  const handleCuteMessageSelect = (message) => {
    setNewMessage(message);
  };

  return (
    <MessageContainer>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => navigate('/home')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ color: '#ff4081' }}>
          Love Notes Board 💝
        </Typography>
      </Box>

      <Snackbar
        open={newNoteAlert}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleAlertClose}
          severity="info"
          sx={{ width: '100%', bgcolor: '#FCE4EC' }}
        >
          There is a new love note for you! 💝
        </Alert>
      </Snackbar>

      <StickyBoard>
        {messages.map((message) => (
          <StickyNote
            key={message._id}
            isOwn={message.sender === username}
            elevation={3}
          >
            <DeleteButton
              isOwn={message.sender === username}
              onClick={() => handleDeleteMessage(message._id)}
              size="small"
              aria-label="delete note"
            >
              <DeleteIcon fontSize="small" />
            </DeleteButton>
            <Typography
              variant="body1"
              sx={{
                fontFamily: '"Comic Sans MS", cursive',
                fontSize: '1.1rem',
                flexGrow: 1,
                wordBreak: 'break-word',
                color: message.sender === username ? '#1565C0' : '#C2185B'
              }}
            >
              {message.content}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2,
              pt: 2,
              borderTop: `1px dashed ${message.sender === username ? 'rgba(25, 118, 210, 0.2)' : 'rgba(216, 27, 96, 0.2)'}`
            }}>
              <Typography
                variant="caption"
                sx={{
                  color: message.sender === username ? '#1976D2' : '#D81B60',
                  fontStyle: 'italic'
                }}
              >
                From: {message.sender}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {message.sender !== username && (
                  <IconButton
                    size="small"
                    onClick={() => handleMarkAsSeen(message._id)}
                  >
                    {message.seenBy.includes(username) ? (
                      <VisibilityIcon fontSize="small" sx={{ color: '#4CAF50' }} />
                    ) : (
                      <VisibilityOffIcon fontSize="small" sx={{ color: '#9E9E9E' }} />
                    )}
                  </IconButton>
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: message.sender === username ? '#1976D2' : '#D81B60',
                    fontStyle: 'italic'
                  }}
                >
                  {new Date(message.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
            {message.sender === username && (
              <SeenStatus>
                {message.seenBy.length > 0 ? (
                  <>
                    <VisibilityIcon fontSize="small" sx={{ color: '#4CAF50' }} />
                    <span>Seen</span>
                  </>
                ) : (
                  <>
                    <VisibilityOffIcon fontSize="small" sx={{ color: '#9E9E9E' }} />
                    <span>Not seen yet</span>
                  </>
                )}
              </SeenStatus>
            )}
          </StickyNote>
        ))}
      </StickyBoard>

      <InputContainer>
        <Box sx={{ width: '100%' }}>
          <CuteMessageOptions>
            {cuteMessages.map((message, index) => (
              <CuteOption
                key={index}
                onClick={() => handleCuteMessageSelect(message)}
              >
                {message}
              </CuteOption>
            ))}
          </CuteMessageOptions>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Write your love note..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                backgroundColor: 'white',
              }
            }}
          />
        </Box>
        <IconButton
          onClick={handleSendMessage}
          sx={{
            backgroundColor: '#ff4081',
            color: 'white',
            '&:hover': {
              backgroundColor: '#ff80ab',
            }
          }}
        >
          <SendIcon />
        </IconButton>
      </InputContainer>
    </MessageContainer>
  );
};

export default MessagesPage;
