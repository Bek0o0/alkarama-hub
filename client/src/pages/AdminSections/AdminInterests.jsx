import React, { useEffect, useMemo, useState } from "react";

export default function AdminInterests() {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  useEffect(() => {
    fetchInterests();
  }, []);

  const fetchInterests = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/interests");
      const data = await res.json();
      setInterests(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load interests:", e);
      setInterests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this interest?")) return;
    try {
      await fetch(`http://localhost:5000/interests/${id}`, { method: "DELETE" });
      fetchInterests();
    } catch (e) {
      console.error("Delete interest failed:", e);
      alert("Error deleting interest.");
    }
  };

  const projects = useMemo(() => {
    const s = new Set();
    interests.forEach((i) => i.projectTitle && s.add(i.projectTitle));
    return Array.from(s);
  }, [interests]);

  const filtered = useMemo(() => {
    return interests
      .filter((i) =>
        q.trim().length === 0
          ? true
          : (i.userEmail || "").toLowerCase().includes(q.toLowerCase()) ||
            (i.userName || "").toLowerCase().includes(q.toLowerCase()) ||
            (i.projectTitle || "").toLowerCase().includes(q.toLowerCase())
      )
      .filter((i) => (projectFilter ? i.projectTitle === projectFilter : true))
      .sort((a, b) => {
        const ta = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const tb = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return tb - ta;
      });
  }, [interests, q, projectFilter]);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="bg-white/90 shadow-soft rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
          <h1 className="text-3xl font-extrabold text-brandNavy">Volunteer Interests</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <input
            className="input md:w-1/2"
            placeholder="Search by name, email, or project…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="flex gap-3">
            <select
              className="input"
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
            >
              <option value="">All projects</option>
              {projects.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <button className="btn-outline" onClick={() => { setQ(""); setProjectFilter(""); }}>
              Clear
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600 italic">Loading interests…</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 italic">No interests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-gray-50">
                  <th>Project</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((i) => (
                  <tr key={i.id} className="hover:bg-gray-50">
                    <td className="font-semibold text-brandNavy">{i.projectTitle || i.projectId}</td>
                    <td>{i.userName || "—"}</td>
                    <td>{i.userEmail || "—"}</td>
                    <td>{i.timestamp ? new Date(i.timestamp).toLocaleString() : "—"}</td>
                    <td>
                      <button onClick={() => handleDelete(i.id)} className="text-red-600 hover:underline text-sm">
                        Remove
                      </button>
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
}
