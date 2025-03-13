import React, { useState } from "react";
import CreatePatientModal from "./CreatePatientModal";
import { Patient } from "../types/createPatient";
import { getPatients } from "../apis/patientApi";

interface PatientListProps {
    networkId: string;
    accessToken: string | null;
  }

const PatientList: React.FC<PatientListProps> = ({ networkId,accessToken }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data: Patient[] = await getPatients(networkId, accessToken);
        setPatients(data);
      } catch (err) {
        setError("Failed to fetch patients.");
      } finally {
        setLoading(false);
      }
    };

    if (networkId) {
      fetchPatients();
    }
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
