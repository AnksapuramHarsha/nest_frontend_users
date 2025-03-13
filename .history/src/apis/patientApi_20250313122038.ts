import axios from "axios";
import { Patient } from "../types/patient";
import { CreatePatient } from "../types/createPatient";

const API_BASE_URL = "http://127.0.0.1:3000"; 

export const fetchPatientsByNetwork = async (networkId: string, accessToken: string): Promise<CreatePatient[]> => {
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
        networkId: patient.networkId,
        upid: patient.upid || "",
        abha: patient.abha || "",
        mrn: patient.mrn || "",
        identifier: {
          aadhar: patient.identifier?.aadhar || "",
          pan: patient.identifier?.pan || "",
        },
        namePrefix: patient.namePrefix || "",
        nameGiven: patient.nameGiven || "",
        nameMiddle: patient.nameMiddle || "",
        nameFamily: patient.nameFamily || "",
        nameSuffix: patient.nameSuffix || "",
        preferredName: patient.preferredName || "",
        birthDate: patient.birthDate || "",
        deathDate: patient.deathDate || null,
        genderIdentity: patient.genderIdentity || "",
        biologicalSex: patient.biologicalSex || "",
        preferredPronouns: patient.preferredPronouns || "",
        address: {
          line1: patient.address?.line1 || "",
          line2: patient.address?.line2 || "",
          city: patient.address?.city || "",
          state: patient.address?.state || "",
          postalCode: patient.address?.postalCode || "",
          country: patient.address?.country || "",
        },
        contact: {
          email: patient.contact?.email || "",
          phone: patient.contact?.phone || "",
          mobilePhone: patient.contact?.mobilePhone || "",
        },
        preferredLanguage: patient.preferredLanguage || "",
        interpreterRequired: patient.interpreterRequired || false,
        maritalStatus: patient.maritalStatus || "",
        race: patient.race || { category: "" },
        ethnicity: patient.ethnicity || "",
        emergencyContacts: patient.emergencyContacts || [],
        preferredPharmacy: patient.preferredPharmacy || "",
        primaryCareProvider: patient.primaryCareProvider || "",
        active: patient.active || false,
        preferences: patient.preferences || { contactMethod: "", appointmentReminders: false },
        bloodType: patient.bloodType || "",
        organDonor: patient.organDonor || false,
        advanceDirectives: patient.advanceDirectives || { livingWill: false, powerOfAttorney: "" },
        createdBy: patient.createdBy || "",
        updatedBy: patient.updatedBy || "",
      }));
      
    } else {
      throw new Error("Unexpected response status: " + response.status);
    }
  } catch (error: any) {
    console.error("❌ API Error:", error.response?.status, error.response?.data);
    throw error;
  }
};

export const deletePatient = async (id: string, accessToken: string): Promise<string> => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/patients/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (response.status === 204) {
        return "Patient deleted successfully.";
      } else {
        return "Patient not found.";
      }
    } catch (error: any) {
      console.error("Error deleting patient:", error);
      throw new Error(error.response?.data?.message || "Failed to delete patient.");
    }
  };
  
//   export const updatePatient = async (id: string, updatedData: Partial<Patient>, accessToken: string): Promise<string> => {
//     try {
//       const response = await axios.patch(`${API_BASE_URL}/patients/${id}`, updatedData, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
  
//       return "Patient updated successfully.";
//     } catch (error: any) {
//       console.error("Error updating patient:", error);
//       throw new Error(error.response?.data?.message || "Failed to update patient.");
//     }
//   };
export const updatePatient = async (id: string, updatedData: Partial<CreatePatient>, accessToken: string): Promise<Patient> => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/patients/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      return response.data; // ✅ Return updated patient data from backend
    } catch (error: any) {
      console.error("Error updating patient:", error);
      throw new Error(error.response?.data?.message || "Failed to update patient.");
    }
  };

  export const createPatient = async (patientData: CreatePatient, accessToken: string): Promise<string> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/patients`, patientData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
  
      return "Patient created successfully.";
    } catch (error: any) {
      console.error("Error creating patient:", error);
      throw new Error(error.response?.data?.message || "Failed to create patient.");
    }
  };
