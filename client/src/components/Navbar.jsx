import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ userRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-extrabold text-primary tracking-wide hover:opacity-80 transition"
        >
          Alkarama Hub
        </Link>

        <ul className="flex flex-wrap items-center space-x-4 text-sm font-medium">
          <li><Link to="/" className="text-textDark hover:text-primary">Home</Link></li>
          <li><Link to="/about" className="text-textDark hover:text-primary">About</Link></li>
          <li><Link to="/projects" className="text-textDark hover:text-primary">Projects</Link></li>
          <li><Link to="/public-reports" className="text-textDark hover:text-primary">Public Reports</Link></li>
          <li><Link to="/privacy" className="text-textDark hover:text-primary">Privacy & Terms</Link></li>

          {userRole === "user" && (
            <>
              <li><Link to="/submit-report" className="text-textDark hover:text-primary">Submit Report</Link></li>
              <li><Link to="/my-reports" className="text-textDark hover:text-primary">My Reports</Link></li>
              <li><Link to="/profile" className="text-textDark hover:text-primary">My Profile</Link></li>
            </>
          )}

          {userRole === "admin" && (
            <li><Link to="/admin" className="text-textDark hover:text-primary">Admin</Link></li>
          )}

          {!userRole && (
            <>
              <li><Link to="/login" className="text-primary hover:underline">Login</Link></li>
              <li><Link to="/signup" className="text-textDark hover:text-primary">Sign Up</Link></li>
            </>
          )}

          {userRole && (
            <li>
              <button onClick={handleLogout} className="text-secondary hover:underline transition">
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
