import React, { useState } from "react";
import { createPatient } from "../apis/patientApi";
import { Patient } from "../types/createPatient";
import { generateAbha } from "../apis/abhaApi";

interface CreatePatientModalProps {
    accessToken: string | null;
    onClose: () => void;
    refreshPatients: () => void;
}

const CreatePatientModal: React.FC<CreatePatientModalProps> = ({ accessToken, onClose, refreshPatients }) => {
    const [formData, setFormData] = useState<Patient>({
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
        race: { category: "" },
        ethnicity: "",
        emergencyContacts: [],
        active: true,
        preferences: { contactMethod: "", appointmentReminders: false },
        bloodType: "",
        organDonor: false,
        advanceDirectives: { livingWill: false, powerOfAttorney: "" },
        statusId: 0,
    });



    const handleEmergencyContactChange = (
        index: number,
        field: keyof { name: string; relationship: string; phone: string },
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            emergencyContacts: (prev.emergencyContacts ?? []).map((contact, i) =>
                i === index ? { ...contact, [field]: value } : contact
            ),
        }));
    };


    const addEmergencyContact = () => {
        setFormData((prev) => ({
            ...prev,
            emergencyContacts: [...(prev.emergencyContacts ?? []), { name: "", relationship: "", phone: "" }],
        }));
    };


    const removeEmergencyContact = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            emergencyContacts: (prev.emergencyContacts ?? []).filter((_, i) => i !== index),
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


    const handleGenerateAbha = async () => {
        if (!accessToken) {
            alert("Access token is missing. Please log in again.");
            return;
        }

        if (!formData.nameGiven || !formData.nameFamily || !formData.identifier.aadhar) {
            alert("Please enter First Name, Last Name, and Aadhaar Number before generating ABHA.");
            return;
        }

        // ✅ Aadhaar Validation: Must be exactly 12 digits (numeric only)
        const aadhaarRegex = /^\d{12}$/;
        if (!aadhaarRegex.test(formData.identifier.aadhar)) {
            alert("Invalid Aadhaar number! It must be exactly 12 digits (numeric only) with out any special characters(@,_,-).");
            return;
        }

        setIsGenerating(true);
        try {
            const data = await generateAbha(
                formData.nameGiven,
                formData.nameFamily,
                formData.identifier.aadhar,
                accessToken
            );

            // Update ABHA Number field
            setFormData((prev) => ({
                ...prev,
                abha: data.abhaNumber,
            }));
        } catch (error) {
            alert(error instanceof Error ? error.message : String(error));
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm p-6 w-full h-full">
            <div className="bg-white mt-20 p-6 rounded-lg shadow-xl border border-gray-300 w-[90vw] max-h-[90vh] overflow-y-auto">
                <h2 className=" text-center text-xl font-semibold mb-4">Create Patient</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Personal Details</h3>
                        <div className="grid grid-cols-2 gap-4">

                            <div>
                                <label className="block">ABHA:</label>
                                <input
                                    type="text" name="abha" value={formData.abha} onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                                    required
                                />
                            </div>

                            {/* MRN */}
                            <div>
                                <label className="block">MRN:</label>
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
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Personal Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">Name Prefix:</label>
                            <input type="text" name="namePrefix" value={formData.namePrefix} onChange={handleChange} />

                            <label className="block">First Name:</label>
                            <input type="text" name="nameGiven" value={formData.nameGiven} onChange={handleChange} />

                            <label className="block">Middle Name:</label>
                            <input type="text" name="nameMiddle" value={formData.nameMiddle} onChange={handleChange} />

                            <label className="block">Last Name:</label>
                            <input type="text" name="nameFamily" value={formData.nameFamily} onChange={handleChange} />

                            <label className="block">Name Suffix:</label>
                            <input type="text" name="nameSuffix" value={formData.nameSuffix} onChange={handleChange} />

                            <label className="block">Preferred Name:</label>
                            <input type="text" name="preferredName" value={formData.preferredName} onChange={handleChange} />

                            <label className="block">Birth Date:</label>
                            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />

                            <label className="block">Gender Identity:</label>
                            <select name="genderIdentity" value={formData.genderIdentity} onChange={handleChange}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>

                            <label className="block">Biological Sex:</label>
                            <select name="biologicalSex" value={formData.biologicalSex} onChange={handleChange}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>

                            <label>Preferred Pronouns:</label>
                            <input type="text" name="preferredPronouns" value={formData.preferredPronouns} onChange={handleChange} />
                            
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Address</h3>
                        <div>
                            
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
                        {(formData.emergencyContacts ?? []).map((contact, index) => (
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

                    {/* ABHA No */}
                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">ABHA INFO</h3>
                        <label className="block">ABHA No.</label>
                        <input
                            type="text"
                            name="abha"
                            value={formData.abha}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                            required
                        />
                        <button type="button" onClick={handleGenerateAbha}
                            className={`px-4 py-2 bg-green-500 text-white rounded ${isGenerating ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"}`}
                            disabled={isGenerating}
                        >
                            {isGenerating ? "Generating..." : "Generate New"}
                        </button>
                        <button type="button" onClick={handleVerifyAbha} className={`px-4 py-2 bg-blue-500 text-white rounded ${isVerifying ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`} disabled={isVerifying}>
                            {isVerifying ? "Verifying..." : "Verify"}
                        </button>
                        {/* Verification Status */}
                        {verificationStatus && (
                            <p className={`mt-2 text-sm font-semibold ${verificationStatus === "Verified" ? "text-green-600" : "text-red-600"}`}>
                                {verificationStatus}
                            </p>
                        )}
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
