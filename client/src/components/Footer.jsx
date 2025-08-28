import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const dir = i18n.language === "ar" ? "rtl" : "ltr";

  return (
    <footer className="mt-20 bg-brandNavy text-white" style={{ direction: dir }}>
      <div className="h-1 w-full bg-brandGold" />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className={`grid md:grid-cols-4 gap-8 ${dir === "rtl" ? "text-right" : ""}`}>
          {/* Brand */}
          <div>
            <div className={`flex items-center gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              <img src="/logo.png" alt="Sudan Emblem" className="w-10 h-10 object-contain" />
              <h3 className="text-xl font-extrabold">{t("brand")}</h3>
            </div>
            <p className="text-white/80 text-sm mt-2">{t("footer.tagline")}</p>
            <p className="text-white/60 text-xs mt-4">
              © {new Date().getFullYear()} {t("brand")} — {t("footer.rights")}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-brandGold">{t("footer.quick")}</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/" className="hover:underline">{t("nav.home")}</Link></li>
              <li><Link to="/about" className="hover:underline">{t("nav.about")}</Link></li>
              <li><Link to="/projects" className="hover:underline">{t("nav.projects")}</Link></li>
              <li><Link to="/public-reports" className="hover:underline">{t("nav.publicReports")}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-brandGold">{t("footer.support")}</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:underline">{t("footer.privacy")}</Link></li>
              <li>
                <a href="#accessibility" className="hover:underline">{t("footer.accessibility")}</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-brandGold">{t("footer.contact")}</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="mailto:info@alkarama.example" className="hover:underline">
                  info@alkarama.example
                </a>
              </li>
              <li>
                <a href="tel:+249000000000" className="hover:underline">+249 000 000 000</a>
              </li>
              <li>{t("footer.locations")}</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
