import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import useN

function App() {
  const { accessToken } = useAuth();

  return (
    
      <Router>
        {/* Render Navbar only if accessToken exists (user is logged in) */}
        {accessToken && <Navbar />}
        
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/login" element={accessToken ? <Navigate to="/patients_list" replace /> : <Login />} /> 
          <Route path="/register" element={<Register/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/userlist" element={<UserList />} />
          {/* <Route path="/patients_list" element={<PatientPage />} /> */}
          <Route 
                    path="/patients_list" 
                    element={accessToken ? <PatientPage /> : <Navigate to="/login" replace />} 
                />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </Router>
   
  );
}

export default App;
