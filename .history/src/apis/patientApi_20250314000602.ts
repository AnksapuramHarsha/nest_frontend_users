import axios from "axios";
import { Patient } from "../types/createPatient";



const API_URL = "http://127.0.0.1:3000/patients";

// Function to create a patient
export const createPatient = async (patientData: Omit<Patient,accessToken: string) => {
  try {
    const response = await axios.post(API_URL, patientData,{
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating patient:", error);
    throw error;
  }
};

export const getPatients = async (networkId: string, accessToken: string) => {
    try {
      const response = await axios.get(`${API_URL}`, {
        params: { networkId }, 
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
