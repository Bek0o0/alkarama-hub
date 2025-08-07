import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Failed to load projects:", err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">
        Explore All Rebuilding Projects
      </h1>

      {projects.length === 0 ? (
        <p className="text-center text-gray-500 italic">No projects available.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              to={`/projects/${project.id}`}
              key={project.id}
              className="block bg-white p-6 rounded-xl shadow hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-primary mb-2">{project.title}</h2>
              <p className="text-gray-600 text-sm">{project.summary}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
