import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_BASE } from "../../apiBase";

const AdminDonations = () => {
  const { t } = useTranslation();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [usersByEmail, setUsersByEmail] = useState({});

  useEffect(() => {
    fetchDonations();
    fetchUsersLookup();
  }, []);

  const fetchUsersLookup = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`);
      const list = await res.json();
      const map = {};
      (Array.isArray(list) ? list : []).forEach((u) => {
        if (u?.email) map[u.email] = u;
      });
      setUsersByEmail(map);
    } catch {
      setUsersByEmail({});
    }
  };

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/donations`);
      const data = await res.json();
      setDonations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load donations:", err);
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = donations.filter((d) => {
    if (search.trim().length === 0) return true;
    const q = search.toLowerCase();
    return (
      (d.donorName || "").toLowerCase().includes(q) ||
      (d.donorEmail || "").toLowerCase().includes(q) ||
      (d.projectId || "").toLowerCase().includes(q)
    );
  });

  const DonorCell = ({ email, name }) => {
    const u = email ? usersByEmail[email] : null;
    if (!u) return <span className="font-semibold text-brandNavy">{name || "—"}</span>;
    return (
      <Link className="font-semibold text-brandBlue hover:underline" to={`/admin/user/${u.id}`}>
        {name || u.fullName || email}
      </Link>
    );
  };

  const EmailCell = ({ email }) => {
    const u = email ? usersByEmail[email] : null;
    if (!email) return <>—</>;
    if (!u) return <>{email}</>;
    return <Link className="text-brandBlue hover:underline" to={`/admin/user/${u.id}`}>{email}</Link>;
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="bg-white/90 shadow-soft rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
          <h1 className="text-3xl font-extrabold text-brandNavy">{t("admin.donations.title")}</h1>
        </div>

        <div className="flex justify-between items-center mb-4">
          <input
            className="input md:w-1/2"
            placeholder={t("admin.donations.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => setSearch("")} className="btn-outline">
            {t("common.clear")}
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600 italic">{t("common.loading")}</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 italic">{t("admin.donations.empty")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-gray-50">
                  <th>{t("admin.donations.th.donor")}</th>
                  <th>{t("admin.donations.th.email")}</th>
                  <th>{t("admin.donations.th.dob")}</th>
                  <th>{t("admin.donations.th.amount")}</th>
                  <th>{t("admin.donations.th.method")}</th>
                  <th>{t("admin.donations.th.invoice")}</th>
                  <th>{t("admin.donations.th.project")}</th>
                  <th>{t("admin.donations.th.date")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td><DonorCell email={d.donorEmail} name={d.donorName} /></td>
                    <td><EmailCell email={d.donorEmail} /></td>
                    <td>{d.donorDob || d.donorDOB || "—"}</td>
                    <td>${(d.amount || 0).toLocaleString()}</td>
                    <td>{d.method || "—"}</td>
                    <td>{d.invoice || "—"}</td>
                    <td>{d.projectId || "—"}</td>
                    <td>{d.timestamp ? new Date(d.timestamp).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDonations;
