import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const exists = users.find((user) => user.email === email);

    if (exists) {
      setSubmitted(true);
    } else {
      alert("No account found with that email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white/90 p-8 rounded-xl shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-primary mb-6">Forgot Password</h1>

        {submitted ? (
          <p className="text-green-700">
            A password reset link has been sent to <strong>{email}</strong> (simulated).
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Enter your email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full mt-2"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
