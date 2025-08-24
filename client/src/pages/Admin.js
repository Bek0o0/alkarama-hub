import React, { useState } from "react";
import AdminReports from "./AdminSections/AdminReports";
import AdminProfessionals from "./AdminSections/AdminProfessionals";
import AdminProjects from "./AdminSections/AdminProjects";
import AdminUsers from "./AdminSections/AdminUsers";
import AdminDonations from "./AdminSections/AdminDonations";
import AdminMatching from "./AdminSections/AdminMatching"; 

const Admin = () => {
  const [activeTab, setActiveTab] = useState("reports");

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="bg-white/90 shadow-xl rounded-xl p-8">
        <h1 className="text-4xl font-extrabold text-primary mb-10 border-b pb-4 text-center">
          Admin Dashboard
        </h1>

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
        </div>

        {/* Tab Panels */}
        {activeTab === "reports" && <AdminReports />}
        {activeTab === "professionals" && <AdminProfessionals />}
        {activeTab === "projects" && <AdminProjects />}
        {activeTab === "users" && <AdminUsers />}
        {activeTab === "donations" && <AdminDonations />}
        {activeTab === "matching" && <AdminMatching />}
      </div>
    </div>
  );
};

export default Admin;
