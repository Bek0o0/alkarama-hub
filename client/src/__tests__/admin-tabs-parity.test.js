// src/__tests__/admin-tabs-parity.test.js
import i18n from "../i18n";

describe("Admin tabs parity between EN and AR", () => {
  const ns = i18n.options?.defaultNS || "translation";
  const en = i18n.getResourceBundle("en", ns);
  const ar = i18n.getResourceBundle("ar", ns);

  test("admin.tabs keys match 1:1", () => {
    const enTabs = en?.admin?.tabs || {};
    const arTabs = ar?.admin?.tabs || {};
    const enKeys = Object.keys(enTabs).sort();
    const arKeys = Object.keys(arTabs).sort();
    expect(enKeys).toEqual(arKeys);
  });
});
