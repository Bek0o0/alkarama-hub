// src/pages/AdminSections/AdminReports.jsx
import React, { useEffect, useState } from "react";
import { generatePublicPost } from "../../utils/postToPublicFeed";

const statusOptions = {
  pending: "Awaiting review by administrators.",
  in_review: "This case is currently under internal investigation.",
  evidence_needed: "Additional evidence is required to proceed.",
  sent_to_court: "This case has been forwarded to the court system.",
  declined: "This report has been declined due to insufficient evidence.",
  resolved: "The issue reported has been resolved.",
  public: "This report has been published for public awareness."
};

const AdminReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch("http://localhost:5000/reports");
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error("Failed to load reports:", err);
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
    }
  };

  const postToPublic = async (report) => {
    const updated = {
      ...report,
      status: "public",
      publicPost: generatePublicPost(report),
    };

    try {
      await fetch(`http://localhost:5000/reports/${report.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      alert("Report posted to public feed.");
      fetchReports();
    } catch (err) {
      console.error("Failed to post to public:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-primary mb-6 text-center">All Submitted Reports</h1>

      {reports.length === 0 ? (
        <p className="text-center text-gray-500 italic">No reports found.</p>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="border-l-4 border-primary bg-white p-5 shadow rounded-xl"
            >
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-primary">{report.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Submitted by:</strong> {report.userEmail || "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Category:</strong> {report.category}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Location:</strong> {report.location || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Status:</strong> {report.status}
                    <br />
                    <span className="text-xs italic text-gray-500">
                      {statusOptions[report.status] || "No description available"}
                    </span>
                  </p>
                </div>

                <div className="text-right">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Change Status:</label>
                  <select
                    value={report.status}
                    onChange={(e) => updateStatus(report.id, e.target.value)}
                    className="input"
                  >
                    {Object.keys(statusOptions).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  {report.status !== "public" && (
                    <button
                      onClick={() => postToPublic(report)}
                      className="text-blue-600 text-sm mt-2 hover:underline"
                    >
                      Post to Public
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-700 mt-3">{report.description}</p>

              {report.evidence && (
                <div className="mt-2">
                  <a
                    href={`/uploads/${report.evidence}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
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

export default AdminReports;
