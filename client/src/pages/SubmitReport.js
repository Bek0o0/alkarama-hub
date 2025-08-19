import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SubmitReport = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "corruption",
    location: "",
    anonymous: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("userEmail");

    if (!email) {
      alert("Please log in before submitting a report.");
      return;
    }

    const newReport = {
      ...formData,
      userEmail: formData.anonymous ? "Anonymous" : email,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:5000/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReport),
      });

      if (!res.ok) throw new Error("Failed to submit report.");

      alert("Report submitted successfully!");
      navigate("/my-reports");
    } catch (err) {
      console.error(err);
      alert("Error submitting report.");
    }

    setFormData({
      title: "",
      description: "",
      category: "corruption",
      location: "",
      anonymous: false,
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <div className="bg-white/90 p-8 shadow-xl rounded-xl">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">
          Submit a Civic Report
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Report Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="textarea"
            />
          </div>
          <div>
            <label className="label">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
            >
              <option value="corruption">Corruption</option>
              <option value="medical">Medical Emergency</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="security">Security Threat</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="label">Location (optional)</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="anonymous"
              checked={formData.anonymous}
              onChange={handleChange}
              className="w-5 h-5 text-primary border-gray-300 rounded focus:ring focus:ring-primary"
            />
            <label className="text-textDark font-medium">Submit anonymously</label>
          </div>
          <button type="submit" className="btn-primary w-full">
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitReport;
