// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "./LanguageSwitch";

const Navbar = ({ userRole }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  // Hide Projects/About in nav on Home (your previous duplication rule)
  const hideProjectLinksOnHome = pathname === "/";
  const isAdmin = userRole === "admin";
  const isUser = userRole === "user";

  // dir-aware spacing (keeps nice gaps even in RTL)
  const dir = i18n.language === "ar" ? "rtl" : "ltr";

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-extrabold text-brandNavy tracking-wide hover:opacity-80 transition"
        >
          {t("brand")}
        </Link>

        <ul
          className="flex flex-wrap items-center text-sm font-medium gap-4"
          style={{ direction: dir }}
        >
          <li><Link to="/" className="text-gray-700 hover:text-brandNavy">{t("nav.home")}</Link></li>

          {/* About */}
          {!hideProjectLinksOnHome && (
            <li><Link to="/about" className="text-gray-700 hover:text-brandNavy">{t("nav.about")}</Link></li>
          )}

          {/* Projects (hidden on Home to avoid duplication) */}
          {!hideProjectLinksOnHome && (
            <li><Link to="/projects" className="text-gray-700 hover:text-brandNavy">{t("nav.projects")}</Link></li>
          )}

          {/* Public Reports always */}
          <li><Link to="/public-reports" className="text-gray-700 hover:text-brandNavy">{t("nav.publicReports")}</Link></li>

          {/* USER links */}
          {isUser && (
            <>
              <li><Link to="/submit-report" className="text-gray-700 hover:text-brandNavy">{t("nav.submitReport")}</Link></li>
              <li><Link to="/my-reports" className="text-gray-700 hover:text-brandNavy">{t("nav.myReports")}</Link></li>
              <li><Link to="/profile" className="text-gray-700 hover:text-brandNavy">{t("nav.profile")}</Link></li>
            </>
          )}

          {/* ADMIN link */}
          {isAdmin && (
            <li><Link to="/admin" className="text-gray-700 hover:text-brandNavy">{t("nav.admin")}</Link></li>
          )}

          {/* AUTH */}
          {!userRole && (
            <>
              <li><Link to="/login" className="text-brandGold hover:underline">{t("nav.login")}</Link></li>
              <li><Link to="/signup" className="text-gray-700 hover:text-brandNavy">{t("nav.signup")}</Link></li>
            </>
          )}

          {userRole && (
            <li>
              <button onClick={handleLogout} className="text-brandGold hover:underline transition">
                {t("nav.logout")}
              </button>
            </li>
          )}

          {/* Language */}
          <li className="pl-2 border-l border-gray-200">
            <LanguageSwitch />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
