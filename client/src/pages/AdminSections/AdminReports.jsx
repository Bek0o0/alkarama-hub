import React, { useEffect, useState } from "react";

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
                    <strong>Submitted by:</strong>{" "}
                    {report.userEmail || "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Category:</strong> {report.category}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Location:</strong> {report.location || "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <div className="mt-1">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        report.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : report.status === "Declined"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                  <div className="mt-3 space-x-2">
                    <button
                      onClick={() => updateStatus(report.id, "Resolved")}
                      className="text-green-700 text-sm hover:underline"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(report.id, "Declined")}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mt-2">{report.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReports;
