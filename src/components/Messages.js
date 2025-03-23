import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  IconButton 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { 
  styled,
  makeStyles,
  createTheme, 
  ThemeProvider 
} from '@mui/material/styles/index.js';
import api from '../config/api.js';

const MessageContainer = styled(Box)({
  padding: '20px',
  height: 'calc(100vh - 64px)',
  marginTop: '64px',
  display: 'flex',
  flexDirection: 'column',
});

const MessagesBox = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
});

const MessageNote = styled(Paper)(({ isCurrentUser }) => ({
  padding: '15px',
  maxWidth: '70%',
  alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
  background: isCurrentUser ? '#e3f2fd' : '#fce4ec',
  borderRadius: '15px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '20px',
    height: '20px',
    background: 'inherit',
    bottom: '-10px',
    transform: 'rotate(45deg)',
    left: isCurrentUser ? 'auto' : '20px',
    right: isCurrentUser ? '20px' : 'auto',
  },
  boxShadow: '3px 3px 15px rgba(0,0,0,0.1)',
}));

const InputContainer = styled(Box)({
  display: 'flex',
  gap: '10px',
  padding: '20px',
  background: 'white',
  borderTop: '1px solid rgba(0,0,0,0.1)',
});

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const currentUser = localStorage.getItem('user');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/messages');
      const sortedMessages = response.data.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      await api.post('/messages', {
        sender: currentUser,
        content: newMessage.trim(),
        createdAt: new Date()
      });
      setNewMessage('');
      await fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <MessageContainer>
      <MessagesBox>
        {messages.map((message, index) => (
          <MessageNote
            key={index}
            isCurrentUser={message.sender === currentUser}
            elevation={3}
          >
            <Typography variant="body1" sx={{ color: '#333' }}>
              {message.content}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#666',
                display: 'block',
                textAlign: message.sender === currentUser ? 'right' : 'left',
                mt: 1
              }}
            >
              {new Date(message.createdAt).toLocaleString()}
            </Typography>
          </MessageNote>
        ))}
      </MessagesBox>
      <InputContainer>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <IconButton
          onClick={handleSend}
          sx={{
            background: '#ff4081',
            color: 'white',
            '&:hover': { background: '#f50057' },
          }}
        >
          <SendIcon />
        </IconButton>
      </InputContainer>
    </MessageContainer>
  );
};

export default Messages;