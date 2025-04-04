import { useState} from "react";
// import { toast } from "react-toastify";
import CreatePatientModal from "./CreatePatientModal";
import { Patient } from "../types/createPatient";

interface PatientListProps {
    accessToken: string | null;
}

const PatientList: React.FC<PatientListProps> = ({  accessToken }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patients, setPatients] = useState<Patient>({});
 

    return (
        <div>
            <div className="flex justify-between items-center">
                <div>
                    {/* <input
                        type="text"
                        placeholder="Search by name, gender, phone, UPID, or MRN"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="w-full p-2 border border-gray-300 rounded"
                    /> */}
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

            </div>
          

            {isModalOpen && (
                <CreatePatientModal
                    accessToken={accessToken}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            
        </div>
    );
};

export default PatientList;
