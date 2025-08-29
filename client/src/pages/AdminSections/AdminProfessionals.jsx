import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_BASE } from "../../apiBase";

const AdminProfessionals = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [professionFilter, setProfessionFilter] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/users`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifiedToggle = async (id, verified) => {
    try {
      await fetch(`http://localhost:5000/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified }),
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to update verification:", err);
      alert(t("common.errorUpdating"));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("admin.professionals.confirmDelete"))) return;
    try {
      await fetch(`http://localhost:5000/users/${id}`, { method: "DELETE" });
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert(t("common.actionFailed"));
    }
  };

  const professionals = useMemo(() => {
    return users.filter((u) => {
      const looksProfessional =
        (u.role || "user") === "user" || !!u.profession || (Array.isArray(u.expertise) && u.expertise.length > 0);
      return looksProfessional;
    });
  }, [users]);

  const professions = useMemo(() => {
    const set = new Set();
    professionals.forEach((u) => { if (u.profession) set.add(u.profession); });
    return Array.from(set);
  }, [professionals]);

  const filtered = useMemo(() => {
    return professionals
      .filter((u) => (verifiedOnly ? !!u.verified : true))
      .filter((u) => (professionFilter ? (u.profession || "") === professionFilter : true))
      .filter((u) => {
        if (search.trim().length === 0) return true;
        const q = search.toLowerCase();
        return (
          (u.fullName || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q) ||
          (u.profession || "").toLowerCase().includes(q) ||
          (Array.isArray(u.expertise) ? u.expertise.join(" ").toLowerCase().includes(q) : false)
        );
      });
  }, [professionals, verifiedOnly, professionFilter, search]);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="bg-white/90 shadow-soft rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
          <h1 className="text-3xl font-extrabold text-brandNavy">{t("admin.professionals.title")}</h1>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <input
            className="input md:w-1/2"
            placeholder={t("admin.professionals.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-3 items-center">
            <select
              className="input"
              value={professionFilter}
              onChange={(e) => setProfessionFilter(e.target.value)}
            >
              <option value="">{t("admin.professionals.allProfessions")}</option>
              {professions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
              />
              {t("admin.professionals.verifiedOnly")}
            </label>

            <button className="btn-outline" onClick={() => { setSearch(""); setProfessionFilter(""); setVerifiedOnly(false); }}>
              {t("common.clear")}
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600 italic">{t("common.loading")}</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 italic">{t("admin.professionals.empty")}</p>
        ) : (
          <div className="space-y-6">
            {filtered.map((u) => (
              <div key={u.id} className="bg-white/95 border-l-4 border-brandGold rounded-xl shadow-soft p-6">
                <div className="flex justify-between gap-4 flex-wrap">
                  <div className="min-w-[260px]">
                    <h3 className="text-lg font-bold text-brandNavy">
                      <Link className="text-brandBlue hover:underline" to={`/admin/user/${u.id}`}>
                        {u.fullName || "—"}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-600">
                      <strong>{t("common.email")}:</strong>{" "}
                      <Link className="text-brandBlue hover:underline" to={`/admin/user/${u.id}`}>
                        {u.email || "—"}
                      </Link>{" "}
                      &middot{" "}
                      <strong>{t("admin.professionals.verified")}:</strong> {u.verified ? t("common.yes") : t("common.no")}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>{t("admin.professionals.profession")}:</strong> {u.profession || "—"}
                    </p>
                  </div>

                  <div className="text-right">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={!!u.verified}
                        onChange={(e) => handleVerifiedToggle(u.id, e.target.checked)}
                      />
                      <span className="text-sm">{u.verified ? t("admin.professionals.verified") : t("admin.professionals.unverified")}</span>
                    </label>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(u.expertise) && u.expertise.length > 0 ? (
                      u.expertise.map((tkn) => (
                        <span key={tkn} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                          {tkn}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs italic">{t("common.noneListed")}</span>
                    )}
                  </div>
                  {u.availability && (
                    <p className="text-xs text-gray-600 mt-2">
                      <strong>{t("admin.professionals.availability")}:</strong> {u.availability}
                    </p>
                  )}
                  {u.location && (
                    <p className="text-xs text-gray-600">
                      <strong>{t("admin.professionals.location")}:</strong> {u.location}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex justify-end gap-4">
                  <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:underline text-sm">
                    {t("common.delete")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfessionals;
