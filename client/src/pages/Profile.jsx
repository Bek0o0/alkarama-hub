import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { matchProfessionalsToProject } from "../utils/matching";
import { validateNationalId, validatePassport, last4, sha256 } from "../utils/validation";

const Profile = () => {
  const [formData, setFormData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [matchedProjects, setMatchedProjects] = useState([]);
  const [saving, setSaving] = useState(false); // for verification submit

  // optional verification form state
  const [idForm, setIdForm] = useState({ idType: "national", idValue: "" });
  const [idError, setIdError] = useState("");

  const navigate = useNavigate();

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

          // preload verification form type (if user already verified, default to existing type)
          setIdForm((f) => ({ ...f, idType: user.idType || "national" }));

          const projectsRes = await fetch("http://localhost:5000/projects");
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
          alert("User not found.");
          navigate("/signup");
        }
      })
      .catch(() => {
        alert("Error loading profile.");
      });
  }, [navigate]);

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
      alert("Profile updated.");
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Error updating profile.");
    }
  };

  // -----------------------
  // Verification (optional)
  // -----------------------
  const onIdChange = (e) => {
    const { name, value } = e.target;
    setIdForm((f) => ({ ...f, [name]: value }));
  };

  const validateId = () => {
    setIdError("");
    const v = idForm.idValue.trim();
    if (!v) return true; // empty is allowed (user may not want to provide)
    if (idForm.idType === "national" && !validateNationalId(v)) {
      setIdError("National ID must be 8–14 digits.");
      return false;
    }
    if (idForm.idType === "passport" && !validatePassport(v)) {
      setIdError("Passport must be 1 letter + 7 digits (e.g., A1234567).");
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
      alert("Verification updated.");
    } catch (err) {
      console.error(err);
      alert("Failed to update verification.");
    } finally {
      setSaving(false);
    }
  };

  if (!formData) return null;

  return (
    <div className="min-h-screen">
      {/* brand hero */}
      <section className="bg-brandNavy text-white">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center gap-3">
          <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
          <h1 className="text-3xl md:text-4xl font-extrabold">My Profile</h1>
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
                <h2 className="text-xl font-bold text-brandNavy mb-4">Account & Professional Info</h2>

                <div className="grid md:grid-cols-2 gap-6 text-textDark">
                  <div className="space-y-2">
                    <p><span className="font-semibold">Full Name:</span> {formData.fullName}</p>
                    <p><span className="font-semibold">Email:</span> {formData.email}</p>
                    {/* NEW: show DOB if present */}
                    <p><span className="font-semibold">Date of Birth:</span> {formData.dob ? new Date(formData.dob).toLocaleDateString() : "N/A"}</p>
                    <p><span className="font-semibold">Country:</span> {formData.country || "N/A"}</p>
                    <p><span className="font-semibold">Availability:</span> {formData.availability || "N/A"}</p>
                    <p><span className="font-semibold">CV:</span> {formData.cv || "None uploaded"}</p>
                  </div>
                  <div className="space-y-2">
                    <p><span className="font-semibold">Profession:</span> {formData.profession || "N/A"}</p>
                    <p><span className="font-semibold">Areas of Expertise:</span> {formData.expertise || "N/A"}</p>
                    <p><span className="font-semibold">Expertise Tags:</span> {formData.tags || "N/A"}</p>
                    <div className="mt-2">
                      <p className="mb-1 font-semibold">Profile Picture:</p>
                      {formData.profilePicPreview ? (
                        <img
                          src={formData.profilePicPreview}
                          alt="Profile"
                          className="w-24 h-24 rounded-full border object-cover"
                        />
                      ) : (
                        <p className="italic text-gray-500">No image uploaded</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-right">
                  <button className="btn-primary" onClick={() => setEditing(true)}>
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              // Edit mode (unchanged logic)
              <div className="bg-white/95 p-8 shadow-soft rounded-2xl border">
                <h2 className="text-xl font-bold text-brandNavy mb-4">Edit Profile</h2>
                <div className="space-y-5">
                  <div>
                    <label className="label">Full Name</label>
                    <input name="fullName" value={formData.fullName} onChange={handleChange} className="input" />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input name="email" value={formData.email} disabled className="input" />
                  </div>
                  {/* NEW: editable DOB field (stored as YYYY-MM-DD) */}
                  <div>
                    <label className="label">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob || ""}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Country of Residence</label>
                    <input name="country" value={formData.country || ""} onChange={handleChange} className="input" />
                  </div>
                  <div>
                    <label className="label">Profession</label>
                    <input name="profession" value={formData.profession || ""} onChange={handleChange} className="input" />
                  </div>
                  <div>
                    <label className="label">Areas of Expertise</label>
                    <textarea name="expertise" value={formData.expertise || ""} onChange={handleChange} className="textarea" />
                  </div>
                  <div>
                    <label className="label">Expertise Tags (comma-separated)</label>
                    <input name="tags" value={formData.tags || ""} onChange={handleChange} className="input" />
                  </div>
                  <div>
                    <label className="label">Availability</label>
                    <select name="availability" value={formData.availability || "part-time"} onChange={handleChange} className="input">
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="ad-hoc">Ad-hoc</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Upload CV</label>
                    <input type="file" name="cv" onChange={handleChange} className="input" />
                  </div>
                  <div>
                    <label className="label">Profile Picture</label>
                    <input type="file" name="profilePic" onChange={handleChange} className="input" />
                  </div>
                </div>

                <div className="flex justify-end mt-6 gap-3">
                  <button className="btn-primary" onClick={handleSave}>Save</button>
                  <button className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </div>
            )}

            {/* Matched Projects (unchanged logic; styling only) */}
            {!editing && (
              <div className="bg-white/95 p-8 shadow-soft rounded-2xl border">
                <h2 className="text-xl font-bold text-brandNavy mb-4">Matched Projects</h2>
                {matchedProjects.length === 0 ? (
                  <p className="text-gray-600">No matching projects found for your expertise yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {matchedProjects.map(({ project, score }) => (
                      <li key={project.id} className="border p-4 rounded-xl bg-white">
                        <h4 className="font-semibold text-brandNavy">{project.title}</h4>
                        <p className="text-sm text-gray-600">{project.summary}</p>
                        <p className="text-xs text-green-700 mt-1">Match score: {score}</p>
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
              <h2 className="text-xl font-bold text-brandNavy mb-2">Identity Verification (Optional)</h2>

              {formData?.nationalIdHash ? (
                <p className="text-sm text-gray-700 mb-4">
                  Status: <span className="badge-green">Provided (••••{formData.idLast4 || "----"})</span>
                </p>
              ) : (
                <p className="text-sm text-gray-700 mb-4">
                  Status: <span className="badge-gray">Not provided</span>
                </p>
              )}

              <p className="form-hint mb-4">
                Enter a <strong>dummy</strong> National ID or Passport number for demo verification.
                We store a one-way <strong>hash</strong> and the <strong>last 4 digits</strong> only.
              </p>

              <form onSubmit={saveVerification} className="space-y-4">
                <div>
                  <label className="label">ID Type (optional)</label>
                  <select
                    className="input"
                    name="idType"
                    value={idForm.idType}
                    onChange={onIdChange}
                  >
                    <option value="national">National ID</option>
                    <option value="passport">Passport</option>
                  </select>
                </div>
                <div>
                  <label className="label">ID / Passport Number (optional)</label>
                  <input
                    className="input"
                    name="idValue"
                    value={idForm.idValue}
                    onChange={onIdChange}
                    placeholder="Enter a dummy number for demo"
                  />
                  {idError && <p className="form-hint text-red-600">{idError}</p>}
                </div>

                <button type="submit" className="btn-primary w-full" disabled={saving}>
                  {saving ? "Saving..." : "Save Verification"}
                </button>
              </form>
            </div>

            {/* Profile meta */}
            <div className="bg-white/95 p-6 shadow-soft rounded-2xl border text-sm text-gray-600">
              <p><span className="font-semibold">Account created:</span> {new Date(formData.createdAt || Date.now()).toLocaleString()}</p>
              <p className="mt-1">
                <span className="font-semibold">Role:</span> {formData.role || "user"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
