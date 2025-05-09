import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import UserList from './components/UserList';
import Register from './pages/Register';
import HomePage from './pages/HomePage';

function App() {
  const { accessToken } = useAuth();

  return (
    
      <Router>
        {/* Render Navbar only if accessToken exists (user is logged in) */}
        {accessToken && <Navbar />}
        
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/userlist" element={<UserList />} />
          <R
        </Routes>
      </Router>
   
  );
}

export default App;
