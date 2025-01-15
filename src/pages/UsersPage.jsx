import React, { useEffect, useState } from 'react';
import { useAuth } from "react-oidc-context";
import Navbar from "../components/Navbar";


const UsersPage = () => {
  const auth = useAuth();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", role: "regular", password: "" });
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  console.log(auth);

  useEffect(() => {
    if(!auth.isLoading){
      fetchUsers();
    }
  }, [auth]);

  const fetchUsers = async () => {
    try {
      console.log("the_auth", auth);
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
      setError(error.message);
    }
    
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.user?.id_token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to add user");

      setForm({ username: "", email: "", role: "regular", password: "" });
      fetchUsers();
    } catch (error) {
      fetchUsers();
      setError(error.message);
    }
  };

  if (auth.user?.profile?.["cognito:groups"][0] !== 'admin') {
    return <p className="text-red-500">Access Denied. Admins Only.</p>;
  }

  return (
    <>
    <Navbar />
        <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        {error && <p className="text-red-500">{error}</p>}

        <table className="w-full border-collapse border border-gray-300">
            <thead>
            <tr className="bg-gray-100">
                <th className="border p-2">Username</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Status</th>
            </tr>
            </thead>
            <tbody>
            {users.map((user) => (
                <tr key={user?.attribute?.email} className="border">
                <td className="p-2">{user.username}</td>
                <td className="p-2">{user?.attributes?.email}</td>
                <td className="p-2">{user?.status}</td>
                </tr>
            ))}
            </tbody>
        </table>

        <h2 className="text-xl font-bold mt-6">Invite User</h2>
        <form onSubmit={handleInviteUser} className="mt-4 space-y-2">
            <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="border p-2 w-full"
            required
            />
            <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border p-2 w-full"
            required
            />
            <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="border p-2 w-full"
            >
            <option value="regular">Regular</option>
            <option value="admin">Admin</option>
            </select>
            <input
            type="password"
            placeholder="Temporary Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border p-2 w-full"
            required
            />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
            Invite User
            </button>
        </form>
        </div>
    </>

  );
};

export default UsersPage;
