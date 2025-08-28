export function applyDir(lang) {
  const rtl = lang && lang.toLowerCase().startsWith("ar");
  const html = document.documentElement;
  html.setAttribute("dir", rtl ? "rtl" : "ltr");
  html.setAttribute("lang", lang || "en");
}
