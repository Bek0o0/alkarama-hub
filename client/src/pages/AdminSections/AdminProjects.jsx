import React, { useEffect, useState } from "react";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    id: "",
    title: "",
    summary: "",
    cost: "",
    status: "Planned",
    donated: 0,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:5000/projects");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects:", err);
    }
  };

  const generateId = () => {
    return Math.random().toString(36).substr(2, 6);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProject = {
      ...form,
      cost: parseFloat(form.cost),
      donated: parseFloat(form.donated) || 0,
    };

    if (isEditing) {
      try {
        await fetch(`http://localhost:5000/projects/${form.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProject),
        });
        resetForm();
        fetchProjects();
      } catch (err) {
        console.error("Failed to update project:", err);
      }
    } else {
      const newProject = {
        ...updatedProject,
        id: generateId(),
      };
      try {
        await fetch("http://localhost:5000/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProject),
        });
        resetForm();
        fetchProjects();
      } catch (err) {
        console.error("Failed to add project:", err);
      }
    }
  };

  const resetForm = () => {
    setForm({
      id: "",
      title: "",
      summary: "",
      cost: "",
      status: "Planned",
      donated: 0,
    });
    setIsEditing(false);
  };

  const handleEdit = (project) => {
    setForm(project);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/projects/${id}`, {
        method: "DELETE",
      });
      fetchProjects();
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-textDark mb-6">Rebuilding Projects</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-8 space-y-4">
        <input
          type="text"
          placeholder="Project Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="input"
        />
        <textarea
          placeholder="Short Summary"
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          required
          className="textarea"
        />
        <input
          type="number"
          placeholder="Estimated Cost"
          value={form.cost}
          onChange={(e) => setForm({ ...form, cost: e.target.value })}
          required
          className="input"
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="input"
        >
          <option value="Planned">Planned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <div className="flex gap-4">
          <button type="submit" className="btn-primary">
            {isEditing ? "Update Project" : "Add Project"}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid gap-6">
        {projects.map((project) => (
          <div key={project.id} className="card border-l-4 border-primary bg-white/95">
            <h3 className="text-lg font-bold text-primary">{project.title}</h3>
            <p className="text-gray-700 mt-1">{project.summary}</p>
            <p className="text-sm text-gray-600">
              <strong>Status:</strong> {project.status} | <strong>Cost:</strong> ${project.cost?.toLocaleString()} | <strong>Donated:</strong> ${project.donated?.toLocaleString()}
            </p>
            <div className="mt-3 flex gap-4">
              <button
                onClick={() => handleEdit(project)}
                className="text-sm text-green-700 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProjects;
