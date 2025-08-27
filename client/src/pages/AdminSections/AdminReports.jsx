import React, { useEffect, useState } from "react";
import StatusBadge from "../../components/StatusBadge";

const STATUS_OPTIONS = ["Pending", "Resolved", "Declined", "Public"];

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/reports");
      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load reports:", err);
      setReports([]);
    } finally {
      setLoading(false);
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
      console.error("Failed to update status:", err);
      alert("Error updating status.");
    }
  };

  const filtered = reports.filter((r) => {
    const matchesStatus = statusFilter ? (r.status || "Pending") === statusFilter : true;
    const matchesSearch =
      search.trim().length === 0
        ? true
        : (r.title || "").toLowerCase().includes(search.toLowerCase()) ||
          (r.category || "").toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="bg-white/90 shadow-soft rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
          <h1 className="text-3xl font-extrabold text-brandNavy">Civic Reports</h1>
        </div>

        {/* Filters (no logic change, just UI sugar) */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title/category…"
            className="input md:w-1/2"
          />
          <div className="flex gap-3">
            <select
              className="input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button className="btn-outline" onClick={() => { setSearch(""); setStatusFilter(""); }}>
              Clear
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600 italic">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 italic">No reports match your filters.</p>
        ) : (
          <div className="space-y-6">
            {filtered.map((report) => {
              const created = report.createdAt
                ? new Date(report.createdAt).toLocaleDateString()
                : "—";
              const evidence = report.evidence;

              return (
                <div
                  key={report.id}
                  className="bg-white/95 border-l-4 border-brandGold rounded-xl shadow-soft p-6"
                >
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <div className="min-w-[240px]">
                      <h3 className="text-lg font-bold text-brandNavy">{report.title}</h3>
                      <p className="text-sm text-gray-600">
                        <strong>Submitted:</strong> {created} &middot{" "}
                        <strong>By:</strong> {report.userEmail || "Anonymous"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Category:</strong> {report.category} &middot{" "}
                        <strong>Location:</strong> {report.location || "N/A"}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="mb-2">
                        <StatusBadge value={report.status || "Pending"} />
                      </div>

                      {/* Keep your existing approve/decline behavior, plus a safe dropdown */}
                      <div className="flex gap-2 justify-end">
                        <select
                          className="input w-40"
                          value={report.status || "Pending"}
                          onChange={(e) => updateStatus(report.id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-gray-800">{report.description}</p>

                  {/* Evidence (file or link) */}
                  {evidence && (
                    <div className="mt-3">
                      <a
                        href={evidence}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brandBlue hover:underline text-sm"
                      >
                        View Evidence
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
