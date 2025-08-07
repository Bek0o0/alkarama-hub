import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [formData, setFormData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:5000/users?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setFormData(data[0]);
          setUserId(data[0].id);
        } else {
          alert("User not found.");
          navigate("/signup");
        }
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

  if (!formData) return null;

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white/90 p-8 shadow-xl rounded-xl">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">My Profile</h1>

        {!editing ? (
          <>
            <div className="space-y-4 text-textDark">
              <p><strong>Full Name:</strong> {formData.fullName}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Country:</strong> {formData.country || "N/A"}</p>
              <p><strong>Profession:</strong> {formData.profession || "N/A"}</p>
              <p><strong>Expertise:</strong> {formData.expertise || "N/A"}</p>
              <p><strong>Availability:</strong> {formData.availability || "N/A"}</p>
              <p><strong>CV:</strong> {formData.cv || "None uploaded"}</p>
              <div className="mt-4">
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
            <div className="mt-6 text-right">
              <button className="btn-primary" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-5">
              <div>
                <label className="label">Full Name</label>
                <input name="fullName" value={formData.fullName} onChange={handleChange} className="input" />
              </div>
              <div>
                <label className="label">Email</label>
                <input name="email" value={formData.email} disabled className="input" />
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

            <div className="flex justify-end mt-6 space-x-4">
              <button className="btn-primary" onClick={handleSave}>Save</button>
              <button className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
