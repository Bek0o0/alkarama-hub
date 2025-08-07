import React from "react";
import { Link } from "react-router-dom";

const reports = [
  {
    id: 1,
    title: "Displacement in El Geneina",
    summary: "Over 100,000 people have been displaced due to escalating violence.",
    date: "June 2025",
  },
  {
    id: 2,
    title: "Access to Water in Nyala",
    summary: "Field reports show critical shortages in clean water in South Darfur.",
    date: "May 2025",
  },
  {
    id: 3,
    title: "Attacks on Civilian Hospitals",
    summary: "Hospitals in Khartoum and Omdurman are being targeted by armed forces.",
    date: "April 2025",
  },
];

const Reports = () => {
  return (
    <div className="max-w-5xl mx-auto py-20 px-4">
      <h1 className="text-4xl font-extrabold text-primary mb-10 text-center">
        Situation Reports
      </h1>
      <div className="space-y-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white/90 p-6 rounded-xl shadow hover:shadow-lg transition duration-300 border-l-4 border-primary"
          >
            <h2 className="text-xl font-semibold text-primary mb-1">
              {report.title}
            </h2>
            <p className="text-sm text-gray-500 mb-2">{report.date}</p>
            <p className="text-textDark">{report.summary}</p>
            <Link
              to={`/reports/${report.id}`}
              className="inline-block mt-4 text-sm font-medium text-secondary hover:underline"
            >
              Read more →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
