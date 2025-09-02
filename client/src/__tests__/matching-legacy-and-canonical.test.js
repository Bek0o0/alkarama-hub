import {
  __testOnly_extractKeywords as legacyExtract,
  matchProfessionalsToProject,
  matchReportsToProfessionals,
  normalizeAR,
  unicodeTokens,
  canonicalTokens,
  scoreCanonical,
} from "../utils/matching";

describe("legacy matching (existing behavior)", () => {
  test("extractKeywords splits ASCII words (legacy)", () => {
    expect(legacyExtract("Health, hospital & construction").sort())
      .toEqual(["health", "hospital", "construction"].sort());
  });

  test("matches by simple overlap", () => {
    const project = {
      title: "Rebuild Airport",
      summary: "Infrastructure and construction",
      tags: ["construction", "airport"]
    };
    const diaspora = [
      { id: "u1", profession: "Engineer", expertise: "construction" },
      { id: "u2", profession: "Doctor", expertise: "surgery" },
    ];

    const res = matchProfessionalsToProject(project, diaspora);
    expect(res.map(r => r.id)).toContain("u1");
    expect(res.map(r => r.id)).not.toContain("u2");
  });

  test("report to pros simple overlap", () => {
    const reports = [{ id: "r1", title: "Hospital needs repair" }];
    const diaspora = [{ id: "u1", profession: "hospital engineer", expertise: "maintenance" }];
    const res = matchReportsToProfessionals(reports, diaspora);
    expect(res[0].report.id).toBe("r1");
    expect(res[0].professionals.map(p => p.id)).toContain("u1");
  });
});

describe("canonical matching (AR/EN tolerant)", () => {
  test("normalizeAR unifies common Arabic variants", () => {
    expect(normalizeAR("إعمار")).toBe(normalizeAR("اعمار"));
    expect(normalizeAR("هندسة")).toBe(normalizeAR("هندسه"));
  });

  test("unicodeTokens keeps Arabic words", () => {
    expect(unicodeTokens("إعادة بناء مطار")).toEqual(["اعاده", "بناء", "مطار"]);
  });

  test("canonicalTokens map Arabic & English to same buckets", () => {
    const en = canonicalTokens("construction software hospital");
    const ar = canonicalTokens("انشاء برمجيات مستشفى");
    en.forEach(tok => expect(ar).toContain(tok));
  });

  test("scoreCanonical matches Arabic professional to English project", () => {
    const project = {
      title: "Rebuild Khartoum Airport",
      summary: "Infrastructure and construction",
      tags: ["construction", "airport"]
    };
    const pro = { profession: "مهندس", expertise: "انشاء" };
    const s = scoreCanonical(project, pro);
    expect(s).toBeGreaterThan(0);
  });
});
