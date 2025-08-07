import React, { useState } from "react";

const mockReports = [
  {
    id: 1,
    title: "Displacement in El Geneina",
    date: "June 2025",
    status: "Pending",
  },
  {
    id: 2,
    title: "Water Shortages in Nyala",
    date: "May 2025",
    status: "Pending",
  },
];

const mockDiaspora = [
  {
    id: 1,
    name: "Sara Ibrahim",
    profession: "Civil Engineer",
    country: "UK",
  },
  {
    id: 2,
    name: "Omar Musa",
    profession: "Doctor",
    country: "Qatar",
  },
];

const AdminDashboard = () => {
  const [reports, setReports] = useState(mockReports);
  const [diaspora, setDiaspora] = useState(mockDiaspora);

  const resolveReport = (id) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Resolved" } : r))
    );
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
          <div className="space-y-6">
            {reports.map((r) => (
              <div
                key={r.id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/95 p-6 rounded-xl shadow border-l-4 border-primary"
              >
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-bold text-primary">{r.title}</h3>
                  <p className="text-sm text-gray-500">{r.date}</p>
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
        </section>

        {/* Diaspora Registrations */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-textDark">Diaspora Registrations</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {diaspora.map((d) => (
              <div
                key={d.id}
                className="bg-white/95 p-6 shadow rounded-xl border-l-4 border-green-600"
              >
                <p className="mb-1">
                  <span className="font-semibold text-textDark">Name:</span> {d.name}
                </p>
                <p className="mb-1">
                  <span className="font-semibold text-textDark">Profession:</span> {d.profession}
                </p>
                <p>
                  <span className="font-semibold text-textDark">Country:</span> {d.country}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
