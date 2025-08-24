export function generatePublicPost(report) {
  const date = new Date(report.createdAt || report.date).toLocaleString();
  const location = report.location || "an undisclosed location";
  const dept = report.department || "a public institution";
  const summary = report.title || "a civic concern";
  const employee = report.person || "an unidentified employee";

  return `🚨 Incident Report: ${summary}

A civic concern was reported involving ${employee} at ${dept}, located in ${location}, on ${date}. 

The incident report has remained unresolved for over 30 days and is now shared to raise public awareness and accountability.

#Sudan #Transparency #AlkaramaHub #CivicWatch`;
}
