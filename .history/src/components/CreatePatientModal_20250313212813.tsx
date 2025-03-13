import React, { useState } from "react";
import { createPatient } from "../apis/patientApi";
import { Patient } from "../types/createPatient";

interface CreatePatientModalProps {
    networkId: string;
    accessToken: string | null;
    onClose: () => void;
  }

const CreatePatientModal: React.FC<CreatePatientModalProps> = ({ networkId, accessToken, onClose }) => {
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
    emergencyContacts: ["" as string],
    preferredPharmacy: "",
    primaryCareProvider: "",
    active: true,
    preferences: {},
    bloodType: "",
    organDonor: false,
    advanceDirectives: {},
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = e.target instanceof HTMLInputElement ? e.target.checked : false;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement>, section: string) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof Patient] as object),
        [name]: value,
      },
    }));
  };

  const handleArrayChange = (index: number, value: string) => {
    const updatedContacts = [...(formData.emergencyContacts || [])];
    updatedContacts[index] = value;
    setFormData((prev) => ({ ...prev, emergencyContacts: updatedContacts }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (accessToken) {
        const response=await createPatient(formData, accessToken);
        console.log("Patient created successfully",response);
      } else {
        console.error("Access token is null");
      }
      onClose();
    } catch (error) {
      console.error("Failed to create patient:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-[500px] overflow-y-auto max-h-[90vh]">
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
          {["namePrefix", "nameGiven", "nameMiddle", "nameFamily", "nameSuffix", "preferredName"].map((field) => (
            <div key={field}>
              <label className="block capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
              <input
                type="text"
                name={field}
                value={formData[field as keyof Patient] as string}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          ))}

          {/* Identifiers */}
          {["aadhar", "pan"].map((field) => (
            <div key={field}>
              <label className="block capitalize">{field}</label>
              <input
                type="text"
                name={field}
                value={formData.identifier[field as keyof Patient["identifier"]]}
                onChange={(e) => handleNestedChange(e, "identifier")}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          ))}

          {/* Birth & Death Dates */}
          <div>
            <label className="block">Birth Date</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block">Death Date</label>
            <input
              type="date"
              name="deathDate"
              value={formData.deathDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Gender & Sex */}
          {["genderIdentity", "biologicalSex"].map((field) => (
            <div key={field}>
              <label className="block capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
              <select
                name={field}
                value={formData[field as keyof Patient] as string}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          ))}

          {/* Address */}
          {Object.keys(formData.address).map((field) => (
            <div key={field}>
              <label className="block capitalize">{field}</label>
              <input
                type="text"
                name={field}
                value={formData.address[field as keyof Patient["address"]]}
                onChange={(e) => handleNestedChange(e, "address")}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          ))}

          {/* Contact */}
          {Object.keys(formData.contact).map((field) => (
            <div key={field}>
              <label className="block capitalize">{field}</label>
              <input
                type="text"
                name={field}
                value={formData.contact[field as keyof Patient["contact"]]}
                onChange={(e) => handleNestedChange(e, "contact")}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          ))}

          {/* Emergency Contacts */}
          {formData.emergencyContacts?.map((contact, index) => (
            <div key={index}>
              <label className="block">Emergency Contact {index + 1}</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => handleArrayChange(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          ))}

          {/* Preferred Language & Organ Donor */}
          <div>
            <label className="block">Preferred Language</label>
            <input
              type="text"
              name="preferredLanguage"
              value={formData.preferredLanguage}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="organDonor"
              checked={formData.organDonor}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Organ Donor</label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between">
            <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Create Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePatientModal;
