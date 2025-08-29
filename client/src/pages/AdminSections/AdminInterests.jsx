import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_BASE } from "../../apiBase";

export default function AdminInterests() {
  const { t } = useTranslation();
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  const [usersByEmail, setUsersByEmail] = useState({});

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);

      const [iRes, uRes] = await Promise.all([
        fetch(`${API_BASE}/interests`),
        fetch(`${API_BASE}/users`),
      ]);

      const iData = await iRes.json();
      const uData = await uRes.json();

      setInterests(Array.isArray(iData) ? iData : []);

      if (Array.isArray(uData)) {
        const map = {};
        for (const u of uData) {
          if (u?.email) map[u.email] = u;
        }
        setUsersByEmail(map);
      } else {
        setUsersByEmail({});
      }
    } catch (e) {
      console.error("Failed to load interests/users", e);
      setInterests([]);
      setUsersByEmail({});
    } finally {
      setLoading(false);
    }
  };

  const removeInterest = async (id) => {
    if (!window.confirm(t("admin.interests.confirmRemove"))) return;
    try {
      await fetch(`http://localhost:5000/interests/${id}`, { method: "DELETE" });
      setInterests((list) => list.filter((x) => x.id !== id));
    } catch (e) {
      console.error(e);
      alert(t("common.actionFailed"));
    }
  };

  const projects = useMemo(() => {
    const set = new Set();
    interests.forEach((x) => set.add(x.projectTitle || x.projectId || "—"));
    return [t("admin.interests.allProjects"), ...Array.from(set)];
  }, [interests, t]);

  const displayName = (row) => {
    const fallback = row.userName && row.userName !== "N/A" ? row.userName : (row.userEmail || "N/A");
    const u = row.userEmail ? usersByEmail[row.userEmail] : null;
    if (!u) return <>{fallback}</>;
    const label = row.userName && row.userName !== "N/A" ? row.userName : (u.fullName || u.email);
    return <Link className="text-brandBlue hover:underline" to={`/admin/user/${u.id}`}>{label}</Link>;
  };

  const filtered = interests
    .filter((x) => {
      const term = search.trim().toLowerCase();
      if (!term) return true;
      const hay = `${x.projectTitle || ""} ${x.userEmail || ""} ${x.userName || ""}`.toLowerCase();
      return hay.includes(term);
    })
    .filter((x) => {
      if (!projectFilter || projectFilter === t("admin.interests.allProjects")) return true;
      const title = x.projectTitle || x.projectId || "—";
      return title === projectFilter;
    })
    .sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""));

  const fmtDate = (ts) => (ts ? new Date(ts).toLocaleString() : "—");

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="bg-white/95 rounded-2xl shadow-soft p-6">
        <div className="flex items-center gap-3 mb-4">
          <img src="/logo.png" alt="Sudan Emblem" className="w-7 h-7 object-contain" />
          <h2 className="text-2xl font-extrabold text-brandNavy">{t("admin.interests.title")}</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
          <input
            className="input md:w-1/2"
            placeholder={t("admin.interests.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-3">
            <select
              className="input"
              value={projectFilter || t("admin.interests.allProjects")}
              onChange={(e) =>
                setProjectFilter(e.target.value === t("admin.interests.allProjects") ? "" : e.target.value)
              }
            >
              {projects.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <button
              className="btn-outline"
              onClick={() => {
                setSearch("");
                setProjectFilter("");
              }}
            >
              {t("common.clear")}
            </button>
          </div>
        </div>

        <div className="overflow-auto rounded-xl border bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th className="text-left px-4 py-3">{t("admin.interests.th.project")}</th>
                <th className="text-left px-4 py-3">{t("admin.interests.th.user")}</th>
                <th className="text-left px-4 py-3">{t("admin.interests.th.email")}</th>
                <th className="text-left px-4 py-3">{t("admin.interests.th.date")}</th>
                <th className="text-left px-4 py-3">{t("admin.interests.th.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-4 text-gray-600 italic" colSpan={5}>
                    {t("common.loading")}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-gray-600 italic" colSpan={5}>
                    {t("admin.interests.empty")}
                  </td>
                </tr>
              ) : (
                filtered.map((row) => {
                  const u = row.userEmail ? usersByEmail[row.userEmail] : null;
                  return (
                    <tr key={row.id} className="border-t">
                      <td className="px-4 py-3">{row.projectTitle || row.projectId}</td>
                      <td className="px-4 py-3">{displayName(row)}</td>
                      <td className="px-4 py-3">
                        {row.userEmail ? (
                          u ? (
                            <Link className="text-brandBlue hover:underline" to={`/admin/user/${u.id}`}>
                              {row.userEmail}
                            </Link>
                          ) : (
                            row.userEmail
                          )
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3">{fmtDate(row.timestamp)}</td>
                      <td className="px-4 py-3">
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => removeInterest(row.id)}
                        >
                          {t("common.remove")}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
