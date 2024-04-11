"use client";

import { changeUserRole } from "@/actions";
import { Toast } from "@/components";
import { User } from "@/interfaces";
import { useState } from "react";

interface Props {
  users: User[];
}

export const UsersTable = ({ users }: Props) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setMessageAlert] = useState("");

  const handleUserRoleChange = async (userId: string, role: string) => {
    const { message } = await changeUserRole(userId, role);
    setMessageAlert(message);
    setShowAlert(true);
  };

  return (
    <>
      {showAlert && (
        <Toast setShowAlert={setShowAlert} message={alertMessage} />
      )}
      <table className="min-w-full">
        <thead className="bg-gray-200 border-b">
          <tr>
            <th
              scope="col"
              className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
            >
              Email
            </th>
            <th
              scope="col"
              className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
            >
              Nombre completo
            </th>
            <th
              scope="col"
              className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
            >
              Rol
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {user.email}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {user.name}
              </td>
              <td className="flex items-center text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                <select
                  className="text-sm w-full py-2 text-gray-900"
                  value={user.role}
                  onChange={(e) =>
                    handleUserRoleChange(user.id, e.target.value)
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
