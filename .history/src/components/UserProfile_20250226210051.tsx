import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../api/api';

interface UserProfileProps {
  userId: string;
  accessToken: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, accessToken }) => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getUserProfile(accessToken, userId);
        setUserProfile(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [accessToken, userId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">User Profile</h2>
      <div className="mt-4">
        <p><strong>First Name:</strong> {userProfile.firstName}</p>
        <p><strong>Last Name:</strong> {userProfile.lastName}</p>
        <p><strong>Email:</strong> {userProfile.email}</p>
        <p><strong>Phone:</strong> {userProfile.phone}</p>
        <p><strong>Role:</strong> {userProfile.role}</p>
      </div>
    </div>
  );
};

export default UserProfile;
