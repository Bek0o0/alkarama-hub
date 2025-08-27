import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const ROLES = ["user", "admin"];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await fetch(`http://localhost:5000/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to update role:", err);
      alert("Error updating role.");
    }
  };

  const handleVerifiedToggle = async (id, verified) => {
    try {
      await fetch(`http://localhost:5000/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified }),
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to update verification:", err);
      alert("Error updating verification.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await fetch(`http://localhost:5000/users/${id}`, { method: "DELETE" });
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Error deleting user.");
    }
  };

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        search.trim().length === 0
          ? true
          : (u.fullName || "")
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            (u.email || "").toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter ? (u.role || "user") === roleFilter : true;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="bg-white/90 shadow-soft rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
          <h1 className="text-3xl font-extrabold text-brandNavy">Manage Users</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">
          <input
            className="input md:w-1/2"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-3">
            <select
              className="input"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All roles</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <button className="btn-outline" onClick={() => { setSearch(""); setRoleFilter(""); }}>
              Clear
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600 italic">Loading users…</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 italic">No users match your filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-gray-50">
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Verified</th>
                  <th>Profession</th>
                  <th>Expertise</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="font-semibold text-brandNavy">
                      {u?.id ? (
                        <Link
                          to={`/admin/users/${encodeURIComponent(u.id)}`}
                          className="text-brandBlue hover:underline"
                          title="View user profile"
                        >
                          {u.fullName || "—"}
                        </Link>
                      ) : (
                        u.fullName || "—"
                      )}
                    </td>
                    <td>
                      {u?.email ? (
                        <Link
                          to={`/admin/users/${encodeURIComponent(u.email)}`}
                          className="text-brandBlue hover:underline"
                          title="View user profile"
                        >
                          {u.email}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <select
                        className="input"
                        value={u.role || "user"}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={!!u.verified}
                          onChange={(e) => handleVerifiedToggle(u.id, e.target.checked)}
                        />
                        <span className="text-sm">{u.verified ? "Yes" : "No"}</span>
                      </label>
                    </td>
                    <td>{u.profession || "—"}</td>
                    <td>
                      {Array.isArray(u.expertise) && u.expertise.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {u.expertise.map((t) => (
                            <span
                              key={t}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">None</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-600 hover:underline text-sm"
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
      </div>
    </div>
  );
};

export default AdminUsers;
