import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


const Navbar: React.FC = () => {
  const { accessToken, setAccessToken, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    setAccessToken(null);
    setUser(null);
    navigate('/login', { replace: true });
  };

  if (!accessToken) return null; // If no token, don't render navbar

  return (
    <nav className="fixed top-0 left-0 w-full p-4 bg-blue-500 text-white shadow-lg z-50">
      <ul className="flex justify-between">
        <li>
          <Link to="/dashboard" className="hover:text-gray-300">
            Current User
          </Link>
        </li>
        {/* <li>
          <Link to="/userlist" className="hover:text-gray-300">
            User List
          </Link>
        </li> */}
        <li>
          <Link to="/patients_list" className="hover:text-gray-300">
            Patients List
          </Link>
        </li>
        <li>
          <Link to="/" onClick={handleLogout} className="hover:text-gray-300">
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;


