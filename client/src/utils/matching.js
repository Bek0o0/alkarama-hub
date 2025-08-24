// src/utils/matching.js

function extractKeywords(textOrArray) {
  if (Array.isArray(textOrArray)) {
    return textOrArray.flatMap((tag) =>
      String(tag).toLowerCase().split(/\W+/).filter(Boolean)
    );
  }
  if (typeof textOrArray === "string") {
    return textOrArray.toLowerCase().split(/\W+/).filter(Boolean);
  }
  if (textOrArray && typeof textOrArray === "object") {
    // join values if someone passed an object with tags/fields accidentally
    return Object.values(textOrArray)
      .map((v) => String(v))
      .join(" ")
      .toLowerCase()
      .split(/\W+/)
      .filter(Boolean);
  }
  return [];
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  // if a single user object got passed, wrap it
  return [value];
}

/**
 * Main API used across the app. KEEP THIS NAME to avoid refactors.
 * @param {Object} project
 * @param {Array|Object} userList - array of users OR a single user
 * @returns {Array} ranked users with { ...user, matchScore }
 */
export function matchProfessionalsToProject(project = {}, userList = []) {
  const users = toArray(userList);

  const projectKeywords = [
    ...extractKeywords(project.title),
    ...extractKeywords(project.summary),
    ...extractKeywords(project.tags),
  ];

  return users
    .map((user) => {
      const expertiseWords = extractKeywords(user?.expertise);
      const professionWords = extractKeywords(user?.profession);
      const userKeywords = [...expertiseWords, ...professionWords];

      const matchScore = userKeywords.filter((word) =>
        projectKeywords.includes(word)
      ).length;

      return { ...user, matchScore };
    })
    .filter((u) => (u.matchScore || 0) > 0)
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
}

/* Optional alias if some newer code calls this name */
export const matchVolunteersToProject = matchProfessionalsToProject;

/**
 * (If you still use this anywhere)
 * Given reports + users returns [{report, professionals:[...ranked]}]
 */
export function matchReportsToProfessionals(reports = [], userList = []) {
  const users = toArray(userList);
  return toArray(reports).map((report) => {
    const reportKeywords = extractKeywords(report?.title);
    const professionals = users
      .map((user) => {
        const expertise = extractKeywords(user?.expertise);
        const profession = extractKeywords(user?.profession);
        const userKeywords = [...expertise, ...profession];
        const score = userKeywords.filter((w) => reportKeywords.includes(w)).length;
        return { ...user, score };
      })
      .filter((u) => (u.score || 0) > 0)
      .sort((a, b) => (b.score || 0) - (a.score || 0));
    return { report, professionals };
  });
}
