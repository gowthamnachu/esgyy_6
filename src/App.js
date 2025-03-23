import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.js';
import Home from './components/Home.js';
import Header from './components/Header.js';
import Messages from './components/Messages.js';
import Memories from './components/Memories.js';
import Background from './components/Background.js';
import './App.css';

function App() {
  const [showMessages, setShowMessages] = useState(false);
  const [showMemories, setShowMemories] = useState(false);
  const [showBackground, setShowBackground] = useState(false);

  const handleMessagesClick = () => {
    setShowMessages(true);
    setShowMemories(false);
    setShowBackground(false);
  };

  const handleMemoriesClick = () => {
    setShowMessages(false);
    setShowMemories(true);
    setShowBackground(false);
  };

  const handleBackgroundClick = () => {
    setShowMessages(false);
    setShowMemories(false);
    setShowBackground(true);
  };

  const ProtectedRoute = ({ children }) => {
    const user = localStorage.getItem('user');
    if (!user) return <Navigate to="/login" />;
    return (
      <>
        <Header
          onMessagesClick={handleMessagesClick}
          onMemoriesClick={handleMemoriesClick}
          onBackgroundClick={handleBackgroundClick}
        />
        {showMessages && <Messages />}
        {showMemories && <Memories />}
        {showBackground && <Background />}
        {!showMessages && !showMemories && !showBackground && children}
      </>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
