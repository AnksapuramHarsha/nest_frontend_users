import axios from 'axios';

// const API_BASE_URL = 'http://18.142.172.41:3000';
const API_BASE_URL = 'http://localhost:3000';

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
  return response.data;
};

export const getUserProfile = async (accessToken: string, userId: string) => {
  const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data;
};

export const getUsersList = async (accessToken: string) => {
  const response = await axios.get(`${API_BASE_URL}/users?take=10`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data.data;
};

export const register = async (formData: FormData) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
export const register = async (formData:FormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return { status: response.status, data }; 
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};


