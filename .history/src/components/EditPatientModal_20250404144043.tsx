// EditPatientModal.tsx
import React, { useState, useEffect } from "react";
import { Patient } from "../types/createPatient"; // Assuming this type exists
import { getPatientByUpid, updatePatient } from "../apis/patientApi"; // We'll create these

interface EditPatientModalProps {
    upid: string;
    accessToken: string | null;
    onClose: () => void;
}

const EditPatientModal: React.FC<EditPatientModalProps> = ({ 
    upid, 
    accessToken, 
    onClose 
}) => {
    // State to hold the form data
    const [formData, setFormData] = useState<Patient | null>(null);
    // State for loading and error handling
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch patient data when the modal opens
    useEffect(() => {
        const fetchPatient = async () => {
            if (!accessToken) {
                setError("Access token is missing");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const patientData = await getPatientByUpid(upid, accessToken);
                setFormData(patientData);
                setError(null);
            } catch (err) {
                setError("Failed to load patient data");
                console.error("Error fetching patient:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, [upid, accessToken]); // Dependencies: refetch if upid or accessToken changes

    // Handle changes to simple fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => prev ? ({
            ...prev,
            [name]: value,
        }) : null);
    };

    // Handle changes to nested contact fields (like phone)
    const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement>, nestedKey: keyof Patient) => {
        const { name, value } = e.target;
        setFormData((prev) => prev ? ({
            ...prev,
            [nestedKey]: {
                ...(prev[nestedKey] as object),
                [name]: value,
            },
        }) : null);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData || !accessToken) return;

        try {
            await updatePatient(formData, accessToken);
            console.log("Patient updated successfully");
            onClose(); // Close modal on success
        } catch (error) {
            console.error("Failed to update patient:", error);
            setError("Failed to save changes");
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                <div className="bg-white p-4 rounded">Loading patient data...</div>
            </div>
        );
    }

    // Error state
    if (error || !formData) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                <div className="bg-white p-4 rounded">
                    <p className="text-red-500">{error || "No patient data available"}</p>
                    <button 
                        className="mt-2 bg-gray-400 text-white px-4 py-2 rounded"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    // Main form
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 p-6">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Edit Patient</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Example fields - add more as needed */}
                    <div>
                        <label className="block text-sm font-medium">First Name</label>
                        <input
                            type="text"
                            name="nameGiven"
                            value={formData.nameGiven}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Last Name</label>
                        <input
                            type="text"
                            name="nameFamily"
                            value={formData.nameFamily}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.contact.phone}
                            onChange={(e) => handleNestedChange(e, "contact")}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            className="bg-gray-400 text-white px-4 py-2 rounded"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPatientModal;
