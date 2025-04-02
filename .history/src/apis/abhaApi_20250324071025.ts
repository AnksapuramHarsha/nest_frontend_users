import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:3000";
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

export const generateAbha = async (firstName: string, lastName: string, aadhaarNumber: string, accessToken: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/abha/generate`,
            { firstName, lastName, aadhaarNumber },
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

        return response.data; // Return the response data
    } catch (error) {
        console.error("Failed to generate ABHA:", error);
        throw new Error("Error generating ABHA number. Please try again.");
    }
};
