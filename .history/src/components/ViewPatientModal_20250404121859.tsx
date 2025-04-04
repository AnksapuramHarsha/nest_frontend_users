import React from 'react'

interface ViewPatientModalProps {
    upid: string;
    onClose: () => void;
  }

const ViewPatientModal: React.FC<ViewPatientModalProps> = ({upid, onClose}) => {
    const [patient, setPatient] = useState<Patient | null>(null);

    useEffect(() => {
        const fetchPatient = async () => {
          try {
            const patientData = await getPatientByUpid(upid);  // API call to fetch patient details
            setPatient(patientData);
          } catch (error) {
            console.error("Error fetching patient:", error);
          }
        };
        fetchPatient();
      }, [upid]);
    
      if (!patient) {
        return <div>Loading...</div>; // You can customize the loading message or UI
      }
      
  return (
    <div>
        <h2>ViewPatientModal</h2>
    </div>
  )
}

export default ViewPatientModal
