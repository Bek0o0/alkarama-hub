import React, { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge";

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
      .then((data) => setReports(data || []))
      .catch(() => setReports([]));
  }, []);

  const filteredReports = reports.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? r.category === categoryFilter : true;
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatDate = (date) => new Date(date).toLocaleDateString();
  const categoryOptions = [...new Set(reports.map((r) => r.category))];
  const statusOptions = [...new Set(reports.map((r) => r.status))];

  return (
    <div className="min-h-screen">
      {/* brand hero */}
      <section className="bg-brandNavy text-white">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center gap-3">
          <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
          <h1 className="text-3xl md:text-4xl font-extrabold">My Submitted Reports</h1>
        </div>
        <div className="h-1 w-full bg-brandGold" />
      </section>

      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="bg-white/95 rounded-2xl shadow-soft border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
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
        </div>

        {filteredReports.length === 0 ? (
          <p className="text-center text-gray-500 italic">No reports match your filters.</p>
        ) : (
          <div className="space-y-6">
            {filteredReports.map((report) => (
              <div key={report.id} className="bg-white/95 border-l-4 border-brandGold rounded-xl shadow-soft p-6">
                <div className="flex justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-brandNavy">{report.title}</h3>
                    <p className="text-sm text-gray-600">
                      <strong>Date:</strong> {formatDate(report.createdAt)} |{" "}
                      <strong>Category:</strong> {report.category} |{" "}
                      <strong>Location:</strong> {report.location || "Undisclosed"}
                    </p>
                  </div>
                  <div className="text-right"><StatusBadge value={report.status} /></div>
                </div>

                <p className="mt-3 text-gray-800">{report.description}</p>

                {report.evidence && (
                  <div className="mt-3">
                    <a
                      href={report.evidence}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brandNavy underline text-sm"
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
    </div>
  );
};

export default MyReports;
