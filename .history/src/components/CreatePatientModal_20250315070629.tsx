import React, { useState } from "react";
import { createPatient } from "../apis/patientApi";
import { Patient } from "../types/createPatient";

interface CreatePatientModalProps {
    networkId: string;
    accessToken: string | null;
    onClose: () => void;
    refreshPatients: () => void;
}

const CreatePatientModal: React.FC<CreatePatientModalProps> = ({ networkId, accessToken, onClose ,refreshPatients}) => {
    const [formData, setFormData] = useState<Omit<Patient, "id">>({
        networkId: networkId || "",
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
        deathDate: null,
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
        emergencyContacts: [],
        preferredPharmacy: null,
        primaryCareProvider: null,
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

    const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement>, section: keyof Omit<Patient, "id">) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...(prev[section] as any),
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
                const response = await createPatient(formData, accessToken);
                console.log("Patient created successfully", response);
                refreshPatients();
            } else {
                console.error("Access token is null");
            }
            onClose();
        } catch (error) {
            console.error("Failed to create patient:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm p-6 w-full h-full">
            <div className="bg-white mt-20 p-6 rounded-lg shadow-xl border border-gray-300 w-[90vw] max-h-[90vh] overflow-y-auto">
                <h2 className=" text-center text-xl font-semibold mb-4">Create Patient</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4"><CreatePatientModal/div></div>
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

                    <div>
                        <label className="block">UPID</label>
                        <input
                            type="text"
                            name="upid"
                            value={formData.upid}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    {/* ABHA No */}
                    <div>
                        <label className="block">ABHA No.</label>
                        <input
                            type="text"
                            name="abha"
                            value={formData.abha}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    {/* MRN */}
                    <div>
                        <label className="block">MRN</label>
                        <input
                            type="text"
                            name="mrn"
                            value={formData.mrn}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>


                    {/* Name Fields */}
                    {["namePrefix", "nameGiven", "nameMiddle", "nameFamily", "nameSuffix", "preferredName"].map((field) => (
                        <div key={field}>
                            <label className="block capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
                            <input
                                type="text"
                                name={field}
                                value={formData[field as keyof Omit<Patient, "id">] as string}
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
                            value={formData.birthDate ? new Date(formData.birthDate).toISOString().split("T")[0] : ""}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block">Death Date</label>
                        <input
                            type="date"
                            name="deathDate"
                            value={formData.deathDate ? new Date(formData.deathDate).toISOString().split("T")[0] : ""}
                            onChange={(e) => setFormData((prev) => ({
                                ...prev,
                                deathDate: e.target.value ? e.target.value : null,
                            }))}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    {/* Gender & Sex */}
                    {["genderIdentity", "biologicalSex"].map((field) => (
                        <div key={field}>
                            <label className="block capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
                            <select
                                name={field}
                                value={formData[field as keyof Omit<Patient, "id">] as string}
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
                    <div>
                        <label className="block">Preferred Pharmacy (UUID)</label>
                        <input
                            type="text"
                            name="preferredPharmacy"
                            value={formData.preferredPharmacy || ""}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Enter UUID"
                        />
                    </div>

                    <div>
                        <label className="block">Primary Care Provider (UUID)</label>
                        <input
                            type="text"
                            name="primaryCareProvider"
                            value={formData.primaryCareProvider || ""}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Enter UUID"
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
