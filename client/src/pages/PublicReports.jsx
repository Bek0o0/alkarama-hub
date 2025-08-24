import React, { useEffect, useState } from "react";

const PublicReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://localhost:5000/reports");
        const data = await res.json();

        const now = new Date();
        const filtered = data.filter((r) => {
          const created = new Date(r.createdAt);
          const daysSince = (now - created) / (1000 * 60 * 60 * 24);
          const s = (r.status || "").toString().toLowerCase();
          return s === "public" || daysSince > 30;
        });

        setReports(filtered);
      } catch (err) {
        console.error("Failed to fetch public reports", err);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-extrabold text-primary mb-10 text-center">
        Reported Incidents (Public Awareness)
      </h1>

      {reports.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          No public reports available at this time.
        </p>
      ) : (
        <div className="space-y-8">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white/95 p-6 rounded-xl shadow border-l-4 border-red-500"
            >
              <h2 className="text-xl font-bold text-red-700 mb-1">
                Incident: {report.title}
              </h2>
              <p className="text-sm text-gray-500">
                <strong>Date:</strong>{" "}
                {new Date(report.createdAt).toLocaleDateString()} |{" "}
                <strong>Location:</strong> {report.location || "Undisclosed"}
              </p>
              <p className="mt-2 text-gray-800 leading-relaxed">
                {report.description}
              </p>
              <p className="mt-2 text-sm text-gray-600 italic">
                Category: {report.category}
              </p>
              {report.evidence && (
                <div className="mt-4">
                  <a
                    href={report.evidence}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Attached Evidence
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

export default PublicReports;
