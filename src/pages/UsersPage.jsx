import React, { useEffect, useState } from 'react';
import { useAuth } from "react-oidc-context";
import Navbar from "../components/Navbar";
import DataTable from "../components/DataTable";
import InviteUserModal from "../components/InviteUserModal";
import Toast from "../components/Toast";

const UsersPage = () => {
  const auth = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const columns = [
    { key: 'username', label: 'Username' },
    { key: 'attributes.email', label: 'Email' },
    { key: 'status', label: 'Status' }
  ];

  useEffect(() => {
    if(!auth.isLoading) {
      fetchUsers();
    }
  }, [auth]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.user?.id_token}`,
          "Content-Type": "application/json",
        },
      });
    
      if (!response.ok) throw new Error("Failed to fetch users");
    
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteUser = async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.user?.id_token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add user");

      showToast('User invited successfully', 'success');
      fetchUsers();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  if (auth.user?.profile?.["cognito:groups"][0] !== 'admin') {
    return <p className="text-red-500">Access Denied. Admins Only.</p>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Users</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Invite User
          </button>
        </div>

        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
        />

        <InviteUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleInviteUser}
        />

        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </div>
    </>
  );
};

export default UsersPage;