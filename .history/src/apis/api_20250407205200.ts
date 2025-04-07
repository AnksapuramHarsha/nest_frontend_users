import axios from 'axios';

const API_BASE_URL = 'https://18.142.172.41/api';
// const API_BASE_URL = 'http://localhost:3000/api';

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
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.error("Registration API Error:", error);

    // Extract error message safely
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error occurred";

    return { status: error.response?.status || 500, error: errorMessage };
  }
};

