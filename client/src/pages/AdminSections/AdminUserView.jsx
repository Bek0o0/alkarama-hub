import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function AdminUserView() {
  const { key } = useParams(); // could be id OR email
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        let u;
        if (key.includes("@")) {
          const r = await fetch(
            `http://localhost:5000/users?email=${encodeURIComponent(key)}`
          );
          const arr = await r.json();
          u = Array.isArray(arr) && arr.length ? arr[0] : null;
        } else {
          const r = await fetch(`http://localhost:5000/users/${key}`);
          u = await r.json();
        }
        setUser(u || null);
      } catch (e) {
        console.error(e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [key]);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white/95 rounded-2xl shadow-soft p-8">
        <div className="flex items-center gap-3 mb-4">
          <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
          <h1 className="text-3xl font-extrabold text-brandNavy">User Profile</h1>
        </div>

        {loading ? (
          <p className="text-gray-600 italic">Loading…</p>
        ) : !user ? (
          <p className="text-gray-600 italic">User not found.</p>
        ) : (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p><span className="font-semibold">Full Name:</span> {user.fullName || "—"}</p>
                <p><span className="font-semibold">Email:</span> {user.email || "—"}</p>
                <p><span className="font-semibold">DOB:</span> {user.dob || "—"}</p>
                <p><span className="font-semibold">Country:</span> {user.country || "—"}</p>
                <p><span className="font-semibold">Role:</span> {user.role || "user"}</p>
              </div>
              <div className="space-y-2">
                <p><span className="font-semibold">Profession:</span> {user.profession || "—"}</p>
                <p><span className="font-semibold">Expertise:</span> {user.expertise || "—"}</p>
                <p><span className="font-semibold">Availability:</span> {user.availability || "—"}</p>
                <p><span className="font-semibold">Tags:</span> {user.tags || "—"}</p>
                {user.profilePicPreview ? (
                  <img
                    src={user.profilePicPreview}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border object-cover mt-2"
                  />
                ) : null}
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">CV</h3>
              {user.cv ? (
                <a
                  href={user.cvPreview || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  View / Download CV
                </a>
              ) : (
                <p className="text-gray-600">No CV on file.</p>
              )}
            </div>

            <div className="pt-4 border-t">
              <Link to="/admin" className="text-brandBlue hover:underline">
                ← Back to Admin Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
