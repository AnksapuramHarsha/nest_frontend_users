import axios from 'axios';

const API_URL = 'http://127.0.0.1:3000//auth/login';

interface LoginResponse {
  accessToken: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post(API_URL, { email, password });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error('Login failed');
  }
};
