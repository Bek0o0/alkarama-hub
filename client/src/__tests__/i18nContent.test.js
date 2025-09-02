import { getLocalized } from "../utils/i18nContent";

describe("getLocalized", () => {
  const obj = { title: "EN base", title_ar: "AR title" };

  test("returns AR when language is ar and value exists", () => {
    expect(getLocalized(obj, "title", "ar")).toBe("AR title");
  });

  test("falls back to base/EN", () => {
    expect(getLocalized(obj, "summary", "ar")).toBe("");
    expect(getLocalized(obj, "title", "en")).toBe("EN base");
  });
});
