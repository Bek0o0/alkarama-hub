import React, { useEffect, useState } from "react";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [cost, setCost] = useState("");
  const [tags, setTags] = useState("");
  const [search, setSearch] = useState("");
  const [interestCounts, setInterestCounts] = useState({}); // NEW

  useEffect(() => {
    fetchProjects();
    fetchInterestCounts(); // NEW
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/projects");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load projects:", err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // NEW: pre-compute counts by projectId
  const fetchInterestCounts = async () => {
    try {
      const res = await fetch("http://localhost:5000/interests");
      const list = await res.json();
      const counts = {};
      (Array.isArray(list) ? list : []).forEach((i) => {
        counts[i.projectId] = (counts[i.projectId] || 0) + 1;
      });
      setInterestCounts(counts);
    } catch (e) {
      console.error("Failed to load interests:", e);
      setInterestCounts({});
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const newProject = {
        id: Date.now().toString(),
        title,
        summary,
        cost: parseFloat(cost) || 0,
        donated: 0,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        status: "Planned",
      };
      await fetch("http://localhost:5000/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      setTitle(""); setSummary(""); setCost(""); setTags("");
      fetchProjects();
      fetchInterestCounts(); // keep counts fresh
    } catch (err) {
      console.error("Add failed:", err);
      alert("Error adding project.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await fetch(`http://localhost:5000/projects/${id}`, { method: "DELETE" });
      fetchProjects();
      fetchInterestCounts();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Error deleting project.");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchProjects();
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Error updating status.");
    }
  };

  const filtered = projects.filter((p) =>
    search.trim().length === 0
      ? true
      : (p.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.summary || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="bg-white/90 shadow-soft rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
          <h1 className="text-3xl font-extrabold text-brandNavy">Manage Projects</h1>
        </div>

        {/* Add new project */}
        <form onSubmit={handleAdd} className="space-y-4 mb-8 bg-brandIvory/50 p-4 rounded-xl">
          <h2 className="text-lg font-bold text-brandNavy">Add New Project</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input className="input" placeholder="Estimated Cost (USD)" type="number" value={cost} onChange={(e) => setCost(e.target.value)} />
          </div>
          <textarea className="textarea" placeholder="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} required />
          <input className="input" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
          <button type="submit" className="btn-primary">Add Project</button>
        </form>

        {/* Search bar */}
        <div className="flex justify-between items-center mb-4">
          <input className="input md:w-1/2" placeholder="Search projects…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button onClick={() => setSearch("")} className="btn-outline">Clear</button>
        </div>

        {loading ? (
          <p className="text-gray-600 italic">Loading projects…</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 italic">No projects found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-gray-50">
                  <th>Title</th>
                  <th>Summary</th>
                  <th>Cost</th>
                  <th>Donated</th>
                  <th>Status</th>
                  <th>Tags</th>
                  <th>Interested</th> {/* NEW */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="font-semibold text-brandNavy">{p.title}</td>
                    <td className="max-w-xs truncate">{p.summary}</td>
                    <td>${(p.cost || 0).toLocaleString()}</td>
                    <td>${(p.donated || 0).toLocaleString()}</td>
                    <td>
                      <select
                        value={p.status || "Planned"}
                        onChange={(e) => handleStatusChange(p.id, e.target.value)}
                        className="input"
                      >
                        <option>Planned</option>
                        <option>Active</option>
                        <option>Completed</option>
                      </select>
                    </td>
                    <td>
                      {Array.isArray(p.tags) && p.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {p.tags.map((t) => (
                            <span key={t} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">None</span>
                      )}
                    </td>
                    <td>
                      <span className="text-sm font-semibold">
                        {interestCounts[p.id] || 0}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline text-sm">
                        Delete
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
};

export default AdminProjects;
