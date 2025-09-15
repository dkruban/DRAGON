import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import Dashboard from './Dashboard';

function App() {
  const { currentUser } = useAuth();

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={currentUser ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={currentUser ? <Navigate to="/dashboard" /> : <Signup />} />
        <Route path="/dashboard" element={currentUser ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
