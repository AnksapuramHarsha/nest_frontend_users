import React from 'react'
import { useEffect, useState } from 'react';
import { getPatientByUpid } from '../apis/patientApi';
import { Patient } from '../types/createPatient';
import { useAuth } from '../contexts/AuthContext';

interface ViewPatientModalProps {
    upid: string;
    onClose: () => void;
}

const ViewPatientModal: React.FC<ViewPatientModalProps> = ({ upid, onClose }) => {
    const [patient, setPatient] = useState<Patient | null>(null);
    const { accessToken } = useAuth();

    useEffect(() => {
        const fetchPatient = async () => {
            if (!accessToken) {
                console.error("Access token is missing!");
                return;
            }
            try {
                const patientData = await getPatientByUpid(upid, accessToken);  // API call to fetch patient details
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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 p-6">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            </div>
        </div>
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
            <button onClick={onClose}>Close</button>
        </div>
    )
}

export default ViewPatientModal
