import axios from "axios";
import { useContext } from "react";
import {Auth}// Ensure you import AuthContext
import { Patient } from "../types/createPatient";

const API_URL = "http://127.0.0.1:3000/patients";

export const usePatientApi = () => {
  const { accessToken } = useContext(AuthContext);

  // Function to create a patient
  const createPatient = async (patientData: Patient) => {
    try {
      const response = await axios.post(API_URL, patientData, {
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

  return { createPatient };
};
