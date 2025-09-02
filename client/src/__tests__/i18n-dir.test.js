
import i18n from "../i18n";

describe("i18n dir()", () => {
  test("Arabic is rtl", () => {
    expect(i18n.dir("ar")).toBe("rtl");
  });
  test("English is ltr", () => {
    expect(i18n.dir("en")).toBe("ltr");
  });
});
