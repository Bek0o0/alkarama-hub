import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchReports();
    fetchUsers();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch("http://localhost:5000/reports");
      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setReports([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/users");
      const data = await res.json();
      // show only end-user accounts (role === "user")
      setUsers((Array.isArray(data) ? data : []).filter((u) => u.role === "user"));
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchReports();
    } catch (err) {
      console.error("Failed to update report:", err);
    }
  };

  const badge = (statusRaw) => {
    const s = (statusRaw || "").toString().toLowerCase();
    const base = "px-2 py-1 rounded-full text-xs font-semibold";
    if (s === "pending" || s === "in_review") return `${base} bg-yellow-100 text-yellow-800`;
    if (s === "resolved") return `${base} bg-green-100 text-green-700`;
    if (s === "declined") return `${base} bg-red-100 text-red-700`;
    if (s === "public") return `${base} bg-blue-100 text-blue-700`;
    return `${base} bg-gray-100 text-gray-700`;
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="bg-white/90 shadow-xl rounded-xl p-8">
        <h1 className="text-4xl font-extrabold text-primary mb-10 border-b pb-4 text-center">
          Admin Dashboard
        </h1>

        {/* Civic Reports */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-textDark">Civic Reports</h2>
          {reports.length === 0 ? (
            <p className="text-gray-500 italic">No reports submitted yet.</p>
          ) : (
            <div className="space-y-6">
              {reports.map((r) => {
                const s = (r.status || "").toString().toLowerCase();
                return (
                  <div
                    key={r.id}
                    className="bg-white/95 p-6 rounded-xl shadow border-l-4 border-primary"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-primary">{r.title}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(r.createdAt).toLocaleDateString()} • {r.category} •{" "}
                          {r.location || "Undisclosed"}
                        </p>
                        <span className={badge(r.status)}>{s || "unknown"}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => updateStatus(r.id, "resolved")}
                          className={`px-3 py-2 rounded text-white text-sm ${
                            s === "resolved"
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                          disabled={s === "resolved"}
                        >
                          Resolve
                        </button>

                        <button
                          onClick={() => updateStatus(r.id, "public")}
                          className="px-3 py-2 rounded text-white text-sm bg-blue-600 hover:bg-blue-700"
                        >
                          Make Public
                        </button>

                        <button
                          onClick={() => updateStatus(r.id, "declined")}
                          className="px-3 py-2 rounded text-white text-sm bg-red-600 hover:bg-red-700"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Users / Professionals */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-textDark">Users</h2>
          {users.length === 0 ? (
            <p className="text-gray-500 italic">No users registered yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="bg-white/95 p-6 shadow rounded-xl border-l-4 border-green-600"
                >
                  <p className="mb-1">
                    <span className="font-semibold text-textDark">Name:</span>{" "}
                    {u.fullName || "N/A"}
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold text-textDark">Email:</span>{" "}
                    {u.email}
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold text-textDark">Profession:</span>{" "}
                    {u.profession || "N/A"}
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold text-textDark">Country:</span>{" "}
                    {u.country || "N/A"}
                  </p>

                  {/* Verification (safe display) */}
                  <p className="text-sm text-gray-600 mt-1">
                    Verification:{" "}
                    {u?.nationalIdHash ? (
                      <span className="badge badge-green">
                        Provided (••••{u.idLast4 || "----"})
                      </span>
                    ) : (
                      <span className="badge badge-gray">Not provided</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
