import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import AdminReports from "./AdminSections/AdminReports";
import AdminProfessionals from "./AdminSections/AdminProfessionals";
import AdminProjects from "./AdminSections/AdminProjects";
import AdminUsers from "./AdminSections/AdminUsers";
import AdminDonations from "./AdminSections/AdminDonations";
<<<<<<< HEAD
import AdminMatching from "./AdminSections/AdminMatching"; 
=======
import AdminInterests from "./AdminSections/AdminInterests";
import AdminMatching from "./AdminSections/AdminMatching";

const TABS = ["reports", "professionals", "projects", "users", "donations", "interests", "matching"];
>>>>>>> dev

const Admin = () => {
  const [activeTab, setActiveTab] = useState("reports");
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="bg-white/90 shadow-soft rounded-xl p-8">
        <h1 className="text-4xl font-extrabold text-brandNavy mb-8 text-center">
          {t("admin.dashboardTitle", "Admin Dashboard")}
        </h1>

<<<<<<< HEAD
        {/* Tab Navigation */}
        <div className="flex justify-center gap-6 flex-wrap mb-8">
         {["reports", "professionals", "projects", "users", "matching"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-semibold pb-1 border-b-2 ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-primary"
            }`}
          >
            {tab === "reports" && "Civic Reports"}
            {tab === "professionals" && "Professionals"}
            {tab === "projects" && "Rebuilding Projects"}
            {tab === "users" && "Users"}
            {tab === "matching" && "Matching"}
          </button>
        ))}
=======
        {/* Tabs */}
        <div className="flex justify-center gap-4 flex-wrap mb-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-semibold pb-2 border-b-2 transition ${
                activeTab === tab
                  ? "border-brandGold text-brandNavy"
                  : "border-transparent text-gray-600 hover:text-brandNavy"
              }`}
            >
              {tab === "reports" && t("admin.tabs.reports", "Civic Reports")}
              {tab === "professionals" && t("admin.tabs.professionals", "Professionals")}
              {tab === "projects" && t("admin.tabs.projects", "Rebuilding Projects")}
              {tab === "users" && t("admin.tabs.users", "Users")}
              {tab === "donations" && t("admin.tabs.donations", "Donations")}
              {tab === "interests" && t("admin.tabs.interests", "Interests")}
              {tab === "matching" && t("admin.tabs.matching", "Matching")}
            </button>
          ))}
>>>>>>> dev
        </div>

        {/* Panels */}
        {activeTab === "reports" && <AdminReports />}
        {activeTab === "professionals" && <AdminProfessionals />}
        {activeTab === "projects" && <AdminProjects />}
        {activeTab === "users" && <AdminUsers />}
        {activeTab === "donations" && <AdminDonations />}
<<<<<<< HEAD
=======
        {activeTab === "interests" && <AdminInterests />}
>>>>>>> dev
        {activeTab === "matching" && <AdminMatching />}
      </div>
    </div>
  );
};

export default Admin;
