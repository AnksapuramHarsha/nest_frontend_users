import axios from 'axios';

const API_BASE_URL = 'http://1:3000';

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
