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
      setReports(data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/users");
      const data = await res.json();
      // Only show regular users (formerly diaspora or citizens)
      const filtered = data.filter((u) => u.role === "user");
      setUsers(filtered);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const resolveReport = async (id) => {
    const report = reports.find((r) => r.id === id);
    if (!report || report.status === "Resolved") return;

    try {
      await fetch(`http://localhost:5000/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Resolved" }),
      });
      fetchReports(); // Refresh
    } catch (err) {
      console.error("Failed to update report:", err);
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded-full text-xs font-semibold";
    if (status === "Pending") return `${base} bg-yellow-100 text-yellow-800`;
    if (status === "Resolved") return `${base} bg-green-100 text-green-700`;
    return base;
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
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/95 p-6 rounded-xl shadow border-l-4 border-primary"
                >
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-bold text-primary">{r.title}</h3>
                    <p className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</p>
                    <span className={getStatusBadge(r.status)}>{r.status}</span>
                  </div>
                  <button
                    onClick={() => resolveReport(r.id)}
                    className={`px-4 py-2 rounded text-sm font-semibold transition duration-300 ${
                      r.status === "Resolved"
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                    disabled={r.status === "Resolved"}
                  >
                    {r.status === "Resolved" ? "Resolved" : "Mark as Resolved"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* User Registrations */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-textDark">User Registrations</h2>
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
                    <span className="font-semibold text-textDark">Name:</span> {u.fullName}
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold text-textDark">Profession:</span> {u.profession || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-textDark">Country:</span> {u.country || "N/A"}
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
