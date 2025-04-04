import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
import CreatePatientModal from "./CreatePatientModal";
import { Patient } from "../types/createPatient";
import { getPatients } from "../apis/patientApi";
import ViewPatientModal from "./ViewPatientModal";


interface PatientListProps {
    accessToken: string | null;
}

const PatientList: React.FC<PatientListProps> = ({ accessToken }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPatientUpid, setSelectedPatientUpid] = useState<string | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const networkId = "82f4cdc9-2945-4345-95db-3f1f9e640bbf"; 

    useEffect(()=>{
        fetchPatients();
    },[])

    const fetchPatients = async () => {
        if (!accessToken) {
            console.error("Access token is missing!");
            return;
        }
    
        try {
            const patientsData = await getPatients(accessToken,networkId);
            setPatients(patientsData);
        } catch (error) {
            console.error("Error fetching patients:", error);
        }
    };

    // Handle filtering based on search term
    const filteredPatients = patients.filter((patient) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            patient.upid.toLowerCase().includes(searchLower) ||
            patient.abha.toLowerCase().includes(searchLower) ||
            patient.mrn.toLowerCase().includes(searchLower) ||
            `${patient.nameGiven} ${patient.nameFamily}`.toLowerCase().includes(searchLower) ||
            patient.contact.phone.toLowerCase().includes(searchLower)
        );
    });

    const handleView = (upid: string) => {
        console.log("View Patient with UPID:", upid);
        // Implement view logic here
        setSelectedPatientUpid(upid);
        setIsViewModalOpen(true);
    };

    const handleDelete = async (upid: string) => {
        console.log("Delete Patient with UPID:", upid); 
        await deletePatient(u)
    }

    

    return (
        <div>
            <div className="flex justify-between items-center">
                <div>
                    <input
                        type="text"
                        placeholder="Search by name, gender, phone, UPID, or MRN"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} 
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
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr className="bg-gray-100">
                            <th className="border p-2">UPID</th>
                            <th className="border p-2">ABHA</th>
                            <th className="border p-2">MRN</th>
                            <th className="border p-2">Full Name</th>
                            <th className="border p-2">Phone Number</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.map((patient) => (
                            <tr key={patient.upid} className="border">
                                <td className="border p-2">{patient.upid}</td>
                                <td className="border p-2">{patient.abha}</td>
                                <td className="border p-2">{patient.mrn}</td>
                                <td className="border p-2">{`${patient.nameGiven} ${patient.nameFamily}`}</td>
                                <td className="border p-2">{patient.contact.phone}</td>
                                <td className="border p-2">
                                    <button onClick={() => handleView(patient.upid)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">View</button>
                                    <button onClick={() => handleEdit(patient)} className="bg-blue-500 text-white px-2 py-1 rounded"  >Edit </button>
                                    <button onClick={() => handleDelete(patient.upid)} className="bg-red-500 text-white px-2 py-1 rounded ml-2"> Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>


            {isModalOpen && (
                <CreatePatientModal
                    accessToken={accessToken}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            {
                isViewModalOpen && (
                    <ViewPatientModal 
                        upid={selectedPatientUpid}
                        onClose={() => setIsViewModalOpen(false)}
                    />
                )
            }


        </div>
    );
};

export default PatientList;
