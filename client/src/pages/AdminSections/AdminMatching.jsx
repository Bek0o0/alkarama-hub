import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

export default function AdminMatching() {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();

  const [projects, setProjects] = useState([]);
  const [pros, setPros] = useState([]);
  const [filter, setFilter] = useState("");
  const [minScore, setMinScore] = useState(1);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/projects").then((r) => r.json()),
      fetch("http://localhost:5000/users?role=user").then((r) => r.json()),
    ])
      .then(([pj, us]) => {
        setProjects(pj || []);
        setPros((us || []).filter(Boolean));
      })
      .catch(() => {
        setProjects([]);
        setPros([]);
      });
  }, []);

  const pick = useCallback(
    (obj, baseKey) => {
      const lang = i18n.language || "en";
      const ar = obj[`${baseKey}_ar`];
      const en = obj[`${baseKey}_en`];
      if (lang === "ar") return ar || obj[baseKey] || en || "";
      return en || obj[baseKey] || ar || "";
    },
    [i18n.language]
  );

  // --- Arabic/English normalization + synonym expansion ----------------
  const normalize = useCallback(
    (s) =>
      String(s || "")
        .toLowerCase()
        .replace(/[اأإآ]/g, "ا")
        .replace(/ة/g, "ه")
        .replace(/ى/g, "ي")
        .replace(/ؤ|ئ/g, "ء")
        .replace(/[^\p{L}\p{N}\s,]+/gu, " ")
        .trim(),
    []
  );

  const CANON = {
    construction: ["construction", "انشاء", "إنشاء", "بناء", "اعمار", "إعمار", "تشييد"],
    engineering: ["engineering", "هندسه", "هندسة"],
    software: ["software", "برمجيات", "برمجه", "برمجة", "تقنيه", "تقنية"],
    education: ["education", "تعليم", "مدارس", "جامعات", "جامعة"],
    medical: ["medical", "health", "صحي", "صحه", "طب", "مستشفى", "مستشفي"],
    water: ["water", "مياه"],
    electricity: ["electricity", "power", "كهرباء", "طاقه", "طاقة"],
    logistics: ["logistics", "لوجستيات", "سلاسل", "امداد"],
    finance: ["finance", "تمويل", "مالي"],
    agriculture: ["agriculture", "زراعه", "زراعة"],
    infrastructure: ["infrastructure", "بنيه", "بنية", "البنية", "البنيه", "بنيةتحتية", "البنيةالتحتية"],
    airport: ["airport", "مطار"],
    hospital: ["hospital", "مستشفى", "مستشفي"],
    security: ["security", "امن", "أمن"],
  };

  const REVERSE = useMemo(() => {
    const map = new Map();
    for (const [canon, arr] of Object.entries(CANON)) {
      for (const term of arr) map.set(normalize(term), canon);
      map.set(normalize(canon), canon);
    }
    return map;
  }, [normalize]);

  const toCanonicalTokens = useCallback(
    (source) => {
      const toks = normalize(source)
        .split(/[\s,]+/)
        .filter(Boolean);
      const out = [];
      for (const tok of toks) {
        out.push(REVERSE.get(tok) || tok);
      }
      return out;
    },
    [normalize, REVERSE]
  );
  // --------------------------------------------------------------------

  const score = useCallback(
    (project, pro) => {
      const pTags = Array.isArray(project.tags)
        ? project.tags
        : String(project.tags || "")
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean);

      const projectText = [pick(project, "title"), pick(project, "summary")].join(" ");

      const pCanon = new Set([
        ...pTags.flatMap((x) => toCanonicalTokens(x)),
        ...toCanonicalTokens(projectText),
      ]);

      const proText = [
        pro.profession || pro.profile?.profession || "",
        pro.expertise || pro.profile?.expertise || "",
      ].join(",");

      const proCanon = toCanonicalTokens(proText);

      let s = 0;
      for (const tok of proCanon) if (pCanon.has(tok)) s++;
      return s;
    },
    [pick, toCanonicalTokens]
  );

  const filtered = useMemo(() => {
    const f = normalize(filter || "");
    const min = Number(minScore) || 0;

    return projects
      .filter((p) => {
        const hay = normalize(
          [pick(p, "title"), pick(p, "summary"), (p.tags || []).join(",")].join(" ")
        );
        return !f || hay.includes(f);
      })
      .map((p) => {
        const matches = pros
          .map((u) => ({ u, s: score(p, u) }))
          .filter((m) => m.s >= min)
          .sort((a, b) => b.s - a.s);
        return { p, matches };
      });
  }, [projects, pros, filter, minScore, pick, score, normalize]);

  return (
    <div className="space-y-6" dir={dir}>
      <div className="flex gap-3 items-center">
        <input
          className="input"
          placeholder={t("admin.matching.filterPlaceholder")}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <label className="label">{t("admin.matching.minScore")}</label>
        <input
          className="input w-24"
          type="number"
          min={0}
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value) || 0)}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">{t("admin.matching.empty")}</p>
      ) : (
        filtered.map(({ p, matches }) => (
          <div
            key={p.id}
            className="bg-white/90 rounded-xl shadow-soft p-5 space-y-2 border-l-4 border-brandGold"
          >
            <h3 className="text-brandNavy font-bold text-lg">{pick(p, "title")}</h3>
            <p className="text-sm text-gray-600">{pick(p, "summary")}</p>

            {matches.length === 0 ? (
              <p className="text-sm text-gray-500">{t("admin.matching.noneMeet")}</p>
            ) : (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-gray-500">
                    <tr>
                      <th className="text-start p-2">{t("admin.matching.th.professional")}</th>
                      <th className="text-start p-2 hidden md:table-cell">
                        {t("admin.matching.th.email")}
                      </th>
                      <th className="text-start p-2 hidden md:table-cell">
                        {t("admin.matching.th.profession")}
                      </th>
                      <th className="text-start p-2 hidden md:table-cell">
                        {t("admin.matching.th.expertise")}
                      </th>
                      <th className="text-start p-2">{t("admin.matching.th.score")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map(({ u, s }) => (
                      <tr key={u.id} className="border-t">
                        <td className="p-2">{u.fullName}</td>
                        <td className="p-2 hidden md:table-cell">{u.email}</td>
                        <td className="p-2 hidden md:table-cell">
                          {u.profession || u.profile?.profession || "—"}
                        </td>
                        <td className="p-2 hidden md:table-cell">
                          {u.expertise || u.profile?.expertise || t("common.none")}
                        </td>
                        <td className="p-2 font-semibold">{s}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
