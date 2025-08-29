import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { matchProfessionalsToProject } from "../utils/matching";
import { validateNationalId, validatePassport, last4, sha256 } from "../utils/validation";
import { useTranslation } from "react-i18next";
import { API_BASE } from "../apiBase";

const Profile = () => {
  const [formData, setFormData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [matchedProjects, setMatchedProjects] = useState([]);
  const [saving, setSaving] = useState(false); // for verification submit

  const [idForm, setIdForm] = useState({ idType: "national", idValue: "" });
  const [idError, setIdError] = useState("");

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const dir = i18n.language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:5000/users?email=${email}`)
      .then((res) => res.json())
      .then(async (data) => {
        if (Array.isArray(data) && data.length > 0) {
          const user = data[0];
          setFormData(user);
          setUserId(user.id);

          setIdForm((f) => ({ ...f, idType: user.idType || "national" }));

          const projectsRes = await fetch(`${API_BASE}/projects`);
          const projects = await projectsRes.json();

          const matched = (Array.isArray(projects) ? projects : [])
            .map((project) => ({
              project,
              score: matchProfessionalsToProject(project, [user])[0]?.matchScore || 0,
            }))
            .filter((entry) => entry.score > 0)
            .sort((a, b) => b.score - a.score);

          setMatchedProjects(matched);
        } else {
          alert(t("profile.alertUserNotFound"));
          navigate("/signup");
        }
      })
      .catch(() => {
        alert(t("profile.alertLoadError"));
      });
  }, [navigate, t]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      const preview = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        [name]: file.name,
        [`${name}Preview`]: preview,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:5000/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update user.");
      alert(t("profile.alertUpdated"));
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert(t("profile.alertUpdateError"));
    }
  };

  const onIdChange = (e) => {
    const { name, value } = e.target;
    setIdForm((f) => ({ ...f, [name]: value }));
  };

  const validateId = () => {
    setIdError("");
    const v = idForm.idValue.trim();
    if (!v) return true; // empty is allowed (user may not want to provide)
    if (idForm.idType === "national" && !validateNationalId(v)) {
      setIdError(t("profile.idErrorNational"));
      return false;
    }
    if (idForm.idType === "passport" && !validatePassport(v)) {
      setIdError(t("profile.idErrorPassport"));
      return false;
    }
    return true;
  };

  const saveVerification = async (e) => {
    e.preventDefault();
    if (!formData) return;
    if (!validateId()) return;

    try {
      setSaving(true);

      let nationalIdHash = null;
      let idLast4 = null;
      let idType = null;

      if (idForm.idValue.trim()) {
        nationalIdHash = await sha256(idForm.idValue.trim() + ":" + idForm.idType);
        idLast4 = last4(idForm.idValue);
        idType = idForm.idType;
      }

      const payload = {
        idType,
        nationalIdHash, // one-way hash only
        idLast4,        // last 4 digits only
        verified: !!nationalIdHash,
      };

      const res = await fetch(`http://localhost:5000/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update verification.");

      const updated = { ...formData, ...payload };
      setFormData(updated);
      setIdForm({ idType: updated.idType || "national", idValue: "" });
      alert(t("profile.alertVerificationUpdated"));
    } catch (err) {
      console.error(err);
      alert(t("profile.alertVerificationError"));
    } finally {
      setSaving(false);
    }
  };

  if (!formData) return null;

  return (
    <div className="min-h-screen" style={{ direction: dir }}>
      {/* brand hero */}
      <section className="bg-brandNavy text-white">
        <div className={`max-w-5xl mx-auto px-6 py-8 flex items-center gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
          <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
          <h1 className="text-3xl md:text-4xl font-extrabold">{t("profile.title")}</h1>
        </div>
        <div className="h-1 w-full bg-brandGold" />
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column: account + professional (read/edit) */}
          <div className="lg:col-span-2 space-y-8">
            {/* View mode */}
            {!editing ? (
              <div className="bg-white/95 p-8 shadow-soft rounded-2xl border">
                <h2 className="text-xl font-bold text-brandNavy mb-4">
                  {t("profile.accountInfo")}
                </h2>

                <div className="grid md:grid-cols-2 gap-6 text-textDark">
                  <div className={`${dir === "rtl" ? "text-right" : ""} space-y-2`}>
                    <p><span className="font-semibold">{t("profile.fullName")}:</span> {formData.fullName}</p>
                    <p><span className="font-semibold">{t("profile.email")}:</span> {formData.email}</p>
                    <p><span className="font-semibold">{t("profile.country")}:</span> {formData.country || t("profile.na")}</p>
                    <p><span className="font-semibold">{t("profile.availability")}:</span> {formData.availability || t("profile.na")}</p>
                    <p><span className="font-semibold">{t("profile.dob")}:</span> {formData.dob || t("profile.na")}</p>
                    <p><span className="font-semibold">{t("profile.cv")}:</span> {formData.cv || t("profile.cvNone")}</p>
                  </div>
                  <div className={`${dir === "rtl" ? "text-right" : ""} space-y-2`}>
                    <p><span className="font-semibold">{t("profile.profession")}:</span> {formData.profession || t("profile.na")}</p>
                    <p><span className="font-semibold">{t("profile.expertise")}:</span> {formData.expertise || t("profile.na")}</p>
                    <p><span className="font-semibold">{t("profile.tags")}:</span> {formData.tags || t("profile.na")}</p>
                    <div className="mt-2">
                      <p className="mb-1 font-semibold">{t("profile.photo")}:</p>
                      {formData.profilePicPreview ? (
                        <img
                          src={formData.profilePicPreview}
                          alt="Profile"
                          className="w-24 h-24 rounded-full border object-cover ml-auto"
                          style={{ transform: dir === "rtl" ? "scaleX(-1)" : "none" }}
                        />
                      ) : (
                        <p className="italic text-gray-500">{t("profile.noImage")}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`mt-6 ${dir === "rtl" ? "text-left" : "text-right"}`}>
                  <button className="btn-primary" onClick={() => setEditing(true)}>
                    {t("profile.edit")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white/95 p-8 shadow-soft rounded-2xl border">
                <h2 className="text-xl font-bold text-brandNavy mb-4">
                  {t("profile.editTitle")}
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="label">{t("profile.fullName")}</label>
                    <input name="fullName" value={formData.fullName} onChange={handleChange} className="input" />
                  </div>
                  <div>
                    <label className="label">{t("profile.email")}</label>
                    <input name="email" value={formData.email} disabled className="input" />
                  </div>
                  <div>
                    <label className="label">{t("profile.country")}</label>
                    <input name="country" value={formData.country || ""} onChange={handleChange} className="input" />
                  </div>
                  <div>
                    <label className="label">{t("profile.profession")}</label>
                    <input name="profession" value={formData.profession || ""} onChange={handleChange} className="input" />
                  </div>
                  <div>
                    <label className="label">{t("profile.expertise")}</label>
                    <textarea name="expertise" value={formData.expertise || ""} onChange={handleChange} className="textarea" />
                  </div>
                  <div>
                    <label className="label">{t("profile.tagsHint")}</label>
                    <input name="tags" value={formData.tags || ""} onChange={handleChange} className="input" />
                  </div>
                  <div>
                    <label className="label">{t("profile.availability")}</label>
                    <select name="availability" value={formData.availability || "part-time"} onChange={handleChange} className="input">
                      <option value="full-time">{t("profile.fullTime")}</option>
                      <option value="part-time">{t("profile.partTime")}</option>
                      <option value="ad-hoc">{t("profile.adHoc")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">{t("profile.dob")}</label>
                    <input name="dob" type="date" value={formData.dob || ""} onChange={handleChange} className="input" />
                  </div>
                  <div>
                    <label className="label">{t("profile.cvUpload")}</label>
                    <input type="file" name="cv" onChange={handleChange} className="input" />
                  </div>
                  <div>
                    <label className="label">{t("profile.photoUpload")}</label>
                    <input type="file" name="profilePic" onChange={handleChange} className="input" />
                  </div>
                </div>

                <div className={`flex ${dir === "rtl" ? "justify-start" : "justify-end"} mt-6 gap-3`}>
                  <button className="btn-primary" onClick={handleSave}>{t("profile.save")}</button>
                  <button className="btn-secondary" onClick={() => setEditing(false)}>{t("profile.cancel")}</button>
                </div>
              </div>
            )}

            {!editing && (
              <div className="bg-white/95 p-8 shadow-soft rounded-2xl border">
                <h2 className="text-xl font-bold text-brandNavy mb-4">
                  {t("profile.matched")}
                </h2>
                {matchedProjects.length === 0 ? (
                  <p className="text-gray-600">{t("profile.noMatches")}</p>
                ) : (
                  <ul className="space-y-3">
                    {matchedProjects.map(({ project, score }) => (
                      <li key={project.id} className="border p-4 rounded-xl bg-white">
                        <h4 className="font-semibold text-brandNavy">{project.title}</h4>
                        <p className="text-sm text-gray-600">{project.summary}</p>
                        <p className="text-xs text-green-700 mt-1">
                          {t("profile.matchScore")}: {score}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Right column: Identity Verification (Optional) */}
          <div className="space-y-8">
            <div className="bg-white/95 p-8 shadow-soft rounded-2xl border">
              <h2 className="text-xl font-bold text-brandNavy mb-2">
                {t("profile.idTitle")}
              </h2>

              {formData?.nationalIdHash ? (
                <p className="text-sm text-gray-700 mb-4">
                  {t("profile.status")}: <span className="badge-green">{t("profile.statusProvided")} (••••{formData.idLast4 || "----"})</span>
                </p>
              ) : (
                <p className="text-sm text-gray-700 mb-4">
                  {t("profile.status")}: <span className="badge-gray">{t("profile.statusNotProvided")}</span>
                </p>
              )}

              <p className="form-hint mb-4">
                {t("profile.idHint")}
              </p>

              <form onSubmit={saveVerification} className="space-y-4">
                <div>
                  <label className="label">{t("profile.idType")}</label>
                  <select
                    className="input"
                    name="idType"
                    value={idForm.idType}
                    onChange={onIdChange}
                  >
                    <option value="national">{t("profile.nationalId")}</option>
                    <option value="passport">{t("profile.passport")}</option>
                  </select>
                </div>
                <div>
                  <label className="label">{t("profile.idNumber")}</label>
                  <input
                    className="input"
                    name="idValue"
                    value={idForm.idValue}
                    onChange={onIdChange}
                    placeholder={t("profile.idPh")}
                  />
                  {idError && <p className="form-hint text-red-600">{idError}</p>}
                </div>

                <button type="submit" className="btn-primary w-full" disabled={saving}>
                  {saving ? t("profile.saving") : t("profile.saveVerification")}
                </button>
              </form>
            </div>

            {/* Profile meta */}
            <div className="bg-white/95 p-6 shadow-soft rounded-2xl border text-sm text-gray-600">
              <p>
                <span className="font-semibold">{t("profile.createdAt")}:</span>{" "}
                {new Date(formData.createdAt || Date.now()).toLocaleString()}
              </p>
              <p className="mt-1">
                <span className="font-semibold">{t("profile.role")}:</span>{" "}
                {formData.role || "user"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
