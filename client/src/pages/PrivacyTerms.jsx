import React from "react";
import { useTranslation } from "react-i18next";

export default function PrivacyTerms() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  return (
    <div className="max-w-4xl mx-auto py-16 px-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="bg-white/90 rounded-2xl shadow-soft p-8 space-y-8">
        <header>
          <h1 className="text-4xl font-extrabold text-brandNavy text-center">
            {t("privacy.title")}
          </h1>
          <p className="text-gray-600 text-center mt-2">{t("privacy.updated")}</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-brandNavy">
            {t("privacy.sectionPrivacy")}
          </h2>
          <p className="text-textDark">{t("privacy.intro")}</p>

          {/* list */}
          <ul
            className={`list-disc list-inside text-textDark space-y-1 ${
              isRTL ? "text-right" : ""
            }`}
          >
            <li>
              <strong>{t("privacy.items.accounts.label")} </strong>
              {t("privacy.items.accounts.body")}
            </li>
            <li>
              <strong>{t("privacy.items.reports.label")} </strong>
              {t("privacy.items.reports.body")}
            </li>
            <li>
              <strong>{t("privacy.items.files.label")} </strong>
              {t("privacy.items.files.body")}
            </li>
            <li>
              <strong>{t("privacy.items.storage.label")} </strong>
              {t("privacy.items.storage.body")}
            </li>
            <li>
              <strong>{t("privacy.items.retention.label")} </strong>
              {t("privacy.items.retention.body")}
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-brandNavy">
            {t("privacy.sectionTerms")}
          </h2>

          <ul
            className={`list-disc list-inside text-textDark space-y-2 ${
              isRTL ? "text-right" : ""
            }`}
          >
            <li>{t("privacy.terms.one")}</li>
            <li>{t("privacy.terms.two")}</li>
            <li>{t("privacy.terms.three")}</li>
            <li>{t("privacy.terms.four")}</li>
          </ul>
        </section>

        <footer className="pt-4 border-t text-sm text-gray-600">
          {t("privacy.footer")}
        </footer>
      </div>
    </div>
  );
}
