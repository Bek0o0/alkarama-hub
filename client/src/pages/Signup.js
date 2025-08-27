import React, { useState } from "react";

async function sha256Hex(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function Signup() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    dob: "",            // ← NEW (required)
    country: "",
    profession: "",
    expertise: "",
    idType: "National ID",
    idNumber: "",
    accept: false,
  });
  const [busy, setBusy] = useState(false);

  const on = (k) => (e) =>
    setForm({
      ...form,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.accept) {
      alert("You must accept the Privacy & Terms.");
      return;
    }
    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim() || !form.dob) {
      alert("Please complete all required fields (Full Name, Email, Password, Date of Birth).");
      return;
    }

    // Optional ID: store only last-4 + hash
    let verification;
    if (form.idNumber.trim()) {
      verification = {
        idType: form.idType,
        idLast4: form.idNumber.trim().slice(-4),
        idHash: await sha256Hex(form.idNumber.trim()),
        createdAt: new Date().toISOString(),
      };
    }

    const newUser = {
      id: Math.random().toString(36).slice(2, 6),
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      password: form.password, // demo only
      dob: form.dob,           // ← NEW (stored as YYYY-MM-DD)
      country: form.country.trim(),
      profession: form.profession.trim(),
      expertise: form.expertise.trim(), // comma-separated ok
      role: "user",
      verified: true,
      createdAt: new Date().toISOString(),
      verification,
      profile: { profession: "", expertise: "", availability: "", photo: "", cv: "" },
    };

    try {
      setBusy(true);
      // uniqueness check (simple)
      const check = await fetch(
        `http://localhost:5000/users?email=${encodeURIComponent(newUser.email)}`
      );
      const exists = await check.json();
      if (Array.isArray(exists) && exists.length) {
        alert("An account with this email already exists.");
        setBusy(false);
        return;
      }

      await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      alert("Account created. Please login.");
      window.location.href = "/login";
    } catch (e2) {
      console.error(e2);
      alert("Could not create account.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <div className="bg-white/95 rounded-2xl shadow-soft p-8">
        <div className="flex items-center gap-3 mb-4">
          <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
          <h1 className="text-3xl font-extrabold text-brandNavy">Create an Account</h1>
        </div>
        <p className="text-xs text-gray-600">
          Academic prototype — use dummy data only. You can enter a National ID or Passport number for demo verification.
          We store a <strong>one-way hash</strong> and <strong>last 4 digits</strong> only.
        </p>

        <form onSubmit={submit} className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label">Full Name</label>
            <input className="input" value={form.fullName} onChange={on("fullName")} />
          </div>

          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={form.email} onChange={on("email")} />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" className="input" value={form.password} onChange={on("password")} />
          </div>

          {/* NEW required field */}
          <div>
            <label className="label">Date of Birth</label>
            <input type="date" className="input" value={form.dob} onChange={on("dob")} />
          </div>

          <div>
            <label className="label">Country</label>
            <input className="input" value={form.country} onChange={on("country")} />
          </div>
          <div>
            <label className="label">Profession</label>
            <input className="input" value={form.profession} onChange={on("profession")} />
          </div>

          <div className="md:col-span-2">
            <label className="label">Expertise (keywords)</label>
            <input
              className="input"
              placeholder="e.g., cardiology, Java, logistics"
              value={form.expertise}
              onChange={on("expertise")}
            />
          </div>

          <div>
            <label className="label">ID Type (optional)</label>
            <select className="input" value={form.idType} onChange={on("idType")}>
              <option>National ID</option>
              <option>Passport</option>
            </select>
          </div>
          <div>
            <label className="label">ID / Passport Number (optional)</label>
            <input
              className="input"
              value={form.idNumber}
              onChange={on("idNumber")}
              placeholder="Enter a dummy number for demo"
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-2 mt-2">
            <input type="checkbox" checked={form.accept} onChange={on("accept")} />
            <span className="text-sm">
              I accept the <a className="underline" href="/privacy">Privacy & Terms</a>
            </span>
          </div>

          <div className="md:col-span-2">
            <button className="btn-primary w-full" disabled={busy}>
              {busy ? "Creating…" : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
