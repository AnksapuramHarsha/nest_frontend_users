import axios from "axios";
import { Patient } from "../types/createPatient";

const API_URL = "http://127.0.0.1:3000/api/patients";
// const API_URL = 'http://18.142.172.41:3000/patients';

// Function to create a patient
export const createPatient = async (patientData: Patient,accessToken: string) => {
  try {
    const response = await axios.post(API_URL, patientData,{
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("API Validation Error:", error.response.data);
      throw new Error(`API Error: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    console.error("Unexpected API Error:", error);
    throw error;
  }
};

export const getPatients = async (accessToken: string,networkId:string) => {
    try {
      const response = await axios.get(`${API_URL}?networkId=${networkId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Pass access token
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching patients:", error);
      throw error;
    }
  };

  export const getPatientByUpid = async (upid: string) => {
    try {
      const response = await axios.get(`${API_URL}/${upid}`,);
      return response.data;  // Return the patient data
    } catch (error) {
      console.error("Error fetching patient:", error);
      throw error;
    }
  };

  export const deletePatient = async (patientId: string, accessToken: string) => {
    try {
      const response = await axios.delete(`${API_URL}/${patientId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting patient:", error);
      throw error;
    }
  };
  
  export const updatePatient = async (patientId: string, updatedData: Partial<Patient>, accessToken: string) => {
    try {
      const response = await axios.patch(`${API_URL}/${patientId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating patient:", error);
      throw error;
    }
  };

  export const activatePatient = async (patientId: string, accessToken: string) => {
    try {
      const response = await axios.patch(`${API_URL}/${patientId}/activate`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error activating patient:", error);
      throw error;
    }
  };
  
  export const deactivatePatient = async (patientId: string, accessToken: string) => {
    try {
      const response = await axios.patch(`${API_URL}/${patientId}/deactivate`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error deactivating patient:", error);
      throw error;
    }
  };
  
