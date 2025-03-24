import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.js';
import Home from './components/Home.js';
import BackgroundPage from './components/BackgroundPage.js';
import MessagesPage from './components/MessagesPage.js';
import MemoriesPage from './components/MemoriesPage.js';
import './App.css';

const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  const validCredentials = {
    'gow': 'loveher',
    'snig': 'lovehim'
  };
  
  // Check if user exists in valid credentials list
  const isValidUser = user && Object.keys(validCredentials).includes(user);
  return isValidUser ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/background"
          element={
            <PrivateRoute>
              <BackgroundPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <PrivateRoute>
              <MessagesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/memories"
          element={
            <PrivateRoute>
              <MemoriesPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;