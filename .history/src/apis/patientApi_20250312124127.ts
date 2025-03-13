import axios from "axios";
import { Patient } from "../types/patient";

const API_BASE_URL = "http://127.0.0.1:3000"; 

export const fetchPatientsByNetwork = async (networkId: string): Promise<Patient[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/patients`, {
      params: { networkId },
    });

    if (response.status === 200) {
      return response.data.map((patient: any) => ({
        id: patient.id,
        abha: patient.abha,
        mrn: patient.mrn,
        nameGiven: patient.nameGiven,
        nameFamily: patient.nameFamily,
        birthDate: patient.birthDate,
        genderIdentity: patient.genderIdentity,
        contact: {
          phone: patient.contact?.phone || "N/A",
        },
      }));
    } else {
      throw new Error("Unexpected response status: " + response.status);
    }
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw error;
  }
};

