import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/donations");
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

  const donorCell = (d) => {
    const email = d.donorEmail || "";
    const text = d.donorName || email || "—";
    if (!email) return text;
    const key = encodeURIComponent(email);
    return (
      <Link
        to={`/admin/users/${key}`}
        className="text-brandBlue hover:underline"
        title="View user profile"
      >
        {text}
      </Link>
    );
  };

  const emailCell = (d) => {
    const email = d.donorEmail || "";
    if (!email) return "—";
    return (
      <Link
        to={`/admin/users/${encodeURIComponent(email)}`}
        className="text-brandBlue hover:underline"
        title="View user profile"
      >
        {email}
      </Link>
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="bg-white/90 shadow-soft rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
          <h1 className="text-3xl font-extrabold text-brandNavy">Donation History</h1>
        </div>

        {/* Search */}
        <div className="flex justify-between items-center mb-4">
          <input
            className="input md:w-1/2"
            placeholder="Search by donor, email, or project…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => setSearch("")} className="btn-outline">
            Clear
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600 italic">Loading donations…</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 italic">No donations found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-gray-50">
                  <th>Donor</th>
                  <th>Email</th>
                  <th>DOB</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Invoice</th>
                  <th>Project</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="font-semibold text-brandNavy">{donorCell(d)}</td>
                    <td>{emailCell(d)}</td>
                    <td>{d.donorDob || d.donorDOB || "—"}</td>
                    <td>${(d.amount || 0).toLocaleString()}</td>
                    <td>{d.method || "—"}</td>
                    <td>{d.invoice || "—"}</td>
                    <td>{d.projectId || "—"}</td>
                    <td>
                      {d.timestamp ? new Date(d.timestamp).toLocaleDateString() : "—"}
                    </td>
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
