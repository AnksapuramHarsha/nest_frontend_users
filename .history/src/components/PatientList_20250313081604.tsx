// import React, { useEffect, useState } from "react";
// import { fetchPatientsByNetwork, deletePatient, updatePatient } from "../apis/patientApi";
// import { Patient } from "../types/patient";
// import { useAuth } from "../contexts/AuthContext";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// interface PatientListProps {
//     networkId: string;
// }

// const PatientList: React.FC<PatientListProps> = ({ networkId }) => {
//     const { accessToken } = useAuth();
//     const [patients, setPatients] = useState<Patient[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);
//     const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
//     const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
//     const [editFormData, setEditFormData] = useState<Partial<Patient>>({});
//     const [searchTerm, setSearchTerm] = useState<string>("");


//     useEffect(() => {
//         const loadPatients = async () => {
//             if (!accessToken) {
//                 setError("Unauthorized: No token found.");
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const data = await fetchPatientsByNetwork(networkId, accessToken);
//                 setPatients(data);
//             } catch (err) {
//                 setError("Failed to load patient data.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         loadPatients();
//     }, [networkId, accessToken]);

//     const handleView = (id: string) => {
//         const patient = patients.find((p) => p.id === id);
//         if (patient) {
//             setSelectedPatient(patient);
//             setIsModalOpen(true);
//         } else {
//             setError("Patient not found");
//         }
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setSelectedPatient(null);
//     };

//     const handleDelete = async (id: string) => {
//         if (!accessToken) {
//             toast.error("Unauthorized: No token found.");
//             return;
//         }

//         const confirmDelete = window.confirm("Are you sure you want to delete this patient?");
//         if (!confirmDelete) return;

//         try {
//             const message = await deletePatient(id, accessToken);
//             toast.success(message, { position: "top-right", autoClose: 3000 });

//             // Remove the deleted patient from the list without reloading
//             setPatients((prev) => prev.filter((patient) => patient.id !== id));
//         } catch (error) {
//             toast.error("Error deleting patient: " + error.message, { position: "top-right", autoClose: 3000 });
//         }
//     };

//     const handleEdit = (patient: Patient) => {
//         setSelectedPatient(patient);
//         setEditFormData(patient); // Set current patient data to form
//         setIsEditModalOpen(true);
//     };

//     const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setEditFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleUpdate = async () => {
//         if (!selectedPatient || !accessToken) return;

//         try {
//             const updatedPatient = await updatePatient(selectedPatient.id, editFormData, accessToken);
//             // console.log(updatedPatient)
//             toast.success("Patient updated successfully.", { position: "top-right", autoClose: 3000 });

//             // ✅ Fetch updated data from backend
//             const updatedPatients = await fetchPatientsByNetwork(networkId, accessToken);
//             setPatients(updatedPatients);

//             setIsEditModalOpen(false);
//         } catch (error: any) {
//             toast.error(error.message, { position: "top-right", autoClose: 3000 });
//         }
//     };

//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchTerm(e.target.value.toLowerCase()); // Case-insensitive search
//     };

//     const filteredPatients = patients.filter((patient) =>
//         patient.nameGiven.toLowerCase().includes(searchTerm) ||
//         patient.nameFamily.toLowerCase().includes(searchTerm) ||
//         patient.abha.toLowerCase().includes(searchTerm) ||
//         patient.mrn.toLowerCase().includes(searchTerm) ||
//         patient.contact.phone.toLowerCase().includes(searchTerm)||
//         patient.birthDate.toLowerCase().includes(searchTerm) ||
//         patient.genderIdentity.toLowerCase().includes(searchTerm)
//     );



//     return (
//         <div className="p-6 bg-white shadow-lg rounded-lg">
//             <h2 className="text-2xl font-semibold text-gray-700 mb-4">Patient List</h2>

//             {loading && <p className="text-gray-600">Loading...</p>}
//             {error && <p className="text-red-500">{error}</p>}

//             {!loading && !error && patients.length === 0 && (
//                 <p className="text-gray-600">No patients found.</p>
//             )}

