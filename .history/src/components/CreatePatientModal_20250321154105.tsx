import React, { useState } from "react";
import { createPatient } from "../apis/patientApi";
import { Patient } from "../types/createPatient";

interface CreatePatientModalProps {
    networkId: string;
    accessToken: string | null;
    onClose: () => void;
    refreshPatients: () => void;
}

const CreatePatientModal: React.FC<CreatePatientModalProps> = ({ networkId, accessToken, onClose, refreshPatients }) => {
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
        emergencyContacts: [] as { name: string; relationship: string; phone: string }[],
        preferredPharmacy: null,
        primaryCareProvider: null,
        active: true,
        preferences: {},
        bloodType: "",
        organDonor: false,
        advanceDirectives: {},
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = e.target instanceof HTMLInputElement ? e.target.checked : false;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
         // ✅ UUID Validation for preferredPharmacy & primaryCareProvider
    if (name === "preferredPharmacy" || name === "primaryCareProvider") {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        setErrors((prev) => ({
            ...prev,
            [name]: value && !uuidRegex.test(value) 
                ? "Invalid UUID format. Example: 550e8400-e29b-41d4-a716-446655440000"
                : "",
        }));
    }
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

    const handleEmergencyContactChange = (
        index: number,
        field: keyof { name: string; relationship: string; phone: string },
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            emergencyContacts: (prev.emergencyContacts??[]).map((contact, i) =>
                i === index ? { ...contact, [field]: value } : contact
            ),
        }));
    };


    const addEmergencyContact = () => {
        setFormData((prev) => ({
            ...prev,
            emergencyContacts: [...(prev.emergencyContacts??[]), { name: "", relationship: "", phone: "" }],
        }));
    };


    const removeEmergencyContact = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            emergencyContacts: (prev.emergencyContacts??[]).filter((_, i) => i !== index),
        }));
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
                    {/* Disabled Network ID */}
                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Network Information</h3>
                        <div>

                            <label className="block">Network ID</label>
                            <input
                                type="text"
                                name="networkId"
                                value={networkId}
                                disabled
                                className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Personal Details</h3>
                        <div className="grid grid-cols-2 gap-4">

                            <div>
                                <label className="block">UPID</label>
                                <input
                                    type="text"
                                    name="upid"
                                    value={formData.upid}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
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
                                    className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                                    required
                                />
                                <button></button>
                            </div>
                            {/* MRN */}
                            <div>
                                <label className="block">MRN</label>
                                <input
                                    type="text"
                                    name="mrn"
                                    value={formData.mrn}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Name Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {["namePrefix", "nameGiven", "nameMiddle", "nameFamily", "nameSuffix", "preferredName"].map((field) => (
                                <div key={field}>
                                    <label className="block capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
                                    {field === "namePrefix" ? (
                                        <select
                                            name={field}
                                            value={formData[field as keyof Omit<Patient, "id">] as string}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                                        >
                                            <option value="">Select Prefix</option>
                                            <option value="Mr.">Mr.</option>
                                            <option value="Ms.">Ms.</option>
                                            <option value="Mrs.">Mrs.</option>
                                            <option value="Dr.">Dr.</option>
                                            <option value="Prof.">Prof.</option>
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            name={field}
                                            value={formData[field as keyof Omit<Patient, "id">] as string}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>


                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Identifiers</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {["aadhar", "pan"].map((field) => (
                                <div key={field}>
                                    <label className="block capitalize">{field}</label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={formData.identifier[field as keyof Patient["identifier"]]}
                                        onChange={(e) => handleNestedChange(e, "identifier")}
                                        className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Birth & Death Dates */}
                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Demographics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block">Birth Date</label>
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate ? new Date(formData.birthDate).toISOString().split("T")[0] : ""}
                                    onChange={handleChange}
                                    max={new Date().toISOString().split("T")[0]}
                                    className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                                />
                            </div>
                            {/* <div>
                                <label className="block">Death Date</label>
                                <input
                                    type="date"
                                    name="deathDate"
                                    value={formData.deathDate ? new Date(formData.deathDate).toISOString().split("T")[0] : ""}
                                    onChange={(e) => setFormData((prev) => ({
                                        ...prev,
                                        deathDate: e.target.value ? e.target.value : null,
                                    }))}
                                    className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                                />
                            </div> */}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Gender Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {["genderIdentity", "biologicalSex"].map((field) => (
                                <div key={field}>
                                    <label className="block capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
                                    <select
                                        name={field}
                                        value={formData[field as keyof Omit<Patient, "id">] as string}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            ))}

                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Address</h3>
                        <div className="grid grid-cols-2 gap-4">

                            {Object.keys(formData.address).map((field) => (
                                <div key={field}>
                                    <label className="block capitalize">{field}</label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={formData.address[field as keyof Patient["address"]]}
                                        onChange={(e) => handleNestedChange(e, "address")}
                                        className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Contact Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.keys(formData.contact).map((field) => (
                                <div key={field}>
                                    <label className="block capitalize">{field}</label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={formData.contact[field as keyof Patient["contact"]]}
                                        onChange={(e) => handleNestedChange(e, "contact")}
                                        className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>


                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Emergency Contacts</h3>
                        {(formData.emergencyContacts??[]).map((contact, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={contact.name}
                                    onChange={(e) => handleEmergencyContactChange(index, "name", e.target.value)}
                                    className="w-1/3 p-2 border border-gray-300 rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Relationship"
                                    value={contact.relationship}
                                    onChange={(e) => handleEmergencyContactChange(index, "relationship", e.target.value)}
                                    className="w-1/3 p-2 border border-gray-300 rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Phone"
                                    value={contact.phone}
                                    onChange={(e) => handleEmergencyContactChange(index, "phone", e.target.value)}
                                    className="w-1/3 p-2 border border-gray-300 rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeEmergencyContact(index)}
                                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addEmergencyContact}
                            className="mt-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Add Contact
                        </button>
                    </div>



                    {/* Preferred Language & Organ Donor */}
                    <div>
                        <label className="block">Preferred Language</label>
                        <input
                            type="text"
                            name="preferredLanguage"
                            value={formData.preferredLanguage}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Medical Preferences</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block">Preferred Pharmacy (UUID)</label>
                                <input
                                    type="text"
                                    name="preferredPharmacy"
                                    value={formData.preferredPharmacy || ""}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                                    placeholder="Enter UUID"
                                />
                                {errors.preferredPharmacy && <p className="text-red-500 text-sm">{errors.preferredPharmacy}</p>}
                            </div>

                            <div>
                                <label className="block">Primary Care Provider (UUID)</label>
                                <input
                                    type="text"
                                    name="primaryCareProvider"
                                    value={formData.primaryCareProvider || ""}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                                    placeholder="Enter UUID"
                                />
                                 {errors.primaryCareProvider && <p className="text-red-500 text-sm">{errors.primaryCareProvider}</p>}
                            </div>
                        </div>
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
