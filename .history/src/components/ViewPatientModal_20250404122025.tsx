import React from 'react'
import { useEffect, useState } from 'react';

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
        <h3>Patient Details</h3>
        <p><strong>UPID:</strong> {patient.upid}</p>
        <p><strong>ABHA:</strong> {patient.abha}</p>
        <p><strong>MRN:</strong> {patient.mrn}</p>
        <p><strong>Name:</strong> {`${patient.nameGiven} ${patient.nameFamily}`}</p>
        <p><strong>Phone:</strong> {patient.contact.phone}</p>
        <p><strong>Gender:</strong> {patient.genderIdentity}</p>
        <p><strong>Birth Date:</strong> {patient.birthDate}</p>
        <p><strong>Marital Status:</strong> {patient.maritalStatus}</p>
    </div>
  )
}

export default ViewPatientModal
