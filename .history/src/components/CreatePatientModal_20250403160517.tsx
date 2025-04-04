import React, { useState } from "react";
import { createPatient } from "../apis/patientApi";
import { Patient } from "../types/createPatient";

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
        emergencyContacts:{ name: "", relationship: "", phone: "" },
        active: true,
        preferences: { contactMethod: "", appointmentReminders: false },
        bloodType: "",
        organDonor: false,
        advanceDirectives: { livingWill: false, powerOfAttorney: "" },
        statusId: 0,
    });

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    //     const { name, value } = e.target;
    //     setFormData((prev) => ({
    //         ...prev,
    //         [name]: value === "true" ? true : value === "false" ? false : value,
    //         // [name]: name === "statusId" ? Number(value) : value === "true" ? true : value === "false" ? false : value,
    //     }));
    // };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        console.log(`Changing ${name} to ${value}, type: ${typeof value}`);
        setFormData((prev) => {
            let newValue;
            if (name === "statusId") {
                newValue = value === "" ? 0 : Number(value); // Handle empty input
                if (isNaN(newValue)) return prev; // Prevent NaN
            } else {
                newValue = value === "true" ? true : value === "false" ? false : value;
            }
            // console.log(`Setting ${name} to ${newValue}, type: ${typeof newValue}`);
            return {
                ...prev,
                [name]: newValue,
            };
        });
    };

    const handleNestedChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        nestedKey: keyof Patient
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [nestedKey]: {
                ...(typeof prev[nestedKey] === "object" && prev[nestedKey] !== null ? prev[nestedKey] : {}),
                [name]: value === "true" ? true : value === "false" ? false : value,
            },
        }));
    };

    const handleEmergencyContactChange = (
        field: keyof { name: string; relationship: string; phone: string },
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            emergencyContacts: {
                ...prev.emergencyContacts,
                [field]: value,
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
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Identifiers</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">Aadhar:</label>
                            <input
                                type="text"
                                name="aadhar"
                                value={formData.identifier.aadhar}
                                onChange={(e) => handleNestedChange(e, "identifier")}
                                className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                            />

                            <label className="block">PAN:</label>
                            <input
                                type="text"
                                name="pan"
                                value={formData.identifier.pan}
                                onChange={(e) => handleNestedChange(e, "identifier")}
                                className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                            />
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

                            <label className="block">Preffered Language:</label>
                            <input type="text" name="preferredLanguage" value={formData.preferredLanguage} onChange={handleChange} />

                            <label className="block">Interpreter Required:</label>
                            <select name="interpreterRequired" value={formData.interpreterRequired ? "true" : "false"} onChange={handleChange}>
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>

                            <label className="block">Marital Status:</label>
                            <input type="text" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} />

                            <label className="block">Blood Type:</label>
                            <input type="text" name="bloodType" value={formData.bloodType} onChange={handleChange} />

                            <label className="block">Organ Donor:</label>
                            <select name="organDonor" value={formData.organDonor ? "true" : "false"} onChange={handleChange}>
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>

                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Address</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">Address Line 1:</label>
                            <input type="text" name="line1" value={formData.address.line1} onChange={(e) => handleNestedChange(e, "address")} />

                            <label className="block">Address Line 2:</label>
                            <input type="text" name="line2" value={formData.address.line2} onChange={(e) => handleNestedChange(e, "address")} />

                            <label className="block">City:</label>
                            <input type="text" name="city" value={formData.address.city} onChange={(e) => handleNestedChange(e, "address")} />

                            <label className="block">State:</label>
                            <input type="text" name="state" value={formData.address.state} onChange={(e) => handleNestedChange(e, "address")} />

                            <label className="block">Postal Code:</label>
                            <input type="text" name="postalCode" value={formData.address.postalCode} onChange={(e) => handleNestedChange(e, "address")} />

                            <label className="block">Country:</label>
                            <input type="text" name="country" value={formData.address.country} onChange={(e) => handleNestedChange(e, "address")} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Contact Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">Email:</label>
                            <input type="email" name="email" value={formData.contact.email} onChange={(e) => handleNestedChange(e, "contact")} />

                            <label className="block">Phone:</label>
                            <input type="text" name="phone" value={formData.contact.phone} onChange={(e) => handleNestedChange(e, "contact")} />

                            <label className="block">Mobile Phone:</label>
                            <input type="text" name="mobilePhone" value={formData.contact.mobilePhone} onChange={(e) => handleNestedChange(e, "contact")} />
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
                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Preferences</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">Contact Method:</label>
                            <input type="text" name="contactMethod" value={formData.preferences.contactMethod} onChange={(e) => handleNestedChange(e, "preferences")} />

                            <label className="block">Appointment Reminders:</label>
                            <select name="appointmentReminders" value={formData.preferences.appointmentReminders ? "true" : "false"} onChange={(e) => handleNestedChange(e, "preferences")}>
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Advance Directives</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">Living Will:</label>
                            <select name="livingWill" value={formData.advanceDirectives.livingWill ? "true" : "false"} onChange={(e) => handleNestedChange(e, "advanceDirectives")}>
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>

                            <label className="block">Power of Attorney:</label>
                            <input type="text" name="powerOfAttorney" value={formData.advanceDirectives.powerOfAttorney} onChange={(e) => handleNestedChange(e, "advanceDirectives")} />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Additional Demographics and Status</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block">Ethnicity:</label>
                                <input
                                    type="text"
                                    name="ethnicity"
                                    value={formData.ethnicity}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                                />
                            </div>
                            <div>
                                <label className="block">Race:</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.race.category}
                                    onChange={(e) => handleNestedChange(e, "race")}
                                    className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                                />
                            </div>
                            <div>
                                <label className="block">Active:</label>
                                <select
                                    name="active"
                                    value={formData.active ? "true" : "false"}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                                >
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                </select>
                            </div>
                            <div>
                                <label className="block">Status ID:</label>
                                <input
                                    type="number"
                                    name="statusId"
                                    value={formData.statusId}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                                />
                            </div>
                        </div>
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
