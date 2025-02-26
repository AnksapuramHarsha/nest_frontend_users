import React, { useEffect, useState } from 'react';
import { getUserList } from '../api/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface UserListProps {
  accessToken: string;
}

const UserList: React.FC<UserListProps> = ({ accessToken }) => {
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const data = await getUserList(accessToken);
        setUserList(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchUserList();
  }, [accessToken]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">User List</h2>
      <table className="mt-4 w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">First Name</th>
            <th className="border px-4 py-2">Last Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.firstName}</td>
              <td className="border px-4 py-2">{user.lastName}</td>
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
