import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CreatePatientModal from "./CreatePatientModal";
import ViewPatientModal from "./ViewPatientModal";
import { Patient } from "../types/createPatient";
import { getPatients, deletePatient, updatePatient } from "../apis/patientApi";

interface PatientListProps {
    accessToken: string | null;
}

const PatientList: React.FC<PatientListProps> = ({  accessToken }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [patients, setPatients] = useState<Patient[]>([]);
    
    

        const fetchPatients = async () => {
            
            if (!accessToken) {
                setError("Access token is missing.");
                setLoading(false);
                return;
            }

            try {
                const data: Patient[] = await getPatients(networkId, accessToken);
                setPatients(data);
                toast.success("Patients loaded successfully! ✅");
            } catch (err) {
                setError("Failed to fetch patients.");
                toast.error("Error fetching patients. ❌");
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        fetchPatients(); // ✅ Fetch patients on component mount
      }, [accessToken]);

    const handleDelete = async (patientId: string) => {
        if (!accessToken) {
            toast.error("Access token missing!");
            return;
        }

        // ✅ Show confirmation prompt before deleting
        const isConfirmed = window.confirm("Are you sure you want to delete this patient?");
        if (!isConfirmed) return; // If user clicks "Cancel", stop the function

        try {
            await deletePatient(patientId, accessToken);
            setPatients(patients.filter((p) => p.id !== patientId)); // ✅ Remove patient from list
            toast.success("Patient deleted successfully! ✅");
        } catch (error) {
            alert("Failed to delete patient.");
        }
    };


    // ✅ Handle Edit (Open Edit Mode)
    const handleEdit = (patient: Patient) => {
        setSelectedPatient(patient);
        setEditData(patient); // ✅ Pre-fill data for editing
        setIsEditing(true);
    };

    // ✅ Handle Save Update (PATCH)
    const handleSaveEdit = async () => {
        if (!selectedPatient || !accessToken) return;

        try {
            const updatedPatient = await updatePatient(selectedPatient.id, editData, accessToken);
            setPatients(patients.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))); // ✅ Update state
            setIsEditing(false);
            setSelectedPatient(null);
            toast.success("Patient updated successfully! ✅");
        } catch (error) {
            toast.error("Failed to update patient.");
        }
    };

    const filteredPatients = patients.filter((patient) => {
        const searchLower = searchTerm.toLowerCase();
        const fullName = `${patient.namePrefix} ${patient.nameGiven} ${patient.nameMiddle || ""} ${patient.nameFamily}`.trim().toLowerCase();
        
        return (
            fullName.includes(searchLower) || 
            patient.genderIdentity.toLowerCase().includes(searchLower) || 
            patient.contact.phone.toLowerCase().includes(searchLower) || 
            patient.upid.toLowerCase().includes(searchLower) || 
            patient.mrn.toLowerCase().includes(searchLower)
        );
    });
    


    return (
        <div>
            <div className="flex justify-between items-center">
                <div>
                    <input
                        type="text"
                        placeholder="Search by name, gender, phone, UPID, or MRN"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Create Patient
                    </button>
                </div>
            </div>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Patient List</h2>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && patients.length === 0 && (
                    <p className="text-gray-500">No patients found.</p>
                )}

                {!loading && !error && filteredPatients.length > 0 && (
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">UPID</th>
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Birth Date</th>
                                <th className="border p-2">Gender</th>
                                <th className="border p-2">MRN</th>
                                <th className="border p-2">Language</th>
                                <th className="border p-2">Mobile Number</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map((patient) => (
                                <tr key={patient.upid} className="border">
                                    <td className="border p-2">{patient.upid}</td>
                                    <td className="border p-2">
                                        {`${patient.namePrefix} ${patient.nameGiven} ${patient.nameMiddle || ""} ${patient.nameFamily}`.trim()}
                                    </td>
                                    <td className="border p-2">{patient.birthDate}</td>
                                    <td className="border p-2">{patient.genderIdentity}</td>
                                    <td className="border p-2">{patient.mrn}</td>
                                    <td className="border p-2">{patient.preferredLanguage}</td>
                                    <td className="border p-2">{patient.contact.phone}</td>
                                    <td className="border p-2">
                                        <button onClick={() => setSelectedPatient(patient)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">View</button>
                                        <button onClick={() => handleEdit(patient)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                                        <button onClick={() => handleDelete(patient.id)} className="bg-red-500 text-white px-2 py-1 rounded ml-2">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {selectedPatient && (
                <ViewPatientModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
            )}

            {isModalOpen && (
                <CreatePatientModal
                    accessToken={accessToken}
                    onClose={() => setIsModalOpen(false)}
                    refreshPatients={fetchPatients}
                />
            )}

            {isEditing && selectedPatient && (
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-[500px] overflow-y-auto max-h-[90vh]">
                        <h2 className="text-xl font-semibold mb-4">Edit Patient</h2>

                        <div className="space-y-3">
                            {/* UPID */}
                            <div>
                                <label className="block">UPID</label>
                                <input
                                    type="text"
                                    className="border p-2 w-full rounded"
                                    value={editData.upid || ""}
                                    onChange={(e) => setEditData({ ...editData, upid: e.target.value })}
                                />
                            </div>

                            {/* ABHA Number */}
                            <div>
                                <label className="block">ABHA No.</label>
                                <input
                                    type="text"
                                    className="border p-2 w-full rounded"
                                    value={editData.abha || ""}
                                    onChange={(e) => setEditData({ ...editData, abha: e.target.value })}
                                />
                            </div>

                            {/* MRN */}
                            <div>
                                <label className="block">MRN</label>
                                <input
                                    type="text"
                                    className="border p-2 w-full rounded"
                                    value={editData.mrn || ""}
                                    onChange={(e) => setEditData({ ...editData, mrn: e.target.value })}
                                />
                            </div>

                            {/* Name Fields */}
                            {["namePrefix", "nameGiven", "nameMiddle", "nameFamily", "nameSuffix", "preferredName"].map((field) => (
                                <div key={field}>
                                    <label className="block capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
                                    <input
                                        type="text"
                                        className="border p-2 w-full rounded"
                                        value={editData[field as keyof Patient] as string || ""}
                                        onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                                    />
                                </div>
                            ))}

                            {/* Birth Date */}
                            <div>
                                <label className="block">Birth Date</label>
                                <input
                                    type="date"
                                    className="border p-2 w-full rounded"
                                    value={editData.birthDate ? new Date(editData.birthDate).toISOString().split("T")[0] : ""}
                                    onChange={(e) => setEditData({ ...editData, birthDate: e.target.value })}
                                />
                            </div>

                            {/* Death Date */}
                            <div>
                                <label className="block">Death Date</label>
                                <input
                                    type="date"
                                    className="border p-2 w-full rounded"
                                    value={editData.deathDate ? new Date(editData.deathDate).toISOString().split("T")[0] : ""}
                                    onChange={(e) => setEditData({ ...editData, deathDate: e.target.value || null })}
                                />
                            </div>

                            {/* Gender Identity */}
                            <div>
                                <label className="block">Gender Identity</label>
                                <select
                                    className="border p-2 w-full rounded"
                                    value={editData.genderIdentity || ""}
                                    onChange={(e) => setEditData({ ...editData, genderIdentity: e.target.value as "male" | "female" | "other" })}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Address Fields */}
                            {["line1", "line2", "city", "state", "postalCode", "country"].map((field) => (
                                <div key={field}>
                                    <label className="block capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
                                    <input
                                        type="text"
                                        className="border p-2 w-full rounded"
                                        value={editData.address?.[field as keyof Patient["address"]] || ""}
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                address: { 
                                                    ...editData.address, 
                                                    [field]: e.target.value || "" 
                                                } as Patient["address"],
                                            })
                                        }
                                    />
                                </div>
                            ))}

                            {/* Contact Fields */}
                            {["email", "phone", "mobilePhone"].map((field) => (
                                <div key={field}>
                                    <label className="block capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
                                    <input
                                        type="text"
                                        className="border p-2 w-full rounded"
                                        value={editData.contact?.[field as keyof Patient["contact"]] || ""}
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                contact: { 
                                                    ...editData.contact, 
                                                    [field]: e.target.value || "" 
                                                } as Patient["contact"], // Ensure the type is Patient["contact"]
                                            })
                                        }
                                    />
                                </div>
                            ))}

                            {/* Preferred Pharmacy */}
                            <div>
                                <label className="block">Preferred Pharmacy (UUID)</label>
                                <input
                                    type="text"
                                    className="border p-2 w-full rounded"
                                    value={editData.preferredPharmacy || ""}
                                    onChange={(e) => setEditData({ ...editData, preferredPharmacy: e.target.value })}
                                />
                            </div>

                            {/* Primary Care Provider */}
                            <div>
                                <label className="block">Primary Care Provider (UUID)</label>
                                <input
                                    type="text"
                                    className="border p-2 w-full rounded"
                                    value={editData.primaryCareProvider || ""}
                                    onChange={(e) => setEditData({ ...editData, primaryCareProvider: e.target.value })}
                                />
                            </div>

                            {/* Organ Donor */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={editData.organDonor || false}
                                    onChange={(e) => setEditData({ ...editData, organDonor: e.target.checked })}
                                />
                                <label>Organ Donor</label>
                            </div>

                            {/* Submit & Cancel Buttons */}
                            <div className="flex justify-end mt-4">
                                <button
                                    className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                                    onClick={() => {
                                        setIsEditing(false);  // ✅ Hide edit modal
                                        setSelectedPatient(null); // ✅ Also reset selected patient
                                    }}
                                >
                                    Cancel
                                </button>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSaveEdit}>
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default PatientList;
