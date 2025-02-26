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
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">User List</h2>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.id}</td>
              <td className="border px-4 py-2">{user.firstName} {user.lastName}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
