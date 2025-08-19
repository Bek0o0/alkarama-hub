import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ setUserRole }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`http://localhost:5000/users?email=${formData.email}`);
      const users = await res.json();

      if (users.length === 0) {
        setError("User not found.");
        return;
      }

      const user = users[0];

      if (user.password !== formData.password) {
        setError("Incorrect password.");
        return;
      }

      if (!user.verified) {
        // For mock verification toggle, assume verified always true
        user.verified = true;
        await fetch(`http://localhost:5000/users/${user.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ verified: true }),
        });
      }

      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userRole", user.role);
      setUserRole(user.role);

      alert("Login successful!");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white/90 p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button type="submit" className="btn-primary w-full">
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign Up {" "}
          </Link>
          
          <Link to="/forgot-password" className="text-primary hover:underline">
            Forgot Password
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
