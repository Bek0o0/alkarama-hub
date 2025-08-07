import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/projects/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Project not found");
        return res.json();
      })
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading project:", err);
        setProject(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
        Project not found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-20 px-4">
      <div className="bg-white/90 shadow-xl rounded-xl p-10">
        <h1 className="text-3xl font-extrabold text-primary mb-4">{project.title}</h1>
        <p className="text-textDark text-lg leading-relaxed">{project.summary}</p>
      </div>
    </div>
  );
}
