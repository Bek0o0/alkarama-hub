
function extractKeywords(textOrArray) {
  if (Array.isArray(textOrArray)) {
    return textOrArray.flatMap(tag => tag.toLowerCase().split(/\W+/));
  }
  if (typeof textOrArray === 'string') {
    return textOrArray.toLowerCase().split(/\W+/);
  }
  return [];
}

export function matchProfessionalsToProject(project, diasporaList) {
  const projectKeywords = [
    ...extractKeywords(project.title),
    ...extractKeywords(project.summary),
    ...extractKeywords(project.tags)
  ];

  return diasporaList
    .map((user) => {
      const expertiseWords = extractKeywords(user.expertise);
      const professionWords = extractKeywords(user.profession);
      const userKeywords = [...expertiseWords, ...professionWords];

      const matchScore = userKeywords.filter(word =>
        projectKeywords.includes(word)
      ).length;

      return { ...user, matchScore };
    })
    .filter(user => user.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function matchReportsToProfessionals(reports, diasporaList) {
  return reports.map((report) => {
    const reportKeywords = extractKeywords(report.title);

    const professionals = diasporaList
      .map((user) => {
        const expertise = extractKeywords(user.expertise);
        const profession = extractKeywords(user.profession);
        const userKeywords = [...expertise, ...profession];

        const score = userKeywords.filter((word) =>
          reportKeywords.includes(word)
        ).length;

        return { ...user, score };
      })
      .filter((user) => user.score > 0)
      .sort((a, b) => b.score - a.score);

    return {
      report,
      professionals,
    };
  });
}


export { extractKeywords as __testOnly_extractKeywords };

export function normalizeAR(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[اأإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ|ئ/g, "ء")
    .replace(/[^\p{L}\p{N}\s,]+/gu, " ")
    .trim();
}

export function unicodeTokens(input) {
  const text = normalizeAR(input);
  const toks = text.match(/\p{L}+\p{M}*|\p{N}+/gu); // letters/numbers
  return toks ? toks : [];
}

export const CANON = {
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

const REVERSE_CANON = (() => {
  const map = new Map();
  Object.entries(CANON).forEach(([canon, list]) => {
    list.forEach(term => map.set(normalizeAR(term), canon));
    map.set(normalizeAR(canon), canon);
  });
  return map;
})();

export function canonicalTokens(source) {
  return unicodeTokens(source).map(tok => REVERSE_CANON.get(tok) || tok);
}

export function scoreCanonical(project, professional) {
  const projectTokens = new Set([
    ...canonicalTokens(project.title || ""),
    ...canonicalTokens(project.summary || ""),
    ...(Array.isArray(project.tags)
      ? project.tags.flatMap(canonicalTokens)
      : canonicalTokens(project.tags || "")),
  ]);

  const proTokens = [
    ...canonicalTokens(professional.expertise || ""),
    ...canonicalTokens(professional.profession || ""),
  ];

  let s = 0;
  for (const tok of proTokens) if (projectTokens.has(tok)) s++;
  return s;
}
