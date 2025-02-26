// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login'; // Import Login component
import Register from './components/Register'; // Import Register component
import Dashboard from './components/Dashboard'; // Import Dashboard component
import UserList from './components/UserList'; // Import UserList component

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userlist" element={<UserList />} />
      </Routes>
    </Router>
  );
};

export default App;
