import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 bg-white/80 backdrop-blur border-t">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 grid place-items-center">
              <span className="text-primary font-extrabold">A</span>
            </div>
            <div>
              <p className="text-lg font-extrabold text-primary">Alkarama Hub</p>
              <p className="text-sm text-gray-600">Academic Prototype • 2025</p>
            </div>
          </div>

          {/* Links */}
          <nav className="grid grid-cols-2 sm:flex gap-x-6 gap-y-2 text-sm">
            <Link to="/about" className="text-gray-700 hover:text-primary">
              About
            </Link>
            <Link to="/projects" className="text-gray-700 hover:text-primary">
              Projects
            </Link>
            <Link to="/public-reports" className="text-gray-700 hover:text-primary">
              Public Reports
            </Link>
            <Link to="/privacy" className="text-gray-700 hover:text-primary">
              Privacy & Terms
            </Link>
          </nav>

          {/* Tagline */}
          <p className="text-sm text-gray-600">
            Grassroots Solutions. Community Power.
          </p>
        </div>

        {/* Divider */}
        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Bottom row */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Alkarama Hub — All rights reserved (demo).</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary">Contact</a>
            <a href="#" className="hover:text-primary">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
