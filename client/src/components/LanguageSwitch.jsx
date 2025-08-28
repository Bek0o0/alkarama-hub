import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitch() {
  const { i18n } = useTranslation();
  const lng = i18n.language === "ar" ? "ar" : "en";

  const set = (code) => {
    if (code !== lng) i18n.changeLanguage(code);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => set("en")}
        className={`px-2 py-1 rounded ${lng === "en" ? "bg-brandGold text-black" : "text-gray-700 hover:underline"}`}
        aria-pressed={lng === "en"}
      >
        EN
      </button>
      <span className="text-gray-300">|</span>
      <button
        onClick={() => set("ar")}
        className={`px-2 py-1 rounded ${lng === "ar" ? "bg-brandGold text-black" : "text-gray-700 hover:underline"}`}
        aria-pressed={lng === "ar"}
      >
        AR
      </button>
    </div>
  );
}
