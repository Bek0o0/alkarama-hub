import React, { useEffect, useMemo, useState } from "react";

const AdminProfessionals = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI filters
  const [search, setSearch] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [professionFilter, setProfessionFilter] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle verification
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
      alert("Error updating verification.");
    }
  };

  // (Optional) delete user if your original supported it; otherwise remove this function + button
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this professional?")) return;
    try {
      await fetch(`http://localhost:5000/users/${id}`, { method: "DELETE" });
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Error deleting user.");
    }
  };

  // Derive list of professionals (role "user" or has profession/expertise)
  const professionals = useMemo(() => {
    return users.filter((u) => {
      const looksProfessional =
        (u.role || "user") === "user" || !!u.profession || (Array.isArray(u.expertise) && u.expertise.length > 0);
      return looksProfessional;
    });
  }, [users]);

  const professions = useMemo(() => {
    const set = new Set();
    professionals.forEach((u) => {
      if (u.profession) set.add(u.profession);
    });
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
          <h1 className="text-3xl font-extrabold text-brandNavy">Diaspora Professionals</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <input
            className="input md:w-1/2"
            placeholder="Search by name, email, profession, or expertise…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-3 items-center">
            <select
              className="input"
              value={professionFilter}
              onChange={(e) => setProfessionFilter(e.target.value)}
            >
              <option value="">All professions</option>
              {professions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
              />
              Verified only
            </label>

            <button className="btn-outline" onClick={() => { setSearch(""); setProfessionFilter(""); setVerifiedOnly(false); }}>
              Clear
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600 italic">Loading professionals…</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 italic">No professionals match your filters.</p>
        ) : (
          <div className="space-y-6">
            {filtered.map((u) => (
              <div
                key={u.id}
                className="bg-white/95 border-l-4 border-brandGold rounded-xl shadow-soft p-6"
              >
                {/* Header */}
                <div className="flex justify-between gap-4 flex-wrap">
                  <div className="min-w-[260px]">
                    <h3 className="text-lg font-bold text-brandNavy">{u.fullName || "—"}</h3>
                    <p className="text-sm text-gray-600">
                      <strong>Email:</strong> {u.email || "—"} &middot{" "}
                      <strong>Verified:</strong> {u.verified ? "Yes" : "No"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Profession:</strong> {u.profession || "—"}
                    </p>
                  </div>

                  {/* Verify toggle */}
                  <div className="text-right">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={!!u.verified}
                        onChange={(e) => handleVerifiedToggle(u.id, e.target.checked)}
                      />
                      <span className="text-sm">{u.verified ? "Verified" : "Unverified"}</span>
                    </label>
                  </div>
                </div>

                {/* Expertise + availability */}
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(u.expertise) && u.expertise.length > 0 ? (
                      u.expertise.map((t) => (
                        <span
                          key={t}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                        >
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs italic">No expertise listed</span>
                    )}
                  </div>
                  {u.availability && (
                    <p className="text-xs text-gray-600 mt-2">
                      <strong>Availability:</strong> {u.availability}
                    </p>
                  )}
                  {u.location && (
                    <p className="text-xs text-gray-600">
                      <strong>Location:</strong> {u.location}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-end gap-4">
                  {/* Optional delete (keep only if your original file had this) */}
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
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
