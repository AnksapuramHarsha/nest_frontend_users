import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <ul className="flex space-x-4">
        <li>
          <Link to="/user" className="hover:text-gray-400">User</Link>
        </li>
        <li>
          <Link to="/userlist" className="hover:text-gray-400">User List</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
