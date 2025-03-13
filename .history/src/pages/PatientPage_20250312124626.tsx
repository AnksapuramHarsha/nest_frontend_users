

// const PatientPage = () => {
    
//   return (
//     <div className="pt-20">
//       <h1>PatientList</h1>
//     </div>
//   )
// }

// export default PatientPage
import React from "react";
import PatientList from "../components/PatientList";
import { useSearchParams } from "react-router-dom";

const PatientPage: React.FC = () => {
  const [searchParams] = useSearchParams();
//   const networkId = searchParams.get("networkId") || "";
    const networkId = 550e8400-e29b-41d4-a716-446655440000

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

