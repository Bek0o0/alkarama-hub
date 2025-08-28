import React, { useState } from "react";
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

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
      alert(t("reset.alertFill"));
      return;
    }

    try {
      setBusy(true);

      // 1) Lookup user
      const res = await fetch(`http://localhost:5000/users?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      const user = Array.isArray(data) && data.length ? data[0] : null;

      if (!user) {
        alert(t("reset.noAccount"));
        setBusy(false);
        return;
      }

      // 2) Check DoB
      const dobMatches = (user.dob || "").slice(0, 10) === dob;
      if (!dobMatches) {
        alert(t("reset.dobMismatch"));
        setBusy(false);
        return;
      }

      // 3) Require last4 match if present
      if (user.idLast4) {
        if (last4 !== String(user.idLast4)) {
          alert(t("reset.last4Mismatch"));
          setBusy(false);
          return;
        }
      } else {
        alert(t("reset.selfServiceDisabled"));
        setBusy(false);
        return;
      }

      // cleanup any existing reset records for this email
      const existingRes = await fetch(`http://localhost:5000/password_resets?email=${encodeURIComponent(email.trim())}`);
      const existing = await existingRes.json();
      for (const r of existing || []) {
        await fetch(`http://localhost:5000/password_resets/${r.id}`, { method: "DELETE" });
      }

      // create new record
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

      // DEMO: show the code instead of sending email
      setInfoMsg(t("reset.demoCode", { code: rawCode }));
    } catch (err) {
      console.error(err);
      alert(t("reset.couldNotStart"));
    } finally {
      setBusy(false);
    }
  };

  /** STEP 2: Verify code and reset password */
  const finishReset = async (e) => {
    e.preventDefault();
    setInfoMsg("");

    if (!code.trim() || !p1.trim() || !p2.trim()) {
      alert(t("reset.fillAll"));
      return;
    }
    if (p1 !== p2) {
      alert(t("reset.noMatch"));
      return;
    }
    if (p1.length < 4) {
      alert(t("reset.minChars"));
      return;
    }

    try {
      setBusy(true);

      // load reset record
      const rrRes = await fetch(`http://localhost:5000/password_resets/${resetId}`);
      if (!rrRes.ok) {
        alert(t("reset.sessionMissing"));
        setBusy(false);
        return;
      }
      const rr = await rrRes.json();

      // expiry & attempts
      if (new Date(rr.expiresAt).getTime() < Date.now()) {
        await fetch(`http://localhost:5000/password_resets/${rr.id}`, { method: "DELETE" });
        alert(t("reset.expired"));
        setBusy(false);
        return;
      }
      if ((rr.attempts || 0) >= 5) {
        await fetch(`http://localhost:5000/password_resets/${rr.id}`, { method: "DELETE" });
        alert(t("reset.tooMany"));
        setBusy(false);
        return;
      }

      // compare code
      const codeHash = await sha256Hex(code.trim());
      const ok = codeHash === rr.codeHash;

      if (!ok) {
        await fetch(`http://localhost:5000/password_resets/${rr.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attempts: (rr.attempts || 0) + 1 }),
        });
        alert(t("reset.invalidCode"));
        setBusy(false);
        return;
      }

      // update password
      const uRes = await fetch(`http://localhost:5000/users?email=${encodeURIComponent(rr.email)}`);
      const list = await uRes.json();
      const user = Array.isArray(list) && list.length ? list[0] : null;
      if (!user) {
        alert(t("reset.noAccount"));
        setBusy(false);
        return;
      }

      const upd = await fetch(`http://localhost:5000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: p1 }),
      });
      if (!upd.ok) throw new Error("Update failed");

      await fetch(`http://localhost:5000/password_resets/${rr.id}`, { method: "DELETE" });

      alert(t("reset.updated"));
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert(t("reset.couldNotFinish"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <section className="bg-brandNavy text-white">
        <div className="max-w-3xl mx-auto px-6 py-8 flex items-center gap-3">
          <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
          <h1 className="text-3xl md:text-4xl font-extrabold">{t("reset.title")}</h1>
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
              <p className="text-xs text-gray-600 -mt-2">{t("reset.note")}</p>

              <div>
                <label className="label">{t("reset.email")}</label>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="label">{t("reset.dobLabel")}</label>
                <input
                  className="input"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>

              <div>
                <label className="label">{t("reset.last4Label")}</label>
                <input
                  className="input"
                  value={last4}
                  onChange={(e) => setLast4(e.target.value)}
                  maxLength={4}
                  placeholder="••••"
                />
              </div>

              <button className="btn-primary w-full" disabled={busy}>
                {busy ? t("reset.checking") : t("reset.continue")}
              </button>

              <div className="text-center text-sm text-gray-600">
                {t("reset.remembered")}{" "}
                <a href="/login" className="underline hover:text-brandNavy">
                  {t("reset.backToLogin")}
                </a>
              </div>
            </form>
          ) : (
            <form onSubmit={finishReset} className="space-y-5">
              <p className="text-xs text-gray-600 -mt-2">{t("reset.enterCodeNote")}</p>

              <div>
                <label className="label">{t("reset.code6")}</label>
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
                  <label className="label">{t("reset.newPass")}</label>
                  <input
                    className="input"
                    type="password"
                    value={p1}
                    onChange={(e) => setP1(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">{t("reset.confirmPass")}</label>
                  <input
                    className="input"
                    type="password"
                    value={p2}
                    onChange={(e) => setP2(e.target.value)}
                  />
                </div>
              </div>

              <button className="btn-primary w-full" disabled={busy}>
                {busy ? t("reset.updating") : t("reset.updateBtn")}
              </button>

              <div className="text-center text-sm text-gray-600">
                {t("reset.back")}{" "}
                <a href="/login" className="underline hover:text-brandNavy">
                  {t("reset.login")}
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
