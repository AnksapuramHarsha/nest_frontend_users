import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from "react-toastify"; // ✅ Import ToastContainer
import "react-toastify/dist/ReactToastify.css";
import {useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import UserList from './components/UserList';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import PatientPage from './pages/PatientPage';

function App() {
  const { accessToken } = useAuth();
  const location = useLocation(); // Get the current route

   // Hide Navbar on Home and Login page
   const hideNavbarRoutes = ["/", "/login",""];
   const shouldShowNavbar = accessToken && !hideNavbarRoutes.includes(location.pathname);

  return (
    
      <Router>
        {/* Render Navbar only if accessToken exists (user is logged in) */}
        {shouldShowNavbar && <Navbar />}
        
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/userlist" element={<UserList />} />
          <Route path="/patients_list" element={<PatientPage />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </Router>
   
  );
}

export default App;
