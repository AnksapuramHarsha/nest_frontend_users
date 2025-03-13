import React, { useState } from "react";
import { createPatient } from "../apis/patientApi";
import { Patient } from "../types/createPatient";

const CreatePatientModal: React.FC<{ networkId: string; onClose: () => void }> = ({ networkId, onClose }) => {
  const [formData, setFormData] = useState<Patient>({
    networkId,
    upid: "",
    abha: "",
    mrn: "",
    identifier: { aadhar: "", pan: "" },
    namePrefix: "",
    nameGiven: "",
    nameMiddle: "",
    nameFamily: "",
    nameSuffix: "",
    preferredName: "",
    birthDate: "",
    deathDate: "",
    genderIdentity: "male",
    biologicalSex: "male",
    preferredPronouns: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    contact: { email: "", phone: "", mobilePhone: "" },
    preferredLanguage: "",
    interpreterRequired: false,
    maritalStatus: "",
    race: {},
    ethnicity: "",
    emergencyContacts: [""],
    preferredPharmacy: "",
    primaryCareProvider: "",
    active: true,
    preferences: {},
    bloodType: "",
    organDonor: false,
    advanceDirectives: {},
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPatient(formData);
      onClose();
    } catch (error) {
      console.error("Failed to create patient:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Create Patient</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Disabled Network ID */}
          <div>
            <label className="block">Network ID</label>
            <input
              type="text"
              name="networkId"
              value={networkId}
              disabled
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          {/* Name Fields */}
          <div>
            <label className="block">First Name</label>
            <input
              type="text"
              name="nameGiven"
              value={formData.nameGiven}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block">Last Name</label>
            <input
              type="text"
              name="nameFamily"
              value={formData.nameFamily}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Gender Selection */}
          <div>
            <label className="block">Gender</label>
            <select
              name="genderIdentity"
              value={formData.genderIdentity}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between">
            <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePatientModal;
