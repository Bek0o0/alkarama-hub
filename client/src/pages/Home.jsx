import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => {
        console.error("Failed to load projects:", err);
        setProjects([]);
      });
  }, []);

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="text-center py-20">
        <h1 className="text-5xl font-extrabold text-primary tracking-tight mb-4">
          Welcome to Alkarama Hub
        </h1>
        <p className="text-textDark text-xl max-w-2xl mx-auto">
          Grassroots Solutions. Diaspora Impact. Community Power.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">Featured Projects</h2>

        {projects.length === 0 ? (
          <p className="text-gray-500 italic">No projects yet. Admin can add them.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {projects.map((project) => (
              <Link to={`/projects/${project.id}`} key={project.id}>
                <div className="card border-l-4 border-primary hover:scale-105 transition-transform">
                  <h3 className="text-lg font-bold text-primary mb-2">{project.title}</h3>
                  <p className="text-textDark">{project.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
