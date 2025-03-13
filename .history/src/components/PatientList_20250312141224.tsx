import React, { useEffect, useState } from "react";
import { fetchPatientsByNetwork } from "../apis/patientApi";
import { Patient } from "../types/patient";
import { useAuth } from "../contexts/AuthContext";

interface PatientListProps {
    networkId: string;
}

const PatientList: React.FC<PatientListProps> = ({ networkId }) => {
    const { accessToken } = useAuth();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPatients = async () => {
            if (!accessToken) {
                setError("Unauthorized: No token found.");
                setLoading(false);
                return;
            }

            try {
                const data = await fetchPatientsByNetwork(networkId, accessToken);
                setPatients(data);
            } catch (err) {
                setError("Failed to load patient data.");
            } finally {
                setLoading(false);
            }
        };

        loadPatients();
    }, [networkId, accessToken]);

    const handleView = (id: string) => {
        patients.filter((patient) => patient.id === id);
        
    }

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Patient List</h2>

            {loading && <p className="text-gray-600">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && patients.length === 0 && (
                <p className="text-gray-600">No patients found.</p>
            )}

            {!loading && !error && patients.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2">ID</th>
                                <th className="border border-gray-300 px-4 py-2">ABHA</th>
                                <th className="border border-gray-300 px-4 py-2">MRN</th>
                                <th className="border border-gray-300 px-4 py-2">First Name</th>
                                <th className="border border-gray-300 px-4 py-2">Last Name</th>
                                <th className="border border-gray-300 px-4 py-2">Birth Date</th>
                                <th className="border border-gray-300 px-4 py-2">Gender</th>
                                <th className="border border-gray-300 px-4 py-2">Phone</th>
                                <th className="border border-gray-300 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-2">{patient.id}</td>
                                    <td className="border border-gray-300 px-4 py-2">{patient.abha}</td>
                                    <td className="border border-gray-300 px-4 py-2">{patient.mrn}</td>
                                    <td className="border border-gray-300 px-4 py-2">{patient.nameGiven}</td>
                                    <td className="border border-gray-300 px-4 py-2">{patient.nameFamily}</td>
                                    <td className="border border-gray-300 px-4 py-2">{patient.birthDate}</td>
                                    <td className="border border-gray-300 px-4 py-2">{patient.genderIdentity}</td>
                                    <td className="border border-gray-300 px-4 py-2">{patient.contact.phone}</td>
                                    <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                                        <button
                                            onClick={() => handleView(patient.id)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleEdit(patient.id)}
                                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(patient.id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PatientList;
