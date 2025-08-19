import React, { useEffect, useState } from "react";

const DiasporaProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const allUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const found = allUsers.find((u) => u.email === email);

    if (found) {
      setUser(found);
      setFormData(found);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "cvFile") {
      setFormData((prev) => ({
        ...prev,
        cvFile: files[0]?.name || "",
      }));
    } else if (name === "profilePic") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({
            ...prev,
            profilePic: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const updated = allUsers.map((u) =>
      u.email === user.email ? formData : u
    );
    localStorage.setItem("registeredUsers", JSON.stringify(updated));
    alert("Profile updated!");
  };

  if (!formData) {
    return (
      <div className="text-center text-gray-600 py-20">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <div className="bg-white/90 p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">
          My Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Full Name</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Country of Residence</label>
            <input
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="label">Profession</label>
            <input
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="label">Areas of Expertise</label>
            <textarea
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
              className="textarea"
            />
          </div>
          <div>
            <label className="label">Availability</label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="input"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="ad-hoc">Ad-hoc</option>
            </select>
          </div>
          <div>
            <label className="label">Upload CV (optional)</label>
            <input
              type="file"
              name="cvFile"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              className="input"
            />
            {formData.cvFile && (
              <p className="text-sm text-gray-600 mt-1">Saved: {formData.cvFile}</p>
            )}
          </div>
          <div>
            <label className="label">Profile Picture (optional)</label>
            <input
              type="file"
              name="profilePic"
              accept="image/*"
              onChange={handleChange}
              className="input"
            />
            {formData.profilePic && (
              <img
                src={formData.profilePic}
                alt="Preview"
                className="w-24 h-24 rounded-full mt-2 object-cover border"
              />
            )}
          </div>

          <button type="submit" className="btn-primary w-full">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default DiasporaProfile;
