// src/pages/MyReports.jsx
import React, { useEffect, useState } from "react";

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    fetch(`http://localhost:5000/reports?userEmail=${email}`)
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error("Failed to fetch reports", err));
  }, []);

  const filteredReports = reports.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? r.category === categoryFilter : true;
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatDate = (date) => new Date(date).toLocaleDateString();

  const renderStepper = () => {
    return (
      <div className="flex gap-4 mt-3 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500" /> Submitted
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-400" /> Under Review
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gray-400" /> Resolved / Public / Declined
        </div>
      </div>
    );
  };

  const statusBadge = (statusRaw) => {
    const status = (statusRaw || "").toString().toLowerCase();
    const map = {
      pending: { cls: "bg-yellow-100 text-yellow-700", label: "In Review" },
      in_review: { cls: "bg-yellow-100 text-yellow-700", label: "In Review" },
      resolved: { cls: "bg-green-100 text-green-700", label: "Resolved" },
      declined: { cls: "bg-red-100 text-red-700", label: "Declined" },
      public: { cls: "bg-blue-100 text-blue-700", label: "Posted Publicly" },
    };
    const { cls, label } = map[status] || { cls: "bg-gray-100 text-gray-700", label: "Unknown" };
    return (
      <span className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${cls}`}>
        {label}
      </span>
    );
  };

  const categoryOptions = [...new Set(reports.map((r) => r.category))];
  const statusOptions = [...new Set(reports.map((r) => r.status))];

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">My Submitted Reports</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
        <input
          type="text"
          placeholder="Search by title..."
          className="input w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categoryOptions.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <select
          className="input"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {statusOptions.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </div>

      {filteredReports.length === 0 ? (
        <p className="text-center text-gray-500 italic">No reports match your filters.</p>
      ) : (
        <div className="space-y-6">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white/95 border-l-4 border-primary rounded-xl shadow p-6"
            >
              <div className="flex justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-lg font-bold text-primary">{report.title}</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Date:</strong> {formatDate(report.createdAt)} |{" "}
                    <strong>Category:</strong> {report.category} |{" "}
                    <strong>Location:</strong> {report.location || "Undisclosed"}
                  </p>
                </div>
                <div className="text-right">{statusBadge(report.status)}</div>
              </div>
              <p className="mt-3 text-gray-700">{report.description}</p>

              {renderStepper()}

              {report.evidence && (
                <div className="mt-3">
                  <a
                    href={report.evidence}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Evidence
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReports;
