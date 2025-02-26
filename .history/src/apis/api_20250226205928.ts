import axios from 'axios';

// Function to fetch user profile by ID
export const getUserProfile = async (token: string, userId: string) => {
  try {
    const response = await axios.get(`http://127.0.0.1:3000/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Function to fetch the user list
export const getUserList = async (token: string) => {
  try {
    const response = await axios.get('http://127.0.0.1:3000/users?take=1', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user list:', error);
    throw error;
  }
};
