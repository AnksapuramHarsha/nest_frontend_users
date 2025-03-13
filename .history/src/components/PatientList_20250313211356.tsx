import React, { useState } from "react";
import CreatePatientModal from "./CreatePatientModal";

interface PatientListProps {
    networkId: string;
    accessToken: string | null;
  }

const PatientList: React.FC<{ networkId: string }> = ({ networkId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PatientList;
