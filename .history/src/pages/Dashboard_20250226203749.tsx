import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { accessToken } = useAuth();

  return (
    <div className="p-6">
      <h2 className="text-2xl">Dashboard</h2>
      {accessToken ? (
        <p>Welcome to the dashboard. Your token is: {accessToken}</p>
      ) : (
        <p>You are not logged in. Please login first.</p>
      )}
    </div>
  );
};

export default Dashboard;
