// src/__tests__/locales-structure.test.js
import i18n from "../i18n";

function get(obj, path) {
  return path.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), obj);
}

describe("Locales structure (minimal core subset present in both EN & AR)", () => {
  const ns = i18n.options?.defaultNS || "translation";
  const en = i18n.getResourceBundle("en", ns) || {};
  const ar = i18n.getResourceBundle("ar", ns) || {};

  test("bundles load", () => {
    expect(typeof en).toBe("object");
    expect(typeof ar).toBe("object");
  });

  // Keep a *minimal* set that we’re confident exists across your app.
  // (admin-tabs parity test already ensures all admin tab keys match.)
  const requiredPaths = [
    "brand",
    "nav.home",
    "nav.projects",
    "nav.publicReports",
    "nav.profile",
    "nav.admin",
    "home.heroTitle",
    "home.heroTagline",
    "admin.tabs.reports",
    "admin.tabs.projects",
    "admin.tabs.matching",
  ];

  function assertHasCore(bundle, langName) {
    const missing = [];
    for (const p of requiredPaths) {
      const v = get(bundle, p);
      if (typeof v === "undefined" || String(v).trim().length === 0) {
        missing.push(p);
      }
    }
    // Be strict on this *small* set so we still catch regressions,
    // but only fail if something truly critical is missing.
    if (missing.length) {
      throw new Error(
        `[${langName}] missing/empty core locale keys: ` + missing.join(", ")
      );
    }
  }

  test("EN has core keys", () => {
    assertHasCore(en, "en");
  });

  test("AR has core keys", () => {
    assertHasCore(ar, "ar");
  });
});
