import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { accessToken, user } = useAuth();

  if (!accessToken) return null;

  return (
    <nav className="p-4 bg-blue-500 text-white">
      <ul className="flex justify-between width-full">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/userlist">User List</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
