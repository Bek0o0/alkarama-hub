import React, { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { useTranslation } from "react-i18next";
import { getLocalized } from "../utils/i18nContent";

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { t, i18n } = useTranslation();
  const dir = i18n.language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;
    fetch(`http://localhost:5000/reports?userEmail=${email}`)
      .then((res) => res.json())
      .then((data) => setReports(data || []))
      .catch(() => setReports([]));
  }, []);

  const filteredReports = reports.filter((r) => {
    const titleLocalized = getLocalized(r, "title", i18n.language);
    const matchesSearch = titleLocalized.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? r.category === categoryFilter : true;
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatDate = (date) => new Date(date).toLocaleDateString();
  const categoryOptions = [...new Set(reports.map((r) => r.category))];
  const statusOptions = [...new Set(reports.map((r) => r.status))];

  return (
    <div className="max-w-6xl mx-auto py-16 px-4" style={{ direction: dir }}>
      <h1 className="text-3xl font-bold text-brandNavy mb-8 text-center">
        {t("myReports.title")}
      </h1>

      <div className={`flex flex-col md:flex-row gap-4 mb-6 justify-between items-center ${dir === "rtl" ? "md:[direction:ltr]" : ""}`}>
        <input
          type="text"
          placeholder={t("myReports.searchPh")}
          className="input w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ direction: dir }}
        />
        <select
          className="input"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">{t("myReports.allCategories")}</option>
          {categoryOptions.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <select
          className="input"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">{t("myReports.allStatuses")}</option>
          {statusOptions.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </div>

      {filteredReports.length === 0 ? (
        <p className="text-center text-gray-500 italic">{t("myReports.none")}</p>
      ) : (
        <div className="space-y-6">
          {filteredReports.map((report) => {
            const titleLocalized = getLocalized(report, "title", i18n.language);
            const descLocalized = getLocalized(report, "description", i18n.language);
            return (
              <div
                key={report.id}
                className="bg-white/95 border-l-4 border-brandGold rounded-xl shadow-soft p-6"
              >
                <div className={`flex justify-between flex-wrap gap-2 ${dir === "rtl" ? "text-right" : ""}`}>
                  <div>
                    <h3 className="text-lg font-bold text-brandNavy" dir="auto">
                      {titleLocalized}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <strong>{t("myReports.date")}:</strong> {formatDate(report.createdAt)}{" "}
                      | <strong>{t("myReports.category")}:</strong> {report.category}{" "}
                      | <strong>{t("myReports.location")}:</strong>{" "}
                      {report.location || t("myReports.undisclosed")}
                    </p>
                  </div>
                  <div className="text-right">
                    <StatusBadge value={report.status} />
                  </div>
                </div>

                <p className={`mt-3 text-gray-800 ${dir === "rtl" ? "text-right" : ""}`} dir="auto">
                  {descLocalized}
                </p>

                {report.evidence && (
                  <div className={`mt-3 ${dir === "rtl" ? "text-right" : ""}`}>
                    <a
                      href={report.evidence}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brandBlue hover:underline text-sm"
                    >
                      {t("myReports.viewEvidence")}
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyReports;
