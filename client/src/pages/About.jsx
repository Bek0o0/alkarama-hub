import React from "react";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t, i18n } = useTranslation();
  const dir = i18n.language === "ar" ? "rtl" : "ltr";

  return (
    <div className="min-h-screen" style={{ direction: dir }}>
      {/* brand hero */}
      <section className="bg-brandNavy text-white">
        <div className={`max-w-6xl mx-auto px-6 py-10 flex items-center gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
          <img src="/logo.png" alt="Sudan Emblem" className="w-10 h-10 object-contain" />
          <h1 className="text-3xl md:text-4xl font-extrabold">{t("about.title")}</h1>
        </div>
        <div className="h-1 w-full bg-brandGold" />
      </section>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <div className={`bg-white/95 rounded-2xl shadow-soft p-8 border ${dir === "rtl" ? "text-right" : ""}`}>
          <h2 className="text-xl font-bold text-brandNavy">{t("about.what.title")}</h2>
          <p className="text-gray-700 mt-2">{t("about.what.body")}</p>
        </div>

        <div className={`bg-white/95 rounded-2xl shadow-soft p-8 border ${dir === "rtl" ? "text-right" : ""}`}>
          <h2 className="text-xl font-bold text-brandNavy">{t("about.how.title")}</h2>
          <ul className="list-disc pl-6 rtl:pl-0 rtl:pr-6 text-gray-700 mt-2 space-y-1">
            <li>{t("about.how.point1")}</li>
            <li>{t("about.how.point2")}</li>
            <li>{t("about.how.point3")}</li>
          </ul>
        </div>

        <div className={`bg-white/95 rounded-2xl shadow-soft p-8 border ${dir === "rtl" ? "text-right" : ""}`}>
          <h2 className="text-xl font-bold text-brandNavy">{t("about.safety.title")}</h2>
          <p className="text-gray-700 mt-2">{t("about.safety.body")}</p>
        </div>
      </div>
    </div>
  );
}
