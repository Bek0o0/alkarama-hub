// utils/matching.js

/**
 * Matches diaspora users to a given project based on keyword overlap.
 * @param {Array} users - List of registered users (with expertise, country, etc.)
 * @param {Object} project - A project object with a title and description.
 * @returns {Array} Sorted list of best-matching users.
 */
export function matchVolunteersToProject(users, project) {
  const keywords = extractKeywords(project.title + " " + project.description);

  return users
    .map((user) => {
      const expertiseText = user.expertise?.toLowerCase() || "";
      const score = keywords.filter((word) => expertiseText.includes(word)).length;
      return { ...user, matchScore: score };
    })
    .filter((user) => user.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}

function extractKeywords(text) {
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 3 && !stopWords.includes(w));
}

const stopWords = [
  "this",
  "with",
  "from",
  "that",
  "have",
  "their",
  "about",
  "into",
  "been",
  "more",
  "will",
  "your",
  "than",
  "what",
  "them",
  "they",
  "also",
  "some",
  "only",
];
