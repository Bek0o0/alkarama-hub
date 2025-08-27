import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 bg-brandNavy text-white">
      <div className="h-1 w-full bg-brandGold" />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Sudan Emblem" className="w-10 h-10 object-contain" />
              <h3 className="text-xl font-extrabold">Alkarama Hub</h3>
            </div>
            <p className="text-white/80 text-sm mt-2">
              Civic reporting & diaspora registry — academic prototype.
            </p>
            <p className="text-white/60 text-xs mt-4">
              © {new Date().getFullYear()} Alkarama Hub — All rights reserved (demo).
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-brandGold">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/about" className="hover:underline">About</Link></li>
              <li><Link to="/projects" className="hover:underline">Projects</Link></li>
              <li><Link to="/public-reports" className="hover:underline">Public Reports</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-brandGold">Support</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:underline">Privacy & Terms</Link></li>
              <li><span className="text-white/80">Accessibility: WCAG‑friendly colors & keyboard nav</span></li>
            </ul>
          </div>

          {/* Contact (now functional) */}
          <div>
            <h4 className="font-semibold text-brandGold">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="mailto:info@alkarama.example" className="hover:underline">info@alkarama.example</a>
              </li>
              <li>
                <a href="tel:+249000000000" className="hover:underline">+249 000 000 000</a>
              </li>
              <li><span>Khartoum • Cairo • London</span></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
