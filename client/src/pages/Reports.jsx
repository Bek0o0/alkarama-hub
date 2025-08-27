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

export default function Reports() {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="bg-white/90 shadow-soft rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
          <h1 className="text-3xl font-extrabold text-brandNavy">Situation Reports</h1>
        </div>
        <p className="text-gray-600 mb-8">
          These are static sample situation reports included for awareness and design evaluation.
        </p>

        <div className="space-y-6">
          {reports.map((r) => (
            <article
              key={r.id}
              className="bg-white/95 border-l-4 border-brandGold rounded-xl shadow-soft p-6 hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-brandNavy mb-1">{r.title}</h2>
              <p className="text-sm text-gray-600 mb-2">{r.date}</p>
              <p className="text-textDark">{r.summary}</p>
              <Link
                to={`/reports/${r.id}`}
                className="inline-block mt-4 text-sm font-medium text-brandBlue hover:underline"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
