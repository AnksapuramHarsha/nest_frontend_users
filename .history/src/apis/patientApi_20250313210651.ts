import axios from "axios";
import { Patient } from "../types/createPatient";
import { AuthContext } from '../contexts/AuthContext';



const API_URL = "http://127.0.0.1:3000/patients";

// Function to create a patient
export const createPatient = async (patientData: Patient) => {
export const createPatient = async (patientData: Patient, accessToken: string) => {
    const response = await axios.post(API_URL, patientData);
    return response.data;
    const response = await axios.post(API_URL, patientData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    console.error("Error creating patient:", error);
    throw error;
  }
};
