// src/pages/AdminSections/AdminMatching.jsx

import React, { useEffect, useState } from "react";
import { matchProfessionalsToProject } from "../../utils/matching";

const AdminMatching = () => {
  const [projects, setProjects] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const projectsRes = await fetch("http://localhost:5000/projects")
      const usersRes = await fetch("http://localhost:5000/users")
      const projectsData = await projectsRes.json();
      const usersData = await usersRes.json();
      const diaspora = usersData.filter((u) => u.role === "user" && u.profession);

      setProjects(projectsData);
      setProfessionals(diaspora);

      const results = projectsData.map((project) => {
        const matchedPros = matchProfessionalsToProject(project, diaspora);
        return { project, professionals: matchedPros };
      });

      setMatches(results);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Project-Professional Matching</h2>
      {matches.length === 0 ? (
        <p>No matches found.</p>
      ) : (
        <div className="space-y-6">
          {matches.map(({ project, professionals }) => (
            <div key={project.id} className="border p-4 rounded shadow bg-white">
              <h3 className="text-lg font-semibold text-primary">{project.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{project.summary}</p>
              {professionals.length === 0 ? (
                <p className="text-sm text-red-500">No matching professionals found</p>
              ) : (
                <ul className="list-disc ml-6">
                  {professionals.map((pro) => (
                    <li key={pro.id}>
                      {pro.fullName} - {pro.profession} ({pro.country})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMatching;
