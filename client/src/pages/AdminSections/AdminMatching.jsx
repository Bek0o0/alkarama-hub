import React, { useEffect, useMemo, useState } from "react";

// Try to use your existing matcher, but fall back safely if not found.
let externalMatcher;
try {
  // Adjust path if your matching file is elsewhere:
  // from AdminSections/ to project root: "../../matching"
  // (This matches the structure you've been using in other Admin pages.)
  // eslint-disable-next-line global-require, import/no-unresolved
  externalMatcher = require("../../matching");
} catch (e) {
  externalMatcher = null;
}

// Fallback simple matcher: tags ∩ expertise + profession keyword presence
function defaultMatch(projects, users) {
  const norm = (s) => (s || "").toString().toLowerCase();
  const tokenize = (s) =>
    norm(s)
      .split(/[^\p{L}\p{N}]+/u)
      .filter(Boolean);

  return projects.map((p) => {
    const pTags = Array.isArray(p.tags) ? p.tags.map(norm) : [];
    const pTitleTokens = tokenize(p.title);
    const pSummaryTokens = tokenize(p.summary);
    const pTokens = new Set([...pTags, ...pTitleTokens, ...pSummaryTokens]);

    const matches = users.map((u) => {
      const expertiseArr = Array.isArray(u.expertise)
        ? u.expertise.map(norm)
        : norm(u.expertise || "").split(",").map((x) => x.trim()).filter(Boolean);

      const profTokens = tokenize(u.profession);
      let score = 0;

      // tag/expertise overlap
      expertiseArr.forEach((x) => {
        if (pTokens.has(x)) score += 2;
      });
      // profession mentions in project title/summary
      profTokens.forEach((x) => {
        if (pTokens.has(x)) score += 1;
      });

      return { user: u, score };
    });

    const ranked = matches
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score);

    return { project: p, matches: ranked };
  });
}

export default function AdminMatching() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [minScore, setMinScore] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [pRes, uRes] = await Promise.all([
          fetch("http://localhost:5000/projects"),
          fetch("http://localhost:5000/users"),
        ]);
        const [pData, uData] = await Promise.all([pRes.json(), uRes.json()]);
        setProjects(Array.isArray(pData) ? pData : []);
        setUsers(Array.isArray(uData) ? uData : []);
      } catch (e) {
        console.error("Matching load failed:", e);
        setProjects([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const results = useMemo(() => {
    if (!projects.length || !users.length) return [];
    let grouped;

    if (externalMatcher && typeof externalMatcher.matchProjectsToProfessionals === "function") {
      try {
        grouped = externalMatcher.matchProjectsToProfessionals(projects, users);
      } catch (e) {
        console.warn("Falling back to default matcher:", e);
        grouped = defaultMatch(projects, users);
      }
    } else {
      grouped = defaultMatch(projects, users);
    }

    const qLower = q.trim().toLowerCase();
    return grouped
      .map((g) => ({
        ...g,
        matches: g.matches.filter((m) => m.score >= Number(minScore || 0)),
      }))
      .filter((g) =>
        qLower
          ? (g.project.title || "").toLowerCase().includes(qLower) ||
            (g.project.summary || "").toLowerCase().includes(qLower)
          : true
      )
      .sort((a, b) => (b.matches[0]?.score || 0) - (a.matches[0]?.score || 0));
  }, [projects, users, q, minScore]);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="bg-white/90 shadow-soft rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
          <h1 className="text-3xl font-extrabold text-brandNavy">Project ↔ Professional Matching</h1>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <input
            className="input md:w-1/2"
            placeholder="Filter projects by title/summary…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-700">Min score</label>
            <input
              type="number"
              min="0"
              className="input w-24"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
            />
            <button
              className="btn-outline"
              onClick={() => {
                setQ("");
                setMinScore(1);
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600 italic">Calculating matches…</p>
        ) : results.length === 0 ? (
          <p className="text-gray-500 italic">No matches available.</p>
        ) : (
          <div className="space-y-8">
            {results.map(({ project, matches }) => (
              <div key={project.id} className="bg-white/95 border-l-4 border-brandGold rounded-xl shadow-soft p-6">
                <h2 className="text-xl font-bold text-brandNavy">{project.title}</h2>
                <p className="text-sm text-gray-600">{project.summary}</p>

                {matches.length === 0 ? (
                  <p className="mt-3 text-gray-500 italic">No professionals meet the threshold.</p>
                ) : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="table">
                      <thead>
                        <tr className="bg-gray-50">
                          <th>Professional</th>
                          <th>Email</th>
                          <th>Profession</th>
                          <th>Expertise</th>
                          <th>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matches.map(({ user, score }) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="font-semibold text-brandNavy">{user.fullName || "—"}</td>
                            <td>{user.email || "—"}</td>
                            <td>{user.profession || "—"}</td>
                            <td>
                              {Array.isArray(user.expertise) && user.expertise.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {user.expertise.map((t) => (
                                    <span key={t} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-400 text-xs italic">None</span>
                              )}
                            </td>
                            <td className="font-semibold">{score}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
