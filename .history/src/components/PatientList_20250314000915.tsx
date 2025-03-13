import { useState, useEffect } from "react";
import CreatePatientModal from "./CreatePatientModal";
import ViewPatientModal from "./ViewPatientModal";
import { Patient } from "../types/createPatient";
import { getPatients, deletePatient, updatePatient } from "../apis/patientApi";

interface PatientListProps {
    networkId: string;
    accessToken: string | null;
}

const PatientList: React.FC<PatientListProps> = ({ networkId, accessToken }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null); 
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editData, setEditData] = useState<Partial<Patient>>({});

    useEffect(() => {
        const fetchPatients = async () => {
            if (!networkId) {
                setError("Network ID is missing.");
                setLoading(false);
                return;
            }
            if (!accessToken) {
                setError("Access token is missing.");
                setLoading(false);
                return;
            }
    
            try {
                const data: Patient[] = await getPatients(networkId, accessToken);
                setPatients(data);
            } catch (err) {
                setError("Failed to fetch patients.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchPatients();
    }, [networkId, accessToken]);
    

    return (
        <div>
            <div className="flex justify-between items-center">
                <div>
                    <input
                        type="text"
                        placeholder="Search by name"
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Create Patient
                    </button>
                </div>
            </div>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Patient List</h2>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && patients.length === 0 && (
                    <p className="text-gray-500">No patients found.</p>
                )}

                {!loading && !error && patients.length > 0 && (
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">UPID</th>
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Birth Date</th>
                                <th className="border p-2">Gender</th>
                                <th className="border p-2">MRN</th>
                                <th className="border p-2">Language</th>
                                <th className="border p-2">Mobile Number</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((patient) => (
                                <tr key={patient.upid} className="border">
                                    <td className="border p-2">{patient.upid}</td>
                                    <td className="border p-2">
                                        {`${patient.namePrefix} ${patient.nameGiven} ${patient.nameMiddle || ""} ${patient.nameFamily}`.trim()}
                                    </td>
                                    <td className="border p-2">{patient.birthDate}</td>
                                    <td className="border p-2">{patient.genderIdentity}</td>
                                    <td className="border p-2">{patient.mrn}</td>
                                    <td className="border p-2">{patient.preferredLanguage}</td>
                                    <td className="border p-2">{patient.contact.phone}</td>
                                    <td className="border p-2">
                                        <button onClick={() => setSelectedPatient(patient)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">View</button>
                                        <button className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                                        <button className="bg-red-500 text-white px-2 py-1 rounded ml-2">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {selectedPatient && (
                <ViewPatientModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
            )}

            {isModalOpen && (
                <CreatePatientModal
                    networkId={networkId}
                    accessToken={accessToken}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default PatientList;
