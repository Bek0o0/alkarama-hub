import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLocalized } from "../utils/i18nContent"; // ✅ added

const Projects = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

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
      .catch(() => setProjects([]));
  }, []);

  const postInterest = async (projectId, title) => {
    if (!userEmail) {
      alert(t("projectsPublic.loginFirst"));
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
      alert(t("projectsPublic.interestOk"));
    } catch (e) {
      console.error("Failed to submit interest:", e);
      alert(t("projectsPublic.interestFail"));
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4" dir={isRTL ? "rtl" : "ltr"}>
      <h1 className="text-4xl font-bold text-brandNavy mb-8 text-center">
        {t("projectsPage.title")}
      </h1>

      {projects.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          {t("projectsPage.empty")}
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => {
            // ✅ localized fields
            const titleLoc = getLocalized(p, "title", i18n.language);
            const summaryLoc = getLocalized(p, "summary", i18n.language);

            // ✅ prefer base64 `image`, then `imageUrl`
            const cover = p.image || p.imageUrl || "";

            const cost = Number(p.cost || 0);
            const donated = Number(p.donated || 0);
            const progress = cost ? Math.min((donated / cost) * 100, 100) : 0;

            return (
              <div
                key={p.id}
                className="card border-l-4 border-brandGold hover:shadow-md transition overflow-hidden"
              >
                {/* ✅ optional image */}
                {cover ? (
                  <Link to={`/projects/${p.id}`}>
                    <img
                      src={cover}
                      alt=""
                      className="w-full h-36 object-cover"
                    />
                  </Link>
                ) : null}

                <div className="flex items-center justify-between mt-3">
                  <Link
                    to={`/projects/${p.id}`}
                    className="text-xl font-semibold text-brandNavy hover:underline"
                    dir="auto"
                  >
                    {titleLoc}
                  </Link>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                    {t("projectsPage.trusted")}
                  </span>
                </div>

                <p className="text-gray-700 text-sm mt-1" dir="auto">
                  {summaryLoc}
                </p>

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
                    {p.tags.map((tTag) => (
                      <span
                        key={tTag}
                        className="text-[11px] bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        dir="auto"
                      >
                        {tTag}
                      </span>
                    ))}
                  </div>
                )}

                <div className={`mt-4 flex gap-3 ${isRTL ? "justify-start" : ""}`}>
                  <Link to={`/projects/${p.id}`} className="btn-secondary">
                    {t("projectsPage.view")}
                  </Link>
                  <button
                    className="btn-primary"
                    onClick={() => postInterest(p.id, titleLoc)}
                  >
                    {t("projectsPage.imInterested")}
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
