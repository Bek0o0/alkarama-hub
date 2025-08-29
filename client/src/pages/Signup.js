import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { API_BASE } from "../apiBase";

async function sha256Hex(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function Signup() {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    dob: "",
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
      alert(t("signup.mustAccept") || "You must accept the Privacy & Terms.");
      return;
    }
    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim() || !form.dob) {
      alert(
        t("signup.requiredAlert") ||
          "Please complete all required fields (Full Name, Email, Password, Date of Birth)."
      );
      return;
    }

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
      password: form.password,
      dob: form.dob,
      country: form.country.trim(),
      profession: form.profession.trim(),
      expertise: form.expertise.trim(),
      role: "user",
      verified: true,
      createdAt: new Date().toISOString(),
      verification,
      profile: { profession: "", expertise: "", availability: "", photo: "", cv: "" },
    };

    try {
      setBusy(true);
      const check = await fetch(
        `http://localhost:5000/users?email=${encodeURIComponent(newUser.email)}`
      );
      const exists = await check.json();
      if (Array.isArray(exists) && exists.length) {
        alert(t("signup.emailExists") || "An account with this email already exists.");
        setBusy(false);
        return;
      }

      await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      alert(t("signup.created") || "Account created. Please login.");
      window.location.href = "/login";
    } catch (e2) {
      console.error(e2);
      alert(t("signup.createError") || "Could not create account.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <div className="bg-white/95 rounded-2xl shadow-soft p-8">
        <div className="flex items-center gap-3 mb-4">
          <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
          <h1 className="text-3xl font-extrabold text-brandNavy">
            {t("signup.title")}
          </h1>
        </div>
        <p className="text-xs text-gray-600">{t("signup.note")}</p>

        <form onSubmit={submit} className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label">{t("signup.fullName")}</label>
            <input className="input" value={form.fullName} onChange={on("fullName")} />
          </div>

          <div>
            <label className="label">{t("signup.email")}</label>
            <input
              type="email"
              className="input"
              value={form.email}
              onChange={on("email")}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="label">{t("signup.password")}</label>
            <input
              type="password"
              className="input"
              value={form.password}
              onChange={on("password")}
              placeholder={t("login.passwordPh")}
            />
          </div>

          <div>
            <label className="label">{t("signup.dob")}</label>
            <input type="date" className="input" value={form.dob} onChange={on("dob")} />
          </div>

          <div>
            <label className="label">{t("signup.country")}</label>
            <input className="input" value={form.country} onChange={on("country")} />
          </div>
          <div>
            <label className="label">{t("signup.profession")}</label>
            <input className="input" value={form.profession} onChange={on("profession")} />
          </div>

          <div className="md:col-span-2">
            <label className="label">{t("signup.expertise")}</label>
            <input
              className="input"
              placeholder="e.g., cardiology, Java, logistics"
              value={form.expertise}
              onChange={on("expertise")}
            />
          </div>

          <div>
            <label className="label">{t("signup.idType")}</label>
            <select className="input" value={form.idType} onChange={on("idType")}>
              <option>{t("signup.nationalId")}</option>
              <option>{t("signup.passport")}</option>
            </select>
          </div>
          <div>
            <label className="label">{t("signup.idNumber")}</label>
            <input
              className="input"
              value={form.idNumber}
              onChange={on("idNumber")}
              placeholder={t("login.idPh") || "Enter a dummy number for demo"}
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-2 mt-2">
            <input type="checkbox" checked={form.accept} onChange={on("accept")} />
            <span className="text-sm">
              {t("signup.accept")}{" "}
              <a className="underline" href="/privacy">
                {t("footer.privacy")}
              </a>
            </span>
          </div>

          <div className="md:col-span-2">
            <button className="btn-primary w-full" disabled={busy}>
              {busy ? t("signup.creating") || "Creating…" : t("signup.create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