//             {!loading && !error && patients.length > 0 && (
//                 <div className="overflow-x-auto">
//                     <div className="flex justify-between mb-4">
//                         <input
//                             type="text"
//                             placeholder="Search by Name, ABHA, MRN, or Phone..."
//                             value={searchTerm}
//                             onChange={handleSearchChange}
//                             className="p-2 border border-gray-300 rounded w-1/2"
//                         />
//                     </div>
//                     <table className="min-w-full border border-gray-300">
//                         <thead>
//                             <tr className="bg-gray-100">
//                                 <th className="border border-gray-300 px-4 py-2">ID</th>
//                                 <th className="border border-gray-300 px-4 py-2">ABHA</th>
//                                 <th className="border border-gray-300 px-4 py-2">MRN</th>
//                                 <th className="border border-gray-300 px-4 py-2">First Name</th>
//                                 <th className="border border-gray-300 px-4 py-2">Last Name</th>
//                                 <th className="border border-gray-300 px-4 py-2">Birth Date</th>
//                                 <th className="border border-gray-300 px-4 py-2">Gender</th>
//                                 <th className="border border-gray-300 px-4 py-2">Phone</th>
//                                 <th className="border border-gray-300 px-4 py-2">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredPatients.map((patient) => (
//                                 <tr key={patient.id} className="hover:bg-gray-50">
//                                     <td className="border border-gray-300 px-4 py-2">{patient.id}</td>
//                                     <td className="border border-gray-300 px-4 py-2">{patient.abha}</td>
//                                     <td className="border border-gray-300 px-4 py-2">{patient.mrn}</td>
//                                     <td className="border border-gray-300 px-4 py-2">{patient.nameGiven}</td>
//                                     <td className="border border-gray-300 px-4 py-2">{patient.nameFamily}</td>
//                                     <td className="border border-gray-300 px-4 py-2">{patient.birthDate}</td>
//                                     <td className="border border-gray-300 px-4 py-2">{patient.genderIdentity}</td>
//                                     <td className="border border-gray-300 px-4 py-2">{patient.contact.phone}</td>
//                                     <td className="border border-gray-300 px-4 py-2 flex space-x-2">
//                                         <button
//                                             onClick={() => handleView(patient.id)}
//                                             className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
//                                         >
//                                             View
//                                         </button>
//                                         <button
//                                             onClick={() => handleEdit(patient)}
//                                             className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
//                                         >
//                                             Edit
//                                         </button>
//                                         <button
//                                             onClick={() => handleDelete(patient.id)}
//                                             className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                                         >
//                                             Delete
//                                         </button>
//                                     </td>

//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//             {/* {view data of selected patient} */}
//             {isModalOpen && selectedPatient && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-md p-6">
//                     <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
//                         <h2 className="text-xl font-bold mb-4">Patient Details</h2>
//                         <p><strong>ID:</strong> {selectedPatient.id}</p>
//                         <p><strong>ABHA:</strong> {selectedPatient.abha}</p>
//                         <p><strong>MRN:</strong> {selectedPatient.mrn}</p>
//                         <p><strong>Name:</strong> {selectedPatient.nameGiven} {selectedPatient.nameFamily}</p>
//                         <p><strong>Birth Date:</strong> {selectedPatient.birthDate}</p>
//                         <p><strong>Gender:</strong> {selectedPatient.genderIdentity}</p>
//                         <p><strong>Phone:</strong> {selectedPatient.contact.phone}</p>
//                         <button
//                             onClick={closeModal}
//                             className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//                         >
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* Edit Patient Modal */}
//             {isEditModalOpen && selectedPatient && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-md p-6">
//                     <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
//                         <h2 className="text-xl font-bold mb-4">Edit Patient</h2>
//                         <input type="text" name="nameGiven" value={editFormData.nameGiven || ""} onChange={handleEditChange} className="w-full p-2 border rounded mb-4" />
//                         <input type="text" name="nameFamily" value={editFormData.nameFamily || ""} onChange={handleEditChange} className="w-full p-2 border rounded mb-4" />
//                         <input type="text" name="birthDate" value={editFormData.birthDate || ""} onChange={handleEditChange} className="w-full p-2 border rounded mb-4" />
//                         <input type="text" name="genderIdentity" value={editFormData.genderIdentity || ""} onChange={handleEditChange} className="w-full p-2 border rounded mb-4" />
//                         <input type="text" name="contact.phone" value={editFormData.contact?.phone || ""} onChange={handleEditChange} className="w-full p-2 border rounded mb-4" />
//                         <button onClick={handleUpdate} className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
//                         <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-red-500 text-white rounded">Cancel</button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PatientList;

