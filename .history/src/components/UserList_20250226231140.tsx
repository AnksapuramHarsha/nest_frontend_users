// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { getUsersList } from '../apis/api';

// const UserList: React.FC = () => {
//   const { accessToken } = useAuth();
//   const [users, setUsers] = useState<any[]>([]);

//   useEffect(() => {
//     if (accessToken) {
//       const fetchUsers = async () => {
//         try {
//           const usersList = await getUsersList(accessToken);
//           setUsers(usersList);
//         } catch (error) {
//           console.error('Error fetching users list:', error);
//         }
//       };

//       fetchUsers();
//     }
//   }, [accessToken]);

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-semibold mb-4">User List</h2>
//       <table className="min-w-full table-auto border-collapse">
//         <thead>
//           <tr>
//             <th className="border px-4 py-2">ID</th>
//             <th className="border px-4 py-2">Name</th>
//             <th className="border px-4 py-2">Email</th>
//             <th className="border px-4 py-2">Phone</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user) => (
//             <tr key={user.id}>
//               <td className="border px-4 py-2">{user.id}</td>
//               <td className="border px-4 py-2">{user.firstName} {user.lastName}</td>
//               <td className="border px-4 py-2">{user.email}</td>
//               <td className="border px-4 py-2">{user.phone}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default UserList;

import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUsersList } from '../apis/api';

const UserList: React.FC = () => {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (accessToken) {
      const fetchUsers = async () => {
        try {
          const usersList = await getUsersList(accessToken);
          setUsers(usersList);
        } catch (error) {
          console.error('Error fetching users list:', error);
        }
      };

      fetchUsers();
    }
  }, [accessToken]);

  return (
    <div className="min-h-screen mt-bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">User List</h2>
        
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full table-auto border-collapse bg-white text-gray-700">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Phone</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-blue-50">
                  <td className="border px-6 py-4">{user.id}</td>
                  <td className="border px-6 py-4">{user.firstName} {user.lastName}</td>
                  <td className="border px-6 py-4">{user.email}</td>
                  <td className="border px-6 py-4">{user.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
