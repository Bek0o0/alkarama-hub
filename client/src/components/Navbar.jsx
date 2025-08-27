import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const onHome = location.pathname === "/";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold text-brandNavy tracking-wide hover:opacity-80 transition">
          Alkarama Hub
        </Link>

        <ul className="flex flex-wrap items-center space-x-4 text-sm font-medium">
          <li><Link to="/" className="text-gray-700 hover:text-brandNavy">Home</Link></li>
          {/* Removed About & Projects to avoid duplication on the landing page */}
          <li><Link to="/public-reports" className="text-gray-700 hover:text-brandNavy">Public Reports</Link></li>

          {userRole === "user" && (
            <>
              {/* Hide Submit on Home only, since the hero has the main CTA there */}
              {!onHome && (
                <li><Link to="/submit-report" className="text-gray-700 hover:text-brandNavy">Submit Report</Link></li>
              )}
              <li><Link to="/my-reports" className="text-gray-700 hover:text-brandNavy">My Reports</Link></li>
              <li><Link to="/profile" className="text-gray-700 hover:text-brandNavy">My Profile</Link></li>
            </>
          )}

          {userRole === "admin" && (
            <li><Link to="/admin" className="text-gray-700 hover:text-brandNavy">Admin</Link></li>
          )}

          {!userRole && (
            <>
              <li><Link to="/login" className="text-brandGold hover:underline">Login</Link></li>
              <li><Link to="/signup" className="text-gray-700 hover:text-brandNavy">Sign Up</Link></li>
            </>
          )}

          {userRole && (
            <li>
              <button onClick={handleLogout} className="text-brandGold hover:underline transition">
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
