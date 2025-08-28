const AR_DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;

const SYNONYMS = {
  // construction
  "construction": ["construction", "constructions", "بناء", "اعمار", "إعمار", "إنشاءات", "تشييد"],
  // software / IT
  "software": ["software", "sw", "it", "برمجة", "برمجيات", "تطبيقات", "تقنية"],
  // engineering
  "engineering": ["engineering", "eng", "هندسة", "مهندس", "مهندسين"],
  // education
  "education": ["education", "ed", "تعليم", "تدريس", "مدارس", "جامعات"],
  // medical/health
  "medical": ["medical", "health", "صحة", "طبي", "طبية"],
  // security
  "security": ["security", "أمن"],
  // infrastructure
  "infrastructure": ["infrastructure", "بنية", "بنية تحتية"],
};

export function stripDiacritics(s = "") {
  return s.replace(AR_DIACRITICS, "");
}

export function normalizeToken(s = "") {
  const noDia = stripDiacritics(String(s).trim().toLowerCase());
  return noDia.normalize("NFKD");
}

export function expandToCanonical(tokens = []) {
  const canon = new Set();
  const normTokens = tokens.map(normalizeToken);

  for (const tok of normTokens) {
    let matched = false;
    for (const [key, variants] of Object.entries(SYNONYMS)) {
      if (variants.map(normalizeToken).includes(tok)) {
        canon.add(key); matched = true; break;
      }
    }
    if (!matched && tok) canon.add(tok);
  }
  return [...canon];
}

export function tokenizeCSV(csv = "") {
  return csv
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

export function bestText(i18n, obj, baseKey) {
  const lang = i18n?.language || "en";
  const ar = obj[`${baseKey}_ar`];
  const en = obj[`${baseKey}_en`];
  if (lang === "ar") return ar || obj[baseKey] || en || "";
  return en || obj[baseKey] || ar || "";
}
