import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:3000";

export const verifyAbha = async (firstName: string, lastName: string, abhaNumber: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/abha/verify`, {
            firstName,
            lastName,
            abhaNumber
        });

        return response.data.status; // "Verified" or "Not Verified"
    } catch (error) {
        console.error("ABHA Verification Failed:", error);
        return "Verification Failed";
    }
};
