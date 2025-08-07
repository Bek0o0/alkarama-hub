import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      // Check if user already exists
      const res = await fetch(`http://localhost:5000/users?email=${formData.email}`);
      const existing = await res.json();

      if (existing.length > 0) {
        alert("Email already registered.");
        return;
      }

      const newUser = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        dob: formData.dob,
        address: formData.address,
        role: formData.email === "admin@hub.com" ? "admin" : "user",
        verified: false,
        profile: {
          profession: "",
          expertise: "",
          availability: "",
          photo: "",
          cv: "",
        },
      };

      // Save to backend
      const createRes = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!createRes.ok) {
        throw new Error("Failed to register user.");
      }

      alert("Account created! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Error registering user.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white/90 p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">
          Create Account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="label">Date of Birth</label>
            <input
              type="date"
              name="dob"
              required
              value={formData.dob}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="label">Address / Location</label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              className="input"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
