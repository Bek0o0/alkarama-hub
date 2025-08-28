import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ar from "./locales/ar/common.json";
import en from "./locales/en/common.json";

const applyDir = (lng) => {
  const dir = lng && lng.toLowerCase().startsWith("ar") ? "rtl" : "ltr";
  const html = document.documentElement;
  html.setAttribute("lang", lng || "ar");
  html.setAttribute("dir", dir);
  document.body.classList.toggle("rtl", dir === "rtl");
  document.body.classList.toggle("ltr", dir === "ltr");
};

const saved = localStorage.getItem("i18nextLng");
const initialLng = saved || "ar";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { ar: { translation: ar }, en: { translation: en } },
    fallbackLng: "ar",
    lng: initialLng,
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage"],
      caches: ["localStorage"],
    },
    load: "languageOnly",
  });

i18n.on("languageChanged", (lng) => {
  const clean = (lng || "ar").split("-")[0];
  localStorage.setItem("i18nextLng", clean);
  applyDir(clean);
});

applyDir(initialLng);

export default i18n;
