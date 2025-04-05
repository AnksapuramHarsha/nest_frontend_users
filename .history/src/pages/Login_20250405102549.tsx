import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../apis/api';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setAccessToken, setUser } = useAuth();
  const { setNetworkId } = useAuth(); 
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token, user } = await login(email, password);

      sessionStorage.setItem('accessToken', token.accessToken);
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('networkId', user.networkId);

      setAccessToken(token.accessToken);
      setUser(user);
      setNetworkId(user.networkId); 

      navigate('/patients_list');
    } catch (err) {
      console.error(err);
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-teal-400 to-blue-500 bg-cover bg-center">
      {/* Container for Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 animate-pulse"></div>
      
      {/* Login Form */}
      <div className="relative w-full max-w-md p-8 bg-white bg-opacity-90 rounded-lg shadow-xl transform transition-all duration-500 hover:scale-105 animate__animated animate__fadeIn">
        <h2 className="text-3xl font-bold text-center text-teal-700 mb-6">
          Login to Your Account
        </h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </form>

        {/* No Account Message */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            No account?{' '}
            <Link to="/register" className="text-teal-700 hover:text-teal-900">
            Register
          </Link>
            {/* <a href="/register" className="text-teal-600 hover:text-teal-700">
              Create one
            </a> */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
