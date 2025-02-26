import axios from 'axios';

const API_URL = 'http://localhost/auth/login';

interface LoginResponse {
  accessToken: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post(API_URL, { email, password });
    
    return response.data;
  } catch (error) {
    throw new Error('Login failed');
  }
};
