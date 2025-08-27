import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/* ---------- Live clock ---------- */
function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="inline-flex items-center gap-2 text-white/90 text-sm">
      <span className="w-2 h-2 rounded-full bg-brandGold" />
      <span>{now.toLocaleString()}</span>
    </div>
  );
}

/* ---------- Local Sudan gallery ---------- */
const GALLERY = [
  { src: "/sudan/meroe.jpg", caption: "Meroë Pyramids — Sudan" },
  { src: "/sudan/khartoum.jpg", caption: "Khartoum — Nile Street" },
  { src: "/sudan/suakin.jpg", caption: "Sudan - Red Sea State" },
  { src: "/sudan/nile.jpg", caption: "Sudan — Marrah Mountains - Darfur" },
];

function RotatingGallery() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % GALLERY.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-soft h-72 md:h-96 lg:h-[28rem]">
      {GALLERY.map((item, idx) => (
        <img
          key={item.src}
          src={item.src}
          alt="Sudan"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0"}`}
          loading="eager"
        />
      ))}

      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
        <p className="text-white/95 text-sm md:text-base">{GALLERY[i].caption}</p>
      </div>

      <div className="absolute right-4 top-4 flex gap-2">
        {GALLERY.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Slide ${idx + 1}`}
            onClick={() => setI(idx)}
            className={`w-2.5 h-2.5 rounded-full border border-white/60 ${i === idx ? "bg-white" : "bg-white/20"}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- Home ---------- */
export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-brandNavy text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Sudan Emblem" className="w-10 h-10 object-contain" />
              <h1 className="text-4xl md:text-6xl font-extrabold">Alkarama Hub</h1>
            </div>
            <LiveClock />
          </div>

          <p className="mt-4 text-white/90 text-lg md:text-xl max-w-3xl">
            Report issues safely and connect diaspora expertise to verified rebuilding projects.
          </p>

          {/* Single CTA only (no Explore Projects here to avoid duplication) */}
          <div className="mt-8">
            <Link to="/submit-report" className="btn-primary px-6 py-3 text-base">
              Submit a Report
            </Link>
          </div>
        </div>
        <div className="h-1 w-full bg-brandGold" />
      </section>

      {/* Tiles (NOW clickable to replace About/Projects in navbar) */}
      <section className="px-4 mt-10">
        <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-3">
          <Link
            to="/submit-report"
            className="rounded-xl shadow-soft p-6 bg-brandNavySoft text-white hover:brightness-110 transition"
          >
            <h3 className="text-lg font-bold">Civic Reporting</h3>
            <p className="text-white/80 text-sm mt-1">Flag issues safely — anonymity optional.</p>
          </Link>

          <Link
            to="/projects"
            className="rounded-xl shadow-soft p-6 bg-brandNavySoft text-white hover:brightness-110 transition"
          >
            <h3 className="text-lg font-bold">Rebuilding Projects</h3>
            <p className="text-white/80 text-sm mt-1">Explore verified initiatives.</p>
          </Link>

          <Link
            to="/about"
            className="rounded-xl shadow-soft p-6 bg-brandNavySoft text-white hover:brightness-110 transition"
          >
            <h3 className="text-lg font-bold">About the Platform</h3>
            <p className="text-white/80 text-sm mt-1">Why it exists and how it helps.</p>
          </Link>
        </div>
      </section>

      {/* Announcements */}
      <section className="px-4 mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-xl border bg-white/80 backdrop-blur shadow-soft overflow-hidden">
            <div className="px-4 py-2 text-xs font-semibold text-brandNavy bg-brandGold/20 border-b">
              Announcements
            </div>
            <div className="px-4 py-3 overflow-hidden">
              <div className="ticker">
                <span>
                  • This is an academic prototype — use dummy data only. • Administrators verify and publish selected
                  public reports. • Professionals can list skills to support rebuilding efforts.{" "}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual gallery */}
      <section className="px-4 mt-16 pb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title">Scenes of Sudan</h2>
          <RotatingGallery />
          <p className="text-sm text-gray-500 mt-3">
            Images are illustrative. This is an academic prototype — no real personal data is collected.
          </p>
        </div>
      </section>
    </div>
  );
}
