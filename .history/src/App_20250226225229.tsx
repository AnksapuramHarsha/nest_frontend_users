import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import UserList from './components/UserList';
import Register from './pages/Register';

function App() {
  const { accessToken } = useAuth();

  return (
    
      <Router>
        {/* Render Navbar only if accessToken exists (user is logged in) */}
        {accessToken && <Navbar />}
        
        <Routes>
          <Route path="/" element={<HomePag>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/userlist" element={<UserList />} />
        </Routes>
      </Router>
   
  );
}

export default App;
