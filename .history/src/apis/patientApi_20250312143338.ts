import axios from "axios";
import { Patient } from "../types/patient";

const API_BASE_URL = "http://127.0.0.1:3000"; 

export const fetchPatientsByNetwork = async (networkId: string, accessToken: string): Promise<Patient[]> => {
  try {
    if (!accessToken) {
      throw new Error("No access token provided.");
    }

    console.log("🔹 Sending request with token:", accessToken); // Debugging log

    const response = await axios.get(`${API_BASE_URL}/patients`, {
      params: { networkId },
      headers: {
        Authorization: `Bearer ${accessToken}`, // 🔥 Pass token in header
      },
    });

    console.log("✅ API Response:", response.data);

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
  } catch (error: any) {
    console.error("❌ API Error:", error.response?.status, error.response?.data);
    throw error;
  }
};

export const deletePatient = async (id: string, accessToken: string): Promise<void> => {
    await axios.
}
