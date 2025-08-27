import React, { useState } from "react";

export default function Login() {
  // ── original state (unchanged)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // ── original submit logic (unchanged)
  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("Enter email and password.");
      return;
    }
    try {
      setBusy(true);
      const res = await fetch(
        `http://localhost:5000/users?email=${encodeURIComponent(email.trim())}`
      );
      const data = await res.json();
      const user = Array.isArray(data) && data.length ? data[0] : null;
      if (!user || user.password !== password) {
        alert("Invalid credentials.");
        setBusy(false);
        return;
      }
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userRole", user.role || "user");
      alert("Logged in.");
      window.location.href = "/";
    } catch (e2) {
      console.error(e2);
      alert("Login failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(80rem_40rem_at_-10%_-10%,rgba(13,33,53,0.12),transparent),radial-gradient(70rem_40rem_at_110%_110%,rgba(201,166,74,0.12),transparent)]" />

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left: brand panel */}
          <section className="hidden lg:block bg-brandNavy text-white rounded-3xl shadow-soft p-10 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Sudan Emblem" className="w-10 h-10 object-contain" />
              <h2 className="text-3xl font-extrabold">Alkarama Hub</h2>
            </div>
            <p className="mt-4 text-white/90 text-lg max-w-md">
              Secure civic reporting and diaspora registry — academic prototype.
            </p>

            <div className="mt-8 grid gap-3 text-sm">
              <div className="bg-white/10 rounded-xl px-4 py-3">
                • Reports are stored locally (JSON server) for demo only.
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-3">
                • Use dummy credentials provided during sign up.
              </div>
            </div>

            {/* golden line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-brandGold" />
          </section>

          {/* Right: form card */}
          <section className="bg-white/95 rounded-3xl shadow-soft border p-8">
            <div className="flex items-center gap-3 mb-2">
              <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
              <h1 className="text-2xl font-extrabold text-brandNavy">Login</h1>
            </div>
            <p className="text-xs text-gray-600 mb-6">
              Academic prototype — use dummy data only.
            </p>

            {/* original form/fields */}
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="label">Email</label>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="label">Password</label>
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button className="btn-primary w-full" disabled={busy}>
                {busy ? "Signing in…" : "Login"}
              </button>

              <div className="text-center text-sm text-gray-600">
                Don’t have an account?{" "}
                <a href="/signup" className="underline hover:text-brandNavy">
                  Sign Up
                </a>{" "}
                ·{" "}
                <a href="/forgot-password" className="underline hover:text-brandNavy">
                  Forgot Password
                </a>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
