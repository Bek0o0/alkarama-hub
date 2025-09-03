import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLocalized } from "../utils/i18nContent";
import { API_BASE } from "../apiBase";

const Projects = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const [projects, setProjects] = useState([]);
  const [interestedMap, setInterestedMap] = useState({});
  const [busyMap, setBusyMap] = useState({});
  const inflight = useRef(new Set());

  const userEmailRaw = localStorage.getItem("userEmail") || "";
  const userEmail = userEmailRaw.trim();
  const userEmailLower = useMemo(() => userEmail.toLowerCase(), [userEmail]);
  const userName =
    localStorage.getItem("userName") ||
    localStorage.getItem("fullName") ||
    "";

  const API = useMemo(
    () => API_BASE || process.env.REACT_APP_API || "http://localhost:5000",
    []
  );

  useEffect(() => {
    fetch(`${API}/projects`)
      .then((res) => res.json())
      .then((data) => setProjects(data || []))
      .catch(() => setProjects([]));
  }, [API]);

  const setBusy = (projectId, value) =>
    setBusyMap((m) => ({ ...m, [String(projectId)]: !!value }));

  useEffect(() => {
    if (!userEmailLower) return;
    let cancelled = false;

    (async () => {
      try {
        const [a, b] = await Promise.all([
          fetch(`${API}/interests?email=${encodeURIComponent(userEmailLower)}`).then((r) => r.json()),
          fetch(`${API}/interests?userEmail=${encodeURIComponent(userEmailLower)}`).then((r) => r.json()),
        ]);

        let all = [
          ...(Array.isArray(a) ? a : []),
          ...(Array.isArray(b) ? b : []),
        ];

        if (all.length === 0) {
          const allInterests = await fetch(`${API}/interests`).then((r) => r.json());
          if (Array.isArray(allInterests)) {
            all = allInterests.filter((it) => {
              const em = (it?.email || it?.userEmail || "").toLowerCase();
              return em === userEmailLower;
            });
          }
        }

        const map = {};
        for (const it of all) {
          if (it && it.projectId != null) map[String(it.projectId)] = true;
        }
        if (!cancelled) setInterestedMap(map);
      } catch {
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [API, userEmailLower]);

  async function hasServerInterest(projectId) {
    try {
      const list = await fetch(
        `${API}/interests?projectId=${encodeURIComponent(projectId)}`
      ).then((r) => r.json());

      if (!Array.isArray(list)) return false;

      const found = list.some((it) => {
        const em = (it?.email || it?.userEmail || "").toLowerCase();
        return em === userEmailLower;
      });
      return found;
    } catch {
      return false;
    }
  }

  const postInterest = async (projectId, title) => {
    if (!userEmail) {
      alert(t("projectsPage.loginFirst"));
      return;
    }

    const pid = String(projectId);
    if (busyMap[pid] || inflight.current.has(pid)) return;

    if (interestedMap[pid]) {
      alert(
        t("projectsPage.interestAlready") ||
          "You've already registered interest for this project."
      );
      return;
    }

    setBusy(pid, true);
    inflight.current.add(pid);

    try {
      const exists = await hasServerInterest(pid);
      if (exists) {
        setInterestedMap((m) => ({ ...m, [pid]: true }));
        alert(
          t("projectsPage.interestAlready") ||
            "You've already registered interest for this project."
        );
        inflight.current.delete(pid);
        setBusy(pid, false);
        return;
      }

      const nowIso = new Date().toISOString();

      const payload = {
        projectId: pid,
        project: title,
        projectTitle: title, 
        user: userName || "N/A", 
        userName: userName || "N/A",
        email: userEmailLower,
        userEmail: userEmailLower,
        createdAt: nowIso,
        timestamp: nowIso,
      };

      const res = await fetch(`${API}/interests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Create interest failed: ${res.status}`);
      }

      setInterestedMap((m) => ({ ...m, [pid]: true }));
      alert(t("projectsPage.interestOk"));
    } catch (e) {
      console.error("Failed to submit interest:", e);
      const existsNow = await hasServerInterest(pid);
      if (existsNow) {
        setInterestedMap((m) => ({ ...m, [pid]: true }));
        alert(
          t("projectsPage.interestAlready") ||
            "You've already registered interest for this project."
        );
      } else {
        alert(t("projectsPage.interestFail"));
      }
    } finally {
      inflight.current.delete(pid);
      setBusy(pid, false);
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
            const titleLoc = getLocalized(p, "title", i18n.language);
            const summaryLoc = getLocalized(p, "summary", i18n.language);
            const cover = p.image || p.imageUrl || "";

            const cost = Number(p.cost || 0);
            const donated = Number(p.donated || 0);
            const progress = cost ? Math.min((donated / cost) * 100, 100) : 0;

            const pid = String(p.id);
            const already = !!interestedMap[pid];
            const busy = !!busyMap[pid];
            const disabled = already || busy;

            return (
              <div
                key={p.id}
                className="card border-l-4 border-brandGold hover:shadow-md transition overflow-hidden"
              >
                {cover ? (
                  <Link to={`/projects/${p.id}`}>
                    <img src={cover} alt="" className="w-full h-36 object-cover" />
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
                    {t("projectsPage.viewDetails")}
                  </Link>
                  <button
                    className={`btn-primary ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
                    onClick={() => postInterest(p.id, titleLoc)}
                    disabled={disabled}
                    title={
                      already
                        ? t("projectsPage.interestAlready") ||
                          "You've already registered interest for this project."
                        : ""
                    }
                  >
                    {busy
                      ? t("common.loading") || "Loading…"
                      : already
                      ? t("projectsPage.interested")
                      : t("projectsPage.imInterested")}
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
