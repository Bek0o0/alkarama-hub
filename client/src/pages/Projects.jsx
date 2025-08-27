import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const userEmail = localStorage.getItem("userEmail");
  const userName =
    localStorage.getItem("userName") ||
    localStorage.getItem("fullName") ||
    "";

  useEffect(() => {
    fetch("http://localhost:5000/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data || []))
      .catch(() => setProjects([])); // <-- fixed: closed ) properly
  }, []);

  const postInterest = async (projectId, title) => {
    if (!userEmail) {
      alert("Please login first to register your interest.");
      return;
    }
    try {
      const payload = {
        id: Date.now().toString(),
        projectId,
        projectTitle: title,
        userEmail,
        userName: userName || "N/A",
        timestamp: new Date().toISOString(),
      };
      await fetch("http://localhost:5000/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      alert("Thanks! Your interest was recorded for admin review.");
    } catch (e) {
      console.error("Failed to submit interest:", e);
      alert("Could not submit interest. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-brandNavy mb-8 text-center">
        Rebuilding Projects
      </h1>

      {projects.length === 0 ? (
        <p className="text-center text-gray-500 italic">No projects available.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => {
            const cost = Number(p.cost || 0);
            const donated = Number(p.donated || 0);
            const progress = cost ? Math.min((donated / cost) * 100, 100) : 0;

            return (
              <div
                key={p.id}
                className="card border-l-4 border-brandGold hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <Link
                    to={`/projects/${p.id}`}
                    className="text-xl font-semibold text-brandNavy hover:underline"
                  >
                    {p.title}
                  </Link>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                    Trusted
                  </span>
                </div>

                <p className="text-gray-700 text-sm mt-1">{p.summary}</p>

                <div className="mt-3">
                  <div className="w-full h-2 bg-gray-200 rounded">
                    <div
                      className="h-2 bg-green-600 rounded"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    ${donated.toLocaleString()} / ${cost.toLocaleString()}
                  </p>
                </div>

                {Array.isArray(p.tags) && p.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex gap-3">
                  <Link to={`/projects/${p.id}`} className="btn-secondary">
                    View Details
                  </Link>
                  <button
                    className="btn-primary"
                    onClick={() => postInterest(p.id, p.title)}
                  >
                    I’m Interested
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Projects;
