import React, { useState } from "react";

/** SHA-256 helper for hashing reset codes (demo security) */
async function sha256Hex(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Generate a 6-digit numeric code as a string */
function genCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default function ForgotPassword() {
  // Step state
  const [step, setStep] = useState(1); // 1 = identify, 2 = verify code & reset
  const [busy, setBusy] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");

  // Step 1 fields
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");          // YYYY-MM-DD
  const [last4, setLast4] = useState("");      // last 4 of ID/passport

  // Step 2 fields
  const [code, setCode] = useState("");
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");

  // Bookkeeping for reset record
  const [resetId, setResetId] = useState(null); // id of password_resets item

  /** STEP 1: Identity check + create reset token (hashed code) */
  const startReset = async (e) => {
    e.preventDefault();
    setInfoMsg("");

    if (!email.trim() || !dob.trim() || !last4.trim()) {
      alert("Please fill email, date of birth, and last 4 digits.");
      return;
    }

    try {
      setBusy(true);

      // 1) Lookup user
      const res = await fetch(`http://localhost:5000/users?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      const user = Array.isArray(data) && data.length ? data[0] : null;

      if (!user) {
        alert("No account found with that email.");
        setBusy(false);
        return;
      }

      // 2) Check DoB
      const dobMatches = (user.dob || "").slice(0, 10) === dob;
      if (!dobMatches) {
        alert("Date of birth does not match our records.");
        setBusy(false);
        return;
      }

      // 3) If user has verification on file, require last4 to match.
      if (user.idLast4) {
        if (last4 !== String(user.idLast4)) {
          alert("The last 4 digits do not match our records.");
          setBusy(false);
          return;
        }
      } else {
        // If no last4 on file, safer to block self-service reset in this demo.
        alert("Self-service reset is disabled for this account. Please contact Admin.");
        setBusy(false);
        return;
      }

      // 4) Create or replace a reset record for this email
      //    First, delete any existing reset records for this email (cleanup)
      const existingRes = await fetch(`http://localhost:5000/password_resets?email=${encodeURIComponent(email.trim())}`);
      const existing = await existingRes.json();
      for (const r of existing || []) {
        await fetch(`http://localhost:5000/password_resets/${r.id}`, { method: "DELETE" });
      }

      // 5) Generate a code, store only its hash, with expiry and attempts
      const rawCode = genCode();
      const codeHash = await sha256Hex(rawCode);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes
      const resetRecord = {
        id: Date.now().toString(),
        email: user.email,
        codeHash,
        expiresAt,
        attempts: 0,
        createdAt: new Date().toISOString()
      };

      await fetch("http://localhost:5000/password_resets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resetRecord),
      });

      setResetId(resetRecord.id);
      setStep(2);

      // DEMO: Instead of emailing, show the code in an info box.
      setInfoMsg(`Demo code (normally sent via email): ${rawCode}`);
    } catch (err) {
      console.error(err);
      alert("Could not start password reset.");
    } finally {
      setBusy(false);
    }
  };

  /** STEP 2: Verify code and reset password */
  const finishReset = async (e) => {
    e.preventDefault();
    setInfoMsg("");

    if (!code.trim() || !p1.trim() || !p2.trim()) {
      alert("Please fill all fields.");
      return;
    }
    if (p1 !== p2) {
      alert("Passwords do not match.");
      return;
    }
    if (p1.length < 4) {
      alert("Use at least 4 characters (demo).");
      return;
    }

    try {
      setBusy(true);

      // 1) Load the reset record
      const rrRes = await fetch(`http://localhost:5000/password_resets/${resetId}`);
      if (!rrRes.ok) {
        alert("Reset session not found. Please start again.");
        setBusy(false);
        return;
      }
      const rr = await rrRes.json();

      // 2) Check expiry and attempts
      if (new Date(rr.expiresAt).getTime() < Date.now()) {
        await fetch(`http://localhost:5000/password_resets/${rr.id}`, { method: "DELETE" });
        alert("The reset code has expired. Please start again.");
        setBusy(false);
        return;
      }
      if ((rr.attempts || 0) >= 5) {
        await fetch(`http://localhost:5000/password_resets/${rr.id}`, { method: "DELETE" });
        alert("Too many attempts. Please start again.");
        setBusy(false);
        return;
      }

      // 3) Compare code hashes
      const codeHash = await sha256Hex(code.trim());
      const ok = codeHash === rr.codeHash;

      // 4) If wrong, increment attempts and block after threshold
      if (!ok) {
        await fetch(`http://localhost:5000/password_resets/${rr.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attempts: (rr.attempts || 0) + 1 }),
        });
        alert("Invalid code.");
        setBusy(false);
        return;
      }

      // 5) Find the user and patch their password
      const uRes = await fetch(`http://localhost:5000/users?email=${encodeURIComponent(rr.email)}`);
      const list = await uRes.json();
      const user = Array.isArray(list) && list.length ? list[0] : null;
      if (!user) {
        alert("Account not found.");
        setBusy(false);
        return;
      }

      const upd = await fetch(`http://localhost:5000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: p1 }),
      });
      if (!upd.ok) throw new Error("Update failed");

      // 6) Clean up the reset record
      await fetch(`http://localhost:5000/password_resets/${rr.id}`, { method: "DELETE" });

      alert("Password updated. You can now log in.");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert("Could not reset password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-brandNavy text-white">
        <div className="max-w-3xl mx-auto px-6 py-8 flex items-center gap-3">
          <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
          <h1 className="text-3xl md:text-4xl font-extrabold">Reset Password</h1>
        </div>
        <div className="h-1 w-full bg-brandGold" />
      </section>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white/95 rounded-2xl shadow-soft border p-8">
          {infoMsg && (
            <div className="mb-4 text-sm rounded-lg border p-3 bg-yellow-50 border-yellow-200 text-yellow-800">
              {infoMsg}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={startReset} className="space-y-5">
              <p className="text-xs text-gray-600 -mt-2">
                For security, please confirm your identity. Self-service reset requires your account to have ID verification on file.
              </p>

              <div>
                <label className="label">Account Email</label>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="label">Date of Birth (YYYY-MM-DD)</label>
                <input
                  className="input"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>

              <div>
                <label className="label">Last 4 digits of your ID/Passport</label>
                <input
                  className="input"
                  value={last4}
                  onChange={(e) => setLast4(e.target.value)}
                  maxLength={4}
                  placeholder="••••"
                />
              </div>

              <button className="btn-primary w-full" disabled={busy}>
                {busy ? "Checking…" : "Continue"}
              </button>

              <div className="text-center text-sm text-gray-600">
                Remembered it?{" "}
                <a href="/login" className="underline hover:text-brandNavy">Back to Login</a>
              </div>
            </form>
          ) : (
            <form onSubmit={finishReset} className="space-y-5">
              <p className="text-xs text-gray-600 -mt-2">
                Enter the 6-digit code we just “sent” (shown above for demo), then set your new password.
              </p>

              <div>
                <label className="label">6-digit code</label>
                <input
                  className="input"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  placeholder="123456"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">New password</label>
                  <input
                    className="input"
                    type="password"
                    value={p1}
                    onChange={(e) => setP1(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Confirm new password</label>
                  <input
                    className="input"
                    type="password"
                    value={p2}
                    onChange={(e) => setP2(e.target.value)}
                  />
                </div>
              </div>

              <button className="btn-primary w-full" disabled={busy}>
                {busy ? "Updating…" : "Update Password"}
              </button>

              <div className="text-center text-sm text-gray-600">
                Back to{" "}
                <a href="/login" className="underline hover:text-brandNavy">Login</a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
