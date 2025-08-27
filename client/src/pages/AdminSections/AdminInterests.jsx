import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminInterests() {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  // cache users to map email -> { id, fullName }
  const [usersByEmail, setUsersByEmail] = useState({});

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);

      const [iRes, uRes] = await Promise.all([
        fetch("http://localhost:5000/interests"),
        fetch("http://localhost:5000/users"),
      ]);

      const iData = await iRes.json();
      const uData = await uRes.json();

      setInterests(Array.isArray(iData) ? iData : []);

      if (Array.isArray(uData)) {
        const map = {};
        for (const u of uData) {
          if (u?.email) map[u.email] = { id: u.id, fullName: u.fullName || "" };
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
    if (!window.confirm("Remove this interest?")) return;
    try {
      await fetch(`http://localhost:5000/interests/${id}`, { method: "DELETE" });
      setInterests((list) => list.filter((x) => x.id !== id));
    } catch (e) {
      console.error(e);
      alert("Could not remove.");
    }
  };

  const projects = useMemo(() => {
    const set = new Set();
    interests.forEach((x) => set.add(x.projectTitle || x.projectId || "—"));
    return ["All projects", ...Array.from(set)];
  }, [interests]);

  const userCell = (row) => {
    const email = row.userEmail || "";
    const info = usersByEmail[email];
    const text =
      row.userName && row.userName !== "N/A"
        ? row.userName
        : info?.fullName || email || "N/A";
    const key = info?.id ? info.id : email;
    if (!key) return text;
    return (
      <Link
        to={`/admin/users/${encodeURIComponent(key)}`}
        className="text-brandBlue hover:underline"
        title="View user profile"
      >
        {text}
      </Link>
    );
  };

  const filtered = interests
    .filter((x) => {
      const term = search.trim().toLowerCase();
      if (!term) return true;
      const hay =
        `${x.projectTitle || ""} ${x.userEmail || ""} ${x.userName || ""}`.toLowerCase();
      return hay.includes(term);
    })
    .filter((x) => {
      if (!projectFilter || projectFilter === "All projects") return true;
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
          <h2 className="text-2xl font-extrabold text-brandNavy">Volunteer Interests</h2>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
          <input
            className="input md:w-1/2"
            placeholder="Search by name, email, or project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-3">
            <select
              className="input"
              value={projectFilter || "All projects"}
              onChange={(e) =>
                setProjectFilter(e.target.value === "All projects" ? "" : e.target.value)
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
              Clear
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto rounded-xl border bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th className="text-left px-4 py-3">Project</th>
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-4 text-gray-600 italic" colSpan={5}>
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-gray-600 italic" colSpan={5}>
                    No interests found.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="px-4 py-3">{row.projectTitle || row.projectId}</td>
                    <td className="px-4 py-3">{userCell(row)}</td>
                    <td className="px-4 py-3">{row.userEmail || "—"}</td>
                    <td className="px-4 py-3">{fmtDate(row.timestamp)}</td>
                    <td className="px-4 py-3">
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => removeInterest(row.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
