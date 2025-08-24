
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
