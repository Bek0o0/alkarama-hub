import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Login() {
  // ── original state (unchanged)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const { t, i18n } = useTranslation();
  const dir = i18n.language === "ar" ? "rtl" : "ltr";

  // ── original submit logic (unchanged)
  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert(t("login.alertEnterBoth"));
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
        alert(t("login.alertInvalid"));
        setBusy(false);
        return;
      }
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userRole", user.role || "user");
      alert(t("login.alertLoggedIn"));
      window.location.href = "/";
    } catch (e2) {
      console.error(e2);
      alert(t("login.alertFailed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ direction: dir }}>
      {/* background accents (visual only) */}
      <div className="absolute inset-0 bg-[radial-gradient(80rem_40rem_at_-10%_-10%,rgba(13,33,53,0.12),transparent),radial-gradient(70rem_40rem_at_110%_110%,rgba(201,166,74,0.12),transparent)]" />

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        <div className={`grid lg:grid-cols-2 gap-8 items-center ${dir === "rtl" ? "lg:[direction:ltr]" : ""}`}>
          {/* Left: brand panel */}
          <section className="hidden lg:block bg-brandNavy text-white rounded-3xl shadow-soft p-10 relative overflow-hidden">
            <div className={`flex items-center gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              <img src="/logo.png" alt="Sudan Emblem" className="w-10 h-10 object-contain" />
              <h2 className="text-3xl font-extrabold">{t("brand")}</h2>
            </div>
            <p className={`mt-4 text-white/90 text-lg max-w-md ${dir === "rtl" ? "text-right ml-auto" : ""}`}>
              {t("login.panelTagline")}
            </p>

            <div className={`mt-8 grid gap-3 text-sm ${dir === "rtl" ? "text-right" : ""}`}>
              <div className="bg-white/10 rounded-xl px-4 py-3">
                {t("login.panelLine1")}
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-3">
                {t("login.panelLine2")}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-brandGold" />
          </section>

          {/* Right: form card */}
          <section className="bg-white/95 rounded-3xl shadow-soft border p-8">
            <div className={`flex items-center gap-3 mb-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
              <h1 className="text-2xl font-extrabold text-brandNavy">{t("login.title")}</h1>
            </div>
            <p className={`text-xs text-gray-600 mb-6 ${dir === "rtl" ? "text-right" : ""}`}>
              {t("login.note")}
            </p>

            {/* original form/fields */}
            <form onSubmit={submit} className="space-y-5" style={{ direction: dir }}>
              <div>
                <label className="label">{t("login.email")}</label>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("login.emailPh")}
                />
              </div>

              <div>
                <label className="label">{t("login.password")}</label>
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("login.passwordPh")}
                />
              </div>

              <button className="btn-primary w-full" disabled={busy}>
                {busy ? t("login.btnBusy") : t("login.btn")}
              </button>

              <div className={`text-center text-sm text-gray-600 ${dir === "rtl" ? "space-x-reverse" : ""}`}>
                {t("login.noAccount")}{" "}
                <a href="/signup" className="underline hover:text-brandNavy">{t("nav.signup")}</a>{" "}
                ·{" "}
                <a href="/forgot-password" className="underline hover:text-brandNavy">{t("login.forgot")}</a>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
