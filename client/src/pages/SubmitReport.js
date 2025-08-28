import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export default function SubmitReport() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("corruption");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState(null);
  const [anonymous, setAnonymous] = useState(false);
  const [busy, setBusy] = useState(false);

  const { t, i18n } = useTranslation();
  const dir = i18n.language === "ar" ? "rtl" : "ltr";

  const email = useMemo(() => localStorage.getItem("userEmail") || "", []);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert(t("submit.alertFill"));
      return;
    }
    const payload = {
      id: Math.random().toString(36).slice(2, 6),
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      anonymous,
      userEmail: anonymous ? "Anonymous" : email || "Anonymous",
      status: "in_review",
      createdAt: new Date().toISOString(),
    };
    if (file) payload.attachment = file.name;

    try {
      setBusy(true);
      await fetch("http://localhost:5000/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      alert(t("submit.alertOk"));
      setTitle(""); setDescription(""); setLocation(""); setFile(null); setAnonymous(false);
    } catch (err) {
      console.error(err);
      alert(t("submit.alertFail"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-4" style={{ direction: dir }}>
      <div className="bg-white/95 rounded-2xl shadow-soft border-l-4 border-brandGold p-8">
        <div className={`flex items-center gap-3 mb-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
          <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
          <h1 className="text-3xl font-extrabold text-brandNavy">{t("submit.title")}</h1>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">{t("submit.reportTitle")}</label>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("submit.reportTitlePh")}
            />
          </div>

          <div>
            <label className="label">{t("submit.description")}</label>
            <textarea
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("submit.descriptionPh")}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">{t("submit.category")}</label>
              <select
                className="input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="corruption">{t("submit.cats.corruption")}</option>
                <option value="security">{t("submit.cats.security")}</option>
                <option value="medical">{t("submit.cats.medical")}</option>
                <option value="infrastructure">{t("submit.cats.infrastructure")}</option>
              </select>
            </div>
            <div>
              <label className="label">{t("submit.locationOpt")}</label>
              <input
                className="input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t("submit.locationPh")}
              />
            </div>
          </div>

          <div>
            <label className="label">{t("submit.attach")}</label>
            <input
              type="file"
              className="input"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <label className={`inline-flex items-center gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
            <span className="text-sm text-gray-700">{t("submit.anon")}</span>
          </label>

          <button className="btn-primary w-full" disabled={busy}>
            {busy ? t("submit.btnBusy") : t("submit.btn")}
          </button>
        </form>
      </div>
    </div>
  );
}