import React, { useEffect, useState } from "react";
import { fetchPatientsByNetwork, deletePatient, updatePatient, createPatient } from "../apis/patientApi";
import { Patient } from "../types/patient";
import { CreatePatient } from "../types/createPatient";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface PatientListProps {
    networkId: string;
}

const PatientList: React.FC<PatientListProps> = ({ networkId }) => {
    const { accessToken } = useAuth();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [editFormData, setEditFormData] = useState<Partial<Patient>>({});
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [newPatientData, setNewPatientData] = useState<Partial<CreatePatient>>({
        networkId,
        createdBy: "",
        updatedBy: "",
        active: true,
    });


    useEffect(() => {
        const loadPatients = async () => {
            if (!accessToken) {
                setError("Unauthorized: No token found.");
                setLoading(false);
                return;
            }

            try {
                const data = await fetchPatientsByNetwork(networkId, accessToken);
                setPatients(data);
            } catch (err) {
                setError("Failed to load patient data.");
            } finally {
                setLoading(false);
            }
        };

        loadPatients();
    }, [networkId, accessToken]);

    const handleView = (id: string) => {
        const patient = patients.find((p) => p.id === id);
        if (patient) {
            setSelectedPatient(patient);
            setIsModalOpen(true);
        } else {
            setError("Patient not found");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPatient(null);
    };

    const handleDelete = async (id: string) => {
        if (!accessToken) {
            toast.error("Unauthorized: No token found.");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this patient?");
        if (!confirmDelete) return;

        try {
            const message = await deletePatient(id, accessToken);
            toast.success(message, { position: "top-right", autoClose: 3000 });

            // Remove the deleted patient from the list without reloading
            setPatients((prev) => prev.filter((patient) => patient.id !== id));
        } catch (error) {
            toast.error("Error deleting patient: " + error.message, { position: "top-right", autoClose: 3000 });
        }
    };

    const handleEdit = (patient: Patient) => {
        setSelectedPatient(patient);
        setEditFormData(patient); // Set current patient data to form
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setEditFormData((prev) => {
            if (name.startsWith("address.")) {
                const addressField = name.split(".")[1];
                return {
                    ...prev,
                    address: {
                        ...prev.address,
                        [addressField]: value,
                    },
                };
            }

            if (name.startsWith("contact.")) {
                const contactField = name.split(".")[1];
                return {
                    ...prev,
                    contact: {
                        ...prev.contact,
                        [contactField]: value,
                    },
                };
            }

            return { ...prev, [name]: value };
        });
    };


    const handleUpdate = async () => {
        if (!selectedPatient || !accessToken) return;

        try {
            const updatedPatient = await updatePatient(selectedPatient.id, editFormData, accessToken);
            // console.log(updatedPatient)
            toast.success("Patient updated successfully.", { position: "top-right", autoClose: 3000 });

            // ✅ Fetch updated data from backend
            const updatedPatients = await fetchPatientsByNetwork(networkId, accessToken);
            setPatients(updatedPatients);

            setIsEditModalOpen(false);
        } catch (error: any) {
            toast.error(error.message, { position: "top-right", autoClose: 3000 });
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase()); // Case-insensitive search
    };

    // const filteredPatients = patients.filter((patient) =>
    //     [patient.nameGiven, patient.nameFamily, patient.abha, patient.mrn, patient.contact.phone]
    //       .some((field) => field?.toLowerCase().includes(searchTerm))
    //   );
    const filteredPatients = patients.filter((patient) =>
        patient.nameGiven.toLowerCase().includes(searchTerm) ||
        patient.nameFamily.toLowerCase().includes(searchTerm) ||
        patient.abha.toLowerCase().includes(searchTerm) ||
        patient.mrn.toLowerCase().includes(searchTerm) ||
        patient.contact.phone.toLowerCase().includes(searchTerm) ||
        patient.birthDate.toLowerCase().includes(searchTerm) ||
        patient.genderIdentity.toLowerCase().includes(searchTerm)
    );

    const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setNewPatientData((prev) => {
            if (name.startsWith("address.")) {
                const addressField = name.split(".")[1];
                return {
                    ...prev,
                    address: {
                        ...prev.address,
                        [addressField]: value,
                    },
                };
            }

            if (name.startsWith("contact.")) {
                const contactField = name.split(".")[1];
                return {
                    ...prev,
                    contact: {
                        ...prev.contact,
                        [contactField]: value,
                    },
                };
            }

            return { ...prev, [name]: value };
        });
    };


    const handleCreatePatient = async () => {
        if (!accessToken) {
            toast.error("Unauthorized: No token found.");
            return;
        }

        try {
            await createPatient(newPatientData as CreatePatient, accessToken);
            toast.success("Patient created successfully.", {
                position: "top-right",
                autoClose: 3000,
            });

            // Fetch updated list
            const updatedPatients = await fetchPatientsByNetwork(networkId, accessToken);
            setPatients(updatedPatients);

            setIsCreateModalOpen(false);
        } catch (error: any) {
            toast.error(error.message, {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };


    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Patient List</h2>

            {loading && <p className="text-gray-600">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && patients.length === 0 && (
                <p className="text-gray-600">No patients found.</p>
            )}

            {!loading && !error && patients.length > 0 && (
                <div className="overflow-x-auto">
                    <div className="flex justify-between mb-4">
                        <input
                            type="text"
                            placeholder="Search by Name, ABHA, MRN, or Phone..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="p-2 border border-gray-300 rounded w-1/2"
                        />
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                        >
                            + Create Patient
                        </button>
                    </div>
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2">ID</th>
                                <th className="border border-gray-300 px-4 py-2">ABHA</th>
                                <th className="border border-gray-300 px-4 py-2">MRN</th>
                                <th className="border border-gray-300 px-4 py-2">First Name</th>
                                <th className="border border-gray-300 px-4 py-2">Last Name</th>
                                <th className="border border-gray-300 px-4 py-2">Birth Date</th>
                                <th className="border border-gray-300 px-4 py-2">Gender</th>
                                <th className="border border-gray-300 px-4 py-2">Phone</th>
                                <th className="border border-gray-300 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-2">{patient.id}</td>
                                    <td className="border border-gray-300 px-4 py-2">{patient.abha}</td>
                                    <td className="border border-gray-300 px-4 py-2">{patient.mrn}</td>
                                    <td className="border border-gray-300 px-4 py-2">{patient.nameGiven}</td>
                                    <td className="border border-gray-300 px-4 py-2">{patient.nameFamily}</td>
                                    <td className="border border-gray-300 px-4 py-2">{patient.birthDate}</td>
                                    <td className="border border-gray-300 px-4 py-2">{patient.genderIdentity}</td>
                                    <td className="border border-gray-300 px-4 py-2">{patient.contact.phone}</td>
                                    <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                                        <button
                                            onClick={() => handleView(patient.id)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleEdit(patient)}
                                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(patient.id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {/* {view data of selected patient} */}
            {isModalOpen && selectedPatient && (
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-md p-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-xl font-bold mb-4 text-center">Patient Details</h2>
                        <p><strong>ID:</strong> {selectedPatient.id}</p>
                        <p><strong>ABHA:</strong> {selectedPatient.abha}</p>
                        <p><strong>MRN:</strong> {selectedPatient.mrn}</p>
                        <p><strong>Name:</strong> {selectedPatient.nameGiven} {selectedPatient.nameFamily}</p>
                        <p><strong>Birth Date:</strong> {selectedPatient.birthDate}</p>
                        <p><strong>Gender:</strong> {selectedPatient.genderIdentity}</p>
                        <p><strong>Phone:</strong> {selectedPatient.contact.phone}</p>
                        <button
                            onClick={closeModal}
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Patient Modal */}
            {isEditModalOpen && selectedPatient && (
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-md p-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-xl font-bold mb-4 text-center">Edit Patient</h2>
                        <input type="text" name="nameGiven" value={editFormData.nameGiven || ""} onChange={handleEditChange} className="w-full p-2 border rounded mb-4" />
                        <input type="text" name="nameFamily" value={editFormData.nameFamily || ""} onChange={handleEditChange} className="w-full p-2 border rounded mb-4" />
                        <input type="text" name="birthDate" value={editFormData.birthDate || ""} onChange={handleEditChange} className="w-full p-2 border rounded mb-4" />
                        <input type="text" name="genderIdentity" value={editFormData.genderIdentity || ""} onChange={handleEditChange} className="w-full p-2 border rounded mb-4" />
                        <input type="text" name="contact.phone" value={editFormData.contact?.phone || ""} onChange={handleEditChange} className="w-full p-2 border rounded mb-4" />
                        <button onClick={handleUpdate} className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
                        <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-red-500 text-white rounded">Cancel</button>
                    </div>
                </div>
            )}

            {isCreateModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-md w-full h-full">
                    <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-300 w-[90vw] max-h-[90vh] overflow-y-auto">
                        {/* Modal Title */}
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Create New Patient</h2>

                        {/* Form Grid */}
                        <div className="grid grid-cols-3 gap-4">
                            {/* Network ID - Full Width */}
                            <div className="col-span-3">
                                <label className="text-gray-700 font-medium">Network ID</label>
                                <input
                                    type="text"
                                    name="networkId"
                                    value={networkId}
                                    disabled
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                                />
                            </div>

                            {/* Identification Details */}
                            <div className="col-span-3 mt-6">
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Identification Details</h3>
                            </div>
                            <div>
                                <label className="text-gray-700">UPID</label>
                                <input type="text" name="upid" onChange={handleCreateInputChange} className="w-full p-2 border border-gray-300 rounded-md transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300" />
                            </div>
                            <div>
                                <label className="text-gray-700">ABHA Number</label>
                                <input type="text" name="abha" onChange={handleCreateInputChange} className="w-full p-2 border border-gray-300 rounded-md transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300" />
                            </div>
                            <div>
                                <label className="text-gray-700">MRN Number</label>
                                <input type="text" name="mrn" onChange={handleCreateInputChange} className="w-full p-2 border border-gray-300 rounded-md transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300" />
                            </div>
                            <div>
                                <label className="text-gray-700">Aadhar Number</label>
                                <input type="text" name="identifier.aadhar" onChange={handleCreateInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="text-gray-700">PAN Number</label>
                                <input type="text" name="identifier.pan" onChange={handleCreateInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>

                            {/* Personal Details */}
                            <div className="col-span-3 mt-6">
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Details</h3>
                            </div>
                            <div>
                                <label className="text-gray-700">Name Prefix</label>
                                <input type="text" name="namePrefix" onChange={handleCreateInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="text-gray-700">First Name</label>
                                <input type="text" name="nameGiven" onChange={handleCreateInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="text-gray-700">Middle Name</label>
                                <input type="text" name="nameMiddle" onChange={handleCreateInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="text-gray-700">Last Name</label>
                                <input type="text" name="nameFamily" onChange={handleCreateInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>

                            {/* Date of Birth & Gender */}
                            <div>
                                <label className="text-gray-700">Birth Date</label>
                                <input type="date" name="birthDate" onChange={handleCreateInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="text-gray-700">Gender Identity</label>
                                <input type="text" name="genderIdentity" onChange={handleCreateInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="text-gray-700">Address Line 1</label>
                                <input type="text" name="address.line1" onChange={handleCreateInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="text-gray-700">City</label>
                                <input type="text" name="address.city" onChange={handleCreateInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="text-gray-700">State</label>
                                <input type="text" name="address.state" onChange={handleCreateInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="text-gray-700">Postal Code</label>
                                <input type="text" name="address.postalCode" onChange={handleCreateInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>

                            {/* Contact Details */}
                            <div>
                                <label className="text-gray-700">Email</label>
                                <input type="email" name="contact.email" onChange={handleCreateInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="text-gray-700">Phone</label>
                                <input type="text" name="contact.phone" onChange={handleCreateInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>

                            {/* Record Information */}
                            <div className="col-span-3 mt-6">
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Record Information</h3>
                            </div>
                            <div>
                                <label className="text-gray-700">Created By</label>
                                <input type="text" name="createdBy" onChange={handleCreateInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="text-gray-700">Updated By</label>
                                <input type="text" name="updatedBy" onChange={handleCreateInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>

                            {/* Active Status */}
                            <div>
                                <label className="text-gray-700">Active Status</label>
                                <select name="active" onChange={handleCreateInputChange} className="w-full p-2 border border-gray-300 rounded-md">
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end space-x-3 mt-6">
                            <button className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Create</button>
                            <button onClick={() => setIsCreateModalOpen(false)} className="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Cancel</button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default PatientList;



