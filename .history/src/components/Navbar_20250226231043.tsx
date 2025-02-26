// import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { accessToken } = useAuth();

  if (!accessToken) return null;

  return (
    <nav className="fixed top-0 left-0 w-full p-4 bg-blue-500 text-white shadow-lg z-50">
      <ul className="flex justify-between">
        <li>
          <Link to="/dashboard" className="hover:text-gray-300">
            Current User
          </Link>
        </li>
        <li>
          <Link to="/userlist" className="hover:text-gray-300">
            User List
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
