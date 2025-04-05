import React, { useState } from "react";
import { createPatient } from "../apis/patientApi";
import { Patient } from "../types/createPatient";
import { toast } from "react-toastify";

interface CreatePatientModalProps {
    accessToken: string | null;
    onClose: () => void;
    onUpdate?: () => void;
}

const CreatePatientModal: React.FC<CreatePatientModalProps> = ({ accessToken, onClose, onUpdate }) => {
    const [formData, setFormData] = useState<Patient>({
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
        race: { category: "" },
        ethnicity: "",
        emergencyContacts: { name: "", relationship: "", phone: "" },
        active: true,
        preferences: { contactMethod: "", appointmentReminders: false },
        bloodType: "",
        organDonor: false,
        advanceDirectives: { livingWill: false, powerOfAttorney: "" },
        statusId: 0,
        networkId: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

    const validate = () => {
        const tempErrors: { [key: string]: string } = {};

        if (!formData.abha) tempErrors.abha = "ABHA is required";
        if (!formData.mrn) tempErrors.mrn = "MRN is required";
        if (!formData.nameGiven) tempErrors.nameGiven = "First Name is required";
        if (!formData.contact.email) {
            tempErrors["contact.email"] = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.contact.email)) {
            tempErrors["contact.email"] = "Email is invalid";
        }
        if (formData.birthDate) {
            const birthDate = new Date(formData.birthDate);
            if (birthDate > new Date()) {
                tempErrors.birthDate = "Birth date cannot be in the future";
            }
        }
        if (formData.contact.mobilePhone && !/^\d{10}$/.test(formData.contact.mobilePhone)) {
            tempErrors["contact.mobilePhone"] = "Mobile phone must be 10 digits";
        }
        if (formData.identifier.aadhar && !/^\d{12}$/.test(formData.identifier.aadhar)) {
            tempErrors["identifier.aadhar"] = "Aadhar must be 12 digits";
        }
        if (formData.identifier.pan) {
            const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
            if (!panRegex.test(formData.identifier.pan)) {
                tempErrors["identifier.pan"] = "PAN must be 10 characters (e.g., ABCDE1234F)";
            }
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0; // Return true if no errors
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Please fix the errors in the form.");
            return;
        }
        try {
            if (accessToken) {
                const response = await createPatient(formData, accessToken);
                console.log("Patient created successfully", response);
                toast.success("Patient created successfully!");
            } else {
                console.error("Access token is null");
                toast.error("Access token is missing!");
            }
            if (onUpdate) {
                onUpdate();
            }
            onClose();
        } catch (error) {
            console.error("Failed to create patient:", error);
            toast.error("Failed to create patient. Please try again.");
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
                                />
                                {errors.abha && <p className="text-red-500 text-sm">{errors.abha}</p>}
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
                                />
                                {errors.mrn && <p className="text-red-500 text-sm">{errors.mrn}</p>}
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Identifiers</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block">Aadhar:</label>
                                <input
                                    type="text"
                                    name="aadhar"
                                    value={formData.identifier.aadhar}
                                    onChange={(e) => handleNestedChange(e, "identifier")}
                                    className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                                />
                                {errors["identifier.aadhar"] && <p className="text-red-500 text-sm">{errors["identifier.aadhar"]}</p>}
                            </div>
                            <div>
                                <label className="block">PAN:</label>
                                <input
                                    type="text"
                                    name="pan"
                                    value={formData.identifier.pan}
                                    onChange={(e) => handleNestedChange(e, "identifier")}
                                    className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                                />
                                {errors["identifier.pan"] && <p className="text-red-500 text-sm">{errors["identifier.pan"]}</p>}
                            </div>

                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Personal Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block">Name Prefix:</label>
                                <select name="namePrefix" value={formData.genderIdentity} className="w-full p-2 border border-gray-300 rounded" onChange={handleChange}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                <input type="text" name="namePrefix" value={formData.namePrefix} className="w-full p-2 border border-gray-300 rounded" onChange={handleChange} />
                            </div>

                            <div>
                                <label className="block">First Name:</label>
                                <input type="text" name="nameGiven" value={formData.nameGiven} className="w-full p-2 border border-gray-300 rounded" onChange={handleChange} />
                                {errors.nameGiven && <p className="text-red-500 text-sm">{errors.nameGiven}</p>}
                            </div>
                            <div>
                                <label className="block">Middle Name:</label>
                                <input type="text" name="nameMiddle" value={formData.nameMiddle} className="w-full p-2 border border-gray-300 rounded" onChange={handleChange} />
                            </div>

                            <div>

                                <label className="block">Last Name:</label>
                                <input type="text" name="nameFamily" value={formData.nameFamily} className="w-full p-2 border border-gray-300 rounded" onChange={handleChange} />
                            </div>

                            <div>

                                <label className="block">Name Suffix:</label>
                                <input type="text" name="nameSuffix" value={formData.nameSuffix} className="w-full p-2 border border-gray-300 rounded" onChange={handleChange} />
                            </div>

                            <div>

                                <label className="block">Preferred Name:</label>
                                <input type="text" name="preferredName" value={formData.preferredName} className="w-full p-2 border border-gray-300 rounded" onChange={handleChange} />
                            </div>

                            <div>

                                <label className="block">Birth Date:</label>
                                <input type="date" name="birthDate" value={formData.birthDate} className="w-full p-2 border border-gray-300 rounded" onChange={handleChange} />
                                {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate}</p>}
                            </div>

                            <div>
                                <label className="block">Gender Identity:</label>
                                <select name="genderIdentity" value={formData.genderIdentity} className="w-full p-2 border border-gray-300 rounded" onChange={handleChange}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block">Biological Sex:</label>
                                <select name="biologicalSex" value={formData.biologicalSex} className="w-full p-2 border border-gray-300 rounded" onChange={handleChange}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>

                                <label>Preferred Pronouns:</label>
                                <input type="text" name="preferredPronouns" value={formData.preferredPronouns} className="w-full p-2 border border-gray-300 rounded" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block">Preffered Language:</label>
                                <input type="text" name="preferredLanguage" value={formData.preferredLanguage} className="w-full p-2 border border-gray-300 rounded" onChange={handleChange} />
                            </div>
                            <div>

                                <label className="block">Interpreter Required:</label>
                                <select name="interpreterRequired" value={formData.interpreterRequired ? "true" : "false"} className="w-full p-2 border border-gray-300 rounded" onChange={handleChange}>
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                </select>
                            </div>
                            <div>
                                <label className="block">Marital Status:</label>
                                <input type="text" name="maritalStatus" value={formData.maritalStatus} className="w-full p-2 border border-gray-300 rounded" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block">Blood Type:</label>
                                <input type="text" name="bloodType" value={formData.bloodType} className="w-full p-2 border border-gray-300 rounded" onChange={handleChange} />
                            </div>
                            <div>

                                <label className="block">Organ Donor:</label>
                                <select name="organDonor" value={formData.organDonor ? "true" : "false"} className="w-full p-2 border border-gray-300 rounded" onChange={handleChange}>
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                </select>
                            </div>

                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Address</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block">Address Line 1:</label>
                                <input type="text" name="line1" value={formData.address.line1} className="w-full p-2 border border-gray-300 rounded" onChange={(e) => handleNestedChange(e, "address")} />

                            </div>
                            <div>
                                <label className="block">Address Line 2:</label>
                                <input type="text" name="line2" value={formData.address.line2} className="w-full p-2 border border-gray-300 rounded" onChange={(e) => handleNestedChange(e, "address")} />

                            </div>
                            <div>
                                <label className="block">City:</label>
                                <input type="text" name="city" value={formData.address.city} className="w-full p-2 border border-gray-300 rounded" onChange={(e) => handleNestedChange(e, "address")} />

                            </div>
                            <div>
                                <label className="block">State:</label>
                                <input type="text" name="state" value={formData.address.state} className="w-full p-2 border border-gray-300 rounded" onChange={(e) => handleNestedChange(e, "address")} />

                            </div>
                            <div>
                                <label className="block">Postal Code:</label>
                                <input type="text" name="postalCode" value={formData.address.postalCode} className="w-full p-2 border border-gray-300 rounded" onChange={(e) => handleNestedChange(e, "address")} />

                            </div>
                            <div>
                                <label className="block">Country:</label>
                                <input type="text" name="country" value={formData.address.country} className="w-full p-2 border border-gray-300 rounded" onChange={(e) => handleNestedChange(e, "address")} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Contact Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block">Email:</label>
                                <input type="email" name="email" value={formData.contact.email} className="w-full p-2 border border-gray-300 rounded" onChange={(e) => handleNestedChange(e, "contact")} />
                                {errors["contact.email"] && <p className="text-red-500 text-sm">{errors["contact.email"]}</p>}
                            </div>
                            <div>
                                <label className="block">Phone:</label>
                                <input type="text" name="phone" value={formData.contact.phone} className="w-full p-2 border border-gray-300 rounded" onChange={(e) => handleNestedChange(e, "contact")} />
                            </div>
                            <div>
                                <label className="block">Mobile Phone:</label>
                                <input type="text" name="mobilePhone" value={formData.contact.mobilePhone} className="w-full p-2 border border-gray-300 rounded" onChange={(e) => handleNestedChange(e, "contact")} />
                                {errors["contact.mobilePhone"] && <p className="text-red-500 text-sm">{errors["contact.mobilePhone"]}</p>}
                            </div>


                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Emergency Contact</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="emergencyName" className="block">Name:</label>
                                <input
                                    id="emergencyName"
                                    type="text"
                                    placeholder="Name"
                                    value={formData.emergencyContacts.name}
                                    onChange={(e) => handleEmergencyContactChange("name", e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                                />
                            </div>
                            <div>
                                <label htmlFor="emergencyRelationship" className="block">Relationship:</label>
                                <input
                                    id="emergencyRelationship"
                                    type="text"
                                    placeholder="Relationship"
                                    value={formData.emergencyContacts.relationship}
                                    onChange={(e) => handleEmergencyContactChange("relationship", e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                                />
                            </div>
                            <div>
                                <label htmlFor="emergencyPhone" className="block">Phone:</label>
                                <input
                                    id="emergencyPhone"
                                    type="text"
                                    placeholder="Phone"
                                    value={formData.emergencyContacts.phone}
                                    onChange={(e) => handleEmergencyContactChange("phone", e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Preferences</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">Contact Method:</label>
                            <input type="text" name="contactMethod" value={formData.preferences.contactMethod} className="w-full p-2 border border-gray-300 rounded" onChange={(e) => handleNestedChange(e, "preferences")} />

                            <label className="block">Appointment Reminders:</label>
                            <select name="appointmentReminders" value={formData.preferences.appointmentReminders ? "true" : "false"} className="w-full p-2 border border-gray-300 rounded" onChange={(e) => handleNestedChange(e, "preferences")}>
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Advance Directives</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">Living Will:</label>
                            <select name="livingWill" value={formData.advanceDirectives.livingWill ? "true" : "false"} className="w-full p-2 border border-gray-300 rounded" onChange={(e) => handleNestedChange(e, "advanceDirectives")}>
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>

                            <label className="block">Power of Attorney:</label>
                            <input type="text" name="powerOfAttorney" value={formData.advanceDirectives.powerOfAttorney} className="w-full p-2 border border-gray-300 rounded" onChange={(e) => handleNestedChange(e, "advanceDirectives")} />
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
