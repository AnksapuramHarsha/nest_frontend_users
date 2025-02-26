import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../apis/api';

const Dashboard: React.FC = () => {
  const { accessToken, user, setAccessToken, setUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(accessToken, user.id);
        setProfile(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchProfile();
  }, [accessToken, user, navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    setAccessToken(null);
    setUser(null);
    navigate('/login');
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="p-6  mt-8 bg-gradient-to-r from-blue-50 via-indigo-100 to-indigo-200 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Dashboard</h2>

        <div className="text-center mb-6">
          <p className="text-3xl font-bold text-indigo-700">Welcome, {profile.firstName}!</p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p><strong className="text-indigo-600">Name:</strong> {profile.firstName} {profile.lastName}</p>
            <p><strong className="text-indigo-600">Email:</strong> {profile.email}</p>
            <p><strong className="text-indigo-600">Phone:</strong> {profile.phone}</p>
            <p><strong className="text-indigo-600">Role:</strong> {profile.role}</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

