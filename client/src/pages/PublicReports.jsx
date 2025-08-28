import React, { useEffect, useMemo, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { useTranslation } from "react-i18next";

export default function PublicReports() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("Public");

  const { t, i18n } = useTranslation();
  const dir = i18n.language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    fetch("http://localhost:5000/reports")
      .then((res) => res.json())
      .then((data) => setReports(Array.isArray(data) ? data : []))
      .catch(() => setReports([]));
  }, []);

  const categoryOptions = useMemo(() => {
    return Array.from(new Set(reports.map((r) => r.category).filter(Boolean)));
  }, [reports]);

  const statusOptions = useMemo(() => {
    return Array.from(new Set(reports.map((r) => r.status).filter(Boolean)));
  }, [reports]);

  const filteredReports = reports
    .filter((r) => {
      const matchesStatus = statusFilter ? (r.status || "") === statusFilter : true;
      const matchesCategory = categoryFilter ? r.category === categoryFilter : true;

      const q = search.trim().toLowerCase();
      const matchesSearch =
        q.length === 0
          ? true
          : (r.title || "").toLowerCase().includes(q) ||
            (r.description || "").toLowerCase().includes(q) ||
            (r.category || "").toLowerCase().includes(q) ||
            (r.location || "").toLowerCase().includes(q);

      return matchesStatus && matchesCategory && matchesSearch;
    })
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

  const fmtDate = (date) => (date ? new Date(date).toLocaleString() : "—");

  return (
    <div className="max-w-6xl mx-auto py-16 px-4" style={{ direction: dir }}>
      <div className={`flex items-center gap-3 mb-8 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
        <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
        <h1 className="text-3xl font-extrabold text-brandNavy">
          {t("publicReports.title")}
        </h1>
      </div>

      <div
        className={`flex flex-col md:flex-row gap-4 mb-6 md:items-center md:justify-between ${
          dir === "rtl" ? "md:[direction:ltr]" : ""
        }`}
      >
        <input
          type="text"
          className="input md:w-1/2"
          placeholder={t("publicReports.searchPh")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ direction: dir }}
        />

        <div className="flex gap-3">
          <select
            className="input"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">{t("publicReports.allCategories")}</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {["Public", ...statusOptions.filter((s) => s !== "Public")].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
            <option value="">{t("publicReports.allStatuses", "All Statuses")}</option>
          </select>

          <button
            className="btn-outline"
            onClick={() => {
              setSearch("");
              setCategoryFilter("");
              setStatusFilter("Public");
            }}
          >
            {t("publicReports.clear")}
          </button>
        </div>
      </div>

      {/* Content */}
      {filteredReports.length === 0 ? (
        <p className="text-center text-gray-500 italic">{t("publicReports.empty")}</p>
      ) : (
        <div className="space-y-6">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white/95 border-l-4 border-brandGold rounded-xl shadow-soft p-6"
            >
              <div
                className={`flex justify-between flex-wrap gap-2 ${
                  dir === "rtl" ? "text-right" : ""
                }`}
              >
                <div>
                  <h3 className="text-lg font-bold text-brandNavy">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>{t("publicReports.date")}:</strong> {fmtDate(report.createdAt)}{" "}
                    | <strong>{t("publicReports.category")}:</strong> {report.category}{" "}
                    | <strong>{t("publicReports.location", "Location")}:</strong>{" "}
                    {report.location || t("publicReports.undisclosed", "Undisclosed")}
                  </p>
                </div>
                <div className="text-right">
                  <StatusBadge value={report.status} />
                </div>
              </div>

              <p className={`mt-3 text-gray-800 ${dir === "rtl" ? "text-right" : ""}`}>
                {report.description}
              </p>

              {(report.evidence || report.attachment) && (
                <div className={`mt-3 ${dir === "rtl" ? "text-right" : ""}`}>
                  <a
                    href={report.evidence || report.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brandBlue hover:underline text-sm"
                  >
                    {t("publicReports.viewEvidence")}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
