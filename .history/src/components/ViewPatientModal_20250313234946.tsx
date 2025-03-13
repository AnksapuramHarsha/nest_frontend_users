import React from "react";
import { Patient } from "../types/createPatient";

interface ViewPatientModalProps {
  patient: Patient | null;
  onClose: () => void;
}

const ViewPatientModal: React.FC<ViewPatientModalProps> = ({ patient, onClose }) => {
  if (!patient) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-[500px] overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">Patient Details</h2>

        <div className="space-y-2">
          <p><strong>UPID:</strong> {patient.upid}</p>
          <p><strong>ABHA No:</strong> {patient.abha}</p>
          <p><strong>MRN:</strong> {patient.mrn}</p>
          <p><strong>Name:</strong> {`${patient.namePrefix} ${patient.nameGiven} ${patient.nameMiddle || ""} ${patient.nameFamily}`.trim()}</p>
          <p><strong>Birth Date:</strong> {patient.birthDate}</p>
          <p><strong>Death Date:</strong> {patient.deathDate || "N/A"}</p>
          <p><strong>Gender Identity:</strong> {patient.genderIdentity}</p>
          <p><strong>Biological Sex:</strong> {patient.biologicalSex}</p>
          <p><strong>Preferred Pronouns:</strong> {patient.preferredPronouns || "N/A"}</p>
          <p><strong>Preferred Language:</strong> {patient.preferredLanguage || "N/A"}</p>
          <p><strong>Organ Donor:</strong> {patient.organDonor ? "Yes" : "No"}</p>
          <p><strong>Blood Type:</strong> {patient.bloodType || "N/A"}</p>

          <h3 className="font-semibold mt-4">Contact Information</h3>
          <p><strong>Email:</strong> {patient.contact.email}</p>
          <p><strong>Phone:</strong> {patient.contact.phone}</p>
          <p><strong>Mobile Phone:</strong> {patient.contact.mobilePhone || "N/A"}</p>

          <h3 className="font-semibold mt-4">Address</h3>
          <p><strong>Line 1:</strong> {patient.address.line1}</p>
          <p><strong>Line 2:</strong> {patient.address.line2 || "N/A"}</p>
          <p><strong>City:</strong> {patient.address.city}</p>
          <p><strong>State:</strong> {patient.address.state}</p>
          <p><strong>Postal Code:</strong> {patient.address.postalCode}</p>
          <p><strong>Country:</strong> {patient.address.country}</p>

          <h3 className="font-semibold mt-4">Medical Information</h3>
          <p><strong>Preferred Pharmacy:</strong> {patient.preferredPharmacy || "N/A"}</p>
          <p><strong>Primary Care Provider:</strong> {patient.primaryCareProvider || "N/A"}</p>

          <h3 className="font-semibold mt-4">Additional Information</h3>
          <p><strong>Marital Status:</strong> {patient.maritalStatus || "N/A"}</p>
          <p><strong>Ethnicity:</strong> {patient.ethnicity || "N/A"}</p>
          <p><strong>Emergency Contacts:</strong> {patient.emergencyContacts?.length ? patient.emergencyContacts.join(", ") : "N/A"}</p>
        </div>

        <div className="flex justify-end mt-4">
          <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPatientModal;
