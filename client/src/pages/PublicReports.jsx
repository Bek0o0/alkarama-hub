import React, { useEffect, useMemo, useState } from "react";
import StatusBadge from "../components/StatusBadge";

export default function PublicReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/reports");
        const data = await res.json();
        setReports(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load reports:", e);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Keep original behavior:
  // show if status === "public" OR report older than 30 days
  const visibleReports = useMemo(() => {
    const now = Date.now();
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

    return reports
      .filter((r) => {
        const status = (r.status || "").toString().toLowerCase();
        const created = r.createdAt ? new Date(r.createdAt).getTime() : now;
        const isOld = now - created > THIRTY_DAYS;
        const isPublic = status === "public";
        return isPublic || isOld;
      })
      .filter((r) => {
        const matchesSearch =
          search.trim().length === 0
            ? true
            : (r.title || "").toLowerCase().includes(search.toLowerCase()) ||
              (r.description || "").toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category ? r.category === category : true;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da; // newest first
      });
  }, [reports, search, category]);

  const categories = useMemo(
    () => Array.from(new Set(reports.map((r) => r.category).filter(Boolean))),
    [reports]
  );

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "—");

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="bg-white/90 shadow-soft rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
          <h1 className="text-3xl font-extrabold text-brandNavy">Public Reports</h1>
        </div>
        <p className="text-gray-600 mb-6">
          This page lists reports that have been <strong>posted publicly</strong> by admins or that
          have remained unresolved for over <strong>30 days</strong> to raise awareness. Do not
          submit sensitive personal information.
        </p>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">
          <input
            className="input md:w-1/2"
            placeholder="Search reports…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-3">
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button className="btn-outline" onClick={() => { setSearch(""); setCategory(""); }}>
              Clear
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600 italic">Loading…</p>
        ) : visibleReports.length === 0 ? (
          <p className="text-gray-500 italic">No public reports yet.</p>
        ) : (
          <div className="space-y-6">
            {visibleReports.map((r) => {
              const status = (r.status || "").toString().toLowerCase(); // robust to case
              return (
                <article
                  key={r.id}
                  className="bg-white/95 border-l-4 border-brandGold rounded-xl shadow-soft p-6"
                >
                  <header className="flex justify-between items-start gap-4 flex-wrap">
                    <div className="min-w-[240px]">
                      <h2 className="text-lg font-bold text-brandNavy">{r.title}</h2>
                      <p className="text-sm text-gray-600">
                        <strong>Date:</strong> {formatDate(r.createdAt)} &middot{" "}
                        <strong>Category:</strong> {r.category} &middot{" "}
                        <strong>Location:</strong> {r.location || "Undisclosed"}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge value={status} />
                    </div>
                  </header>

                  <p className="mt-3 text-gray-800">{r.description}</p>

                  {r.evidence && (
                    <div className="mt-3">
                      <a
                        href={r.evidence}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brandBlue hover:underline text-sm"
                      >
                        View Evidence
                      </a>
                    </div>
                  )}

                  {/* Optional: show who submitted (respecting anonymity) */}
                  <footer className="text-xs text-gray-600 mt-4">
                    Submitted by: {r.userEmail || "Anonymous"}
                  </footer>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
