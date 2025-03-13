import React from "react";
import PatientList from "../components/PatientList";
import { useAuth } from "../contexts/AuthContext";
// import { useSearchParams } from "react-router-dom";

const PatientPage: React.FC = () => {
//   const [searchParams] = useSearchParams();
//   const networkId = searchParams.get("networkId") || "";
    const networkId = "2e598da8-2764-4691-a5b8-9b7c65522186"

  return (
    <div className="p-8 pt-20">
      {networkId ? (
        <PatientList networkId={networkId} />
      ) : (
        <p className="text-red-500">No Network ID provided.</p>
      )}
    </div>
  );
};

export default PatientPage;

