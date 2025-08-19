import React, { useEffect, useState } from "react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/users/${id}`, {
        method: "DELETE",
      });
      fetchUsers(); // Refresh list after deletion
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const handleToggleRole = async (id, currentRole) => {
    const newRole = currentRole === "user" ? "admin" : "user";

    try {
      await fetch(`http://localhost:5000/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error("Failed to toggle role:", err);
    }
  };

  return (
    <div className="bg-white/90 shadow p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      {users.length === 0 ? (
        <p className="text-gray-500">No registered users.</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="border border-gray-300 rounded-lg p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-semibold">{user.fullName}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-600">Role: {user.role}</p>
              </div>
              <div className="mt-4 md:mt-0 space-x-2">
                <button
                  onClick={() => handleToggleRole(user.id, user.role)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                >
                  Toggle Role
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
