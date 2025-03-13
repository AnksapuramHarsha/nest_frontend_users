import axios from "axios";
import { Patient } from "../types/createPatient";
import { useContext } from "react";
import { useAuth } from '../contexts/AuthContext';



const API_URL = "http://127.0.0.1:3000/patients";

// Function to create a patient
export const createPatient = async (patientData: Patient) => {
    const { accessToken } = useContext(AuthContext);
  try {
    const response = await axios.post(API_URL, patientData);
    return response.data;
  } catch (error) {
    console.error("Error creating patient:", error);
    throw error;
  }
};
