import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");

    if (!email) {
      alert("Please log in to view your reports.");
      navigate("/login");
      return;
    }

    const fetchReports = async () => {
      try {
        const res = await fetch(`http://localhost:5000/reports?userEmail=${email}`);
        const data = await res.json();
        setReports(data);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      }
    };

    fetchReports();
  }, [navigate]);

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded-full text-xs font-semibold";
    if (status === "Resolved") return `${base} bg-green-100 text-green-700`;
    if (status === "Pending") return `${base} bg-yellow-100 text-yellow-800`;
    return `${base} bg-gray-200 text-gray-700`;
  };

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white/90 p-8 shadow-xl rounded-xl">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">My Submitted Reports</h1>

        {reports.length === 0 ? (
          <p className="text-center text-gray-500 italic">
            You haven’t submitted any reports yet.
          </p>
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
                      <strong>Category:</strong> {report.category}
                    </p>
                    {report.location && (
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Location:</strong> {report.location}
                      </p>
                    )}
                  </div>
                  <div>
                    <span className={getStatusBadge(report.status || "Pending")}>
                      {report.status || "Pending"}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 mt-2">{report.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;
