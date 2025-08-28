import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { getLocalized } from "../../utils/i18nContent";

/** Convert a File to a Base64 data URL (for quick demo storage in JSON server) */
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminProjects() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  // list + ui
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");

  // new project form
  const [title, setTitle] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryAr, setSummaryAr] = useState("");
  const [cost, setCost] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("Planned");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    return fetch("http://localhost:5000/projects")
      .then((r) => r.json())
      .then((d) => setProjects(d || []))
      .catch(() => setProjects([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const clearForm = () => {
    setTitle("");
    setTitleAr("");
    setSummary("");
    setSummaryAr("");
    setCost("");
    setTags("");
    setStatus("Planned");
    setImageFile(null);
    setImagePreview("");
  };

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setImagePreview("");
      return;
    }
    setImageFile(file);
    const b64 = await toBase64(file);
    setImagePreview(b64);
  };

  const addProject = async () => {
    if (!title.trim() && !titleAr.trim()) {
      alert(t("admin.common.errorAdding"));
      return;
    }
    try {
      setBusy(true);

      let imageDataUrl = imagePreview; // already base64 if selected
      if (!imageDataUrl && imageFile) {
        imageDataUrl = await toBase64(imageFile);
      }

      const payload = {
        id: Date.now().toString(),
        title: title.trim(), // English (legacy key)
        title_ar: titleAr.trim(), // Arabic
        summary: summary.trim(), // English (legacy key)
        summary_ar: summaryAr.trim(), // Arabic
        cost: Number(cost || 0),
        donated: 0,
        status,
        tags: tags
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        image: imageDataUrl || "", // Optional image (base64)
        createdAt: new Date().toISOString(),
      };

      await fetch("http://localhost:5000/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      clearForm();
      await load();
    } catch (e) {
      console.error(e);
      alert(t("admin.common.errorAdding"));
    } finally {
      setBusy(false);
    }
  };

  const removeProject = async (id) => {
    if (!window.confirm(t("admin.common.confirmDelete"))) return;
    try {
      await fetch(`http://localhost:5000/projects/${id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      console.error(e);
      alert(t("admin.common.errorDeleting"));
    }
  };

  const filtered = projects.filter((p) => {
    const titleLoc = getLocalized(p, "title", i18n.language).toLowerCase();
    const summaryLoc = getLocalized(p, "summary", i18n.language).toLowerCase();
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return titleLoc.includes(q) || summaryLoc.includes(q);
  });

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header / Add Form */}
      <div className="bg-white/95 rounded-2xl shadow-soft p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-brandNavy">
            {t("admin.projects.title")}
          </h2>
          <div className="flex gap-2 items-center">
            <button
              className="btn-secondary"
              onClick={() => {
                setSearch("");
                clearForm();
              }}
            >
              {t("admin.common.clear")}
            </button>
            <input
              className="input"
              placeholder={t("admin.projects.searchPh")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <p className="font-semibold text-brandNavy mb-3">
          {t("admin.projects.addNew")}
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Titles */}
          <div>
            <label className="label">{t("admin.projects.titlePh")} (EN)</label>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("admin.projects.titlePh")}
            />
          </div>
          <div>
            <label className="label">{t("admin.projects.titlePh")} (AR)</label>
            <input
              className="input"
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              placeholder={t("admin.projects.titlePh")}
              dir="rtl"
            />
          </div>

          {/* Summaries */}
          <div className="md:col-span-1">
            <label className="label">{t("admin.projects.colSummary")} (EN)</label>
            <textarea
              className="input h-28"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder={t("admin.projects.summaryPh")}
            />
          </div>
          <div className="md:col-span-1">
            <label className="label">{t("admin.projects.colSummary")} (AR)</label>
            <textarea
              className="input h-28"
              value={summaryAr}
              onChange={(e) => setSummaryAr(e.target.value)}
              placeholder={t("admin.projects.summaryPh")}
              dir="rtl"
            />
          </div>

          {/* Cost / Status / Tags */}
          <div>
            <label className="label">{t("admin.projects.costPh")}</label>
            <input
              type="number"
              className="input"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="100000"
              min="0"
            />
          </div>
          <div>
            <label className="label">{t("admin.projects.colStatus")}</label>
            <select
              className="input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Planned">Planned</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label">{t("admin.projects.tagsPh")}</label>
            <input
              className="input"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="construction, software"
            />
          </div>

          {/* Image upload */}
          <div className="md:col-span-2">
            <label className="label">
              {t("projectDetail.uploadInvoice").replace(
                /Invoice/i,
                t("admin.projects.image") || "Image"
              )}
            </label>
            <input type="file" accept="image/*" className="input" onChange={handleImage} />
            {imagePreview ? (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="h-32 rounded border object-cover"
                />
              </div>
            ) : null}
          </div>

          <div className="md:col-span-2">
            <button className="btn-primary" onClick={addProject} disabled={busy}>
              {busy ? t("common.loading") : t("admin.projects.addButton")}
            </button>
          </div>
        </div>
      </div>

      {/* Projects table */}
      <div className="bg-white/95 rounded-2xl shadow-soft p-6 overflow-x-auto">
        {filtered.length === 0 ? (
          <p className="text-gray-500 italic">{t("admin.projects.empty")}</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-500">
                <th className="py-2 pr-3">{t("admin.projects.colActions")}</th>
                <th className="py-2 pr-3">{t("admin.projects.colInterested")}</th>
                <th className="py-2 pr-3">{t("admin.projects.colTags")}</th>
                <th className="py-2 pr-3">{t("admin.projects.colStatus")}</th>
                <th className="py-2 pr-3">{t("admin.projects.colDonated")}</th>
                <th className="py-2 pr-3">{t("admin.projects.colCost")}</th>
                <th className="py-2 pr-3">{t("admin.projects.colSummary")}</th>
                <th className="py-2 pr-3">{t("admin.projects.colTitle")}</th>
                <th className="py-2 pr-3">IMG</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const titleLoc = getLocalized(p, "title", i18n.language);
                const summaryLoc = getLocalized(p, "summary", i18n.language);
                return (
                  <tr key={p.id} className="border-t align-top">
                    <td className="py-3 pr-3 whitespace-nowrap">
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => removeProject(p.id)}
                      >
                        {t("common.delete")}
                      </button>
                    </td>
                    <td className="py-3 pr-3">
                      {Array.isArray(p.interested) ? p.interested.length : p.interested || 0}
                    </td>
                    <td className="py-3 pr-3">
                      {Array.isArray(p.tags) && p.tags.length
                        ? p.tags.join(", ")
                        : t("admin.projects.none")}
                    </td>
                    <td className="py-3 pr-3">{p.status || t("admin.projects.none")}</td>
                    <td className="py-3 pr-3">${Number(p.donated || 0).toLocaleString()}</td>
                    <td className="py-3 pr-3">${Number(p.cost || 0).toLocaleString()}</td>
                    <td className="py-3 pr-3 max-w-xs">
                      <div dir="auto" className="line-clamp-3">
                        {summaryLoc}
                      </div>
                    </td>
                    <td className="py-3 pr-3 font-semibold text-brandNavy" dir="auto">
                      {titleLoc}
                    </td>
                    <td className="py-3 pr-3">
                      {p.image ? (
                        <img
                          alt="thumb"
                          src={p.image}
                          className="h-10 w-16 object-cover rounded border"
                        />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
