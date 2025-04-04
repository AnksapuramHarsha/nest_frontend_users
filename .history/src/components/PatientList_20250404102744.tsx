import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CreatePatientModal from "./CreatePatientModal";
import { Patient } from "../types/createPatient";
import { getPatients, deletePatient, updatePatient } from "../apis/patientApi";

interface PatientListProps {
    accessToken: string | null;
}

const PatientList: React.FC<PatientListProps> = ({  accessToken }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [editData, setEditData] = useState<Partial<Patient>>({
        contact: {
            email: "",
            phone: "",
            mobilePhone: ""
        }
    });

        const fetchPatients = async () => {
            
            if (!accessToken) {
                setError("Access token is missing.");
                setLoading(false);
                return;
            }

            try {
                const data: Patient[] = await getPatients(networkId, accessToken);
                setPatients(data);
                toast.success("Patients loaded successfully! ✅");
            } catch (err) {
                setError("Failed to fetch patients.");
                toast.error("Error fetching patients. ❌");
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        fetchPatients(); // ✅ Fetch patients on component mount
      }, [accessToken]);

    const handleDelete = async (patientId: string) => {
        if (!accessToken) {
            toast.error("Access token missing!");
            return;
        }

        // ✅ Show confirmation prompt before deleting
        const isConfirmed = window.confirm("Are you sure you want to delete this patient?");
        if (!isConfirmed) return; // If user clicks "Cancel", stop the function

        try {
            await deletePatient(patientId, accessToken);
            setPatients(patients.filter((p) => p.id !== patientId)); // ✅ Remove patient from list
            toast.success("Patient deleted successfully! ✅");
        } catch (error) {
            alert("Failed to delete patient.");
        }
    };
    


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
          

            {isModalOpen && (
                <CreatePatientModal
                    accessToken={accessToken}
                    onClose={() => setIsModalOpen(false)}
                    refreshPatients={fetchPatients}
                />
            )}

            
        </div>
    );
};

export default PatientList;
