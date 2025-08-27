import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mbook");
  const [invoice, setInvoice] = useState(null);
  const [user, setUser] = useState(null);

  const fetchProject = () => {
    fetch(`http://localhost:5000/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading project:", err);
        setProject(null);
        setLoading(false);
      });
  };

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      fetch(`http://localhost:5000/users?email=${email}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setUser(data[0]);
        });
    }
    fetchProject();
  }, [id]);

  // NEW: register "I'm Interested" without touching donation flow
  const handleVolunteerInterest = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      alert("Please login first to register your interest.");
      navigate("/login");
      return;
    }
    try {
      const name =
        localStorage.getItem("userName") ||
        localStorage.getItem("fullName") ||
        (user && (user.fullName || user.email)) ||
        "N/A";

      const payload = {
        id: Date.now().toString(),
        projectId: id,
        projectTitle: project?.title || "",
        userEmail: email,
        userName: name,
        timestamp: new Date().toISOString(),
      };

      await fetch("http://localhost:5000/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      alert("Thanks! Your interest was recorded for admin review.");
    } catch (e) {
      console.error("Volunteer interest failed:", e);
      alert("Could not submit interest. Please try again.");
    }
  };

  const handleDonate = async () => {
    if (!user) {
      alert("You must be logged in to donate.");
      navigate("/login");
      return;
    }

    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Enter a valid donation amount.");
      return;
    }

    if (!invoice) {
      alert("Please upload your payment invoice before submitting.");
      return;
    }

    const updatedAmount = (project.donated || 0) + amount;

    try {
      // Update project total
      await fetch(`http://localhost:5000/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donated: updatedAmount }),
      });

      // Save donation record (demo only)
      const donation = {
        id: Date.now().toString(),
        projectId: id,
        amount,
        currency: "USD",
        method: paymentMethod,
        invoice: invoice.name,
        donorEmail: user.email,
        donorName: user.fullName || "N/A",
        donorDob: user.dob || "N/A",
        timestamp: new Date().toISOString(),
      };

      await fetch("http://localhost:5000/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donation),
      });

      alert("Donation submitted successfully!");
      setDonationAmount("");
      setInvoice(null);
      fetchProject();
    } catch (err) {
      console.error("Donation failed:", err);
      alert("Error processing donation.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
        Project not found.
      </div>
    );
  }

  const { title, summary, cost = 0, donated = 0, status = "Planned" } = project;
  const remaining = Math.max(cost - donated, 0);
  const progress = cost ? Math.min((donated / cost) * 100, 100) : 0;

  const renderBankDetails = () => {
    switch (paymentMethod) {
      case "mbook":
        return (
          <div className="bg-blue-50 border p-4 rounded text-sm">
            <p><strong>Transfer via M‑BOK (Bank of Khartoum)</strong></p>
            <p>Account Name: <strong>Alkarama Hub</strong></p>
            <p>Account Number: <strong>1234-5678-9012</strong></p>
            <p>Bank: <strong>Bank of Khartoum</strong></p>
            <p className="mt-2 italic text-gray-600">Please upload the invoice after completing the transfer.</p>
          </div>
        );
      case "fawry":
        return (
          <div className="bg-yellow-50 border p-4 rounded text-sm">
            <p><strong>Transfer via Fawry Bank</strong></p>
            <p>Account Name: <strong>Alkarama Hub</strong></p>
            <p>Account Number: <strong>9876-5432-1098</strong></p>
            <p>Bank: <strong>Fawry</strong></p>
            <p className="mt-2 italic text-gray-600">Please upload the invoice after completing the transfer.</p>
          </div>
        );
      case "cash":
        return (
          <div className="bg-green-50 border p-4 rounded text-sm">
            <p><strong>Cash Payment via NGO or Government Collection Point</strong></p>
            <p className="mt-2 italic text-gray-600">Please upload the stamped receipt or invoice you received.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-20 px-4">
      <div className="bg-white/90 shadow-soft rounded-xl p-10 space-y-6">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
          <h1 className="text-3xl font-extrabold text-brandNavy">{title}</h1>
        </div>

        <p className="text-textDark text-lg">{summary}</p>

        <div className="bg-gray-100 rounded p-4">
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Estimated Cost:</strong> ${cost.toLocaleString()}</p>
          <p><strong>Donated:</strong> ${donated.toLocaleString()}</p>
          <div className="w-full bg-gray-300 h-2 rounded mt-2">
            <div className="bg-green-600 h-2 rounded" style={{ width: `${progress}%` }} />
          </div>
          <p className="italic text-sm mt-1">${remaining.toLocaleString()} still needed</p>
        </div>

        {/* New: Volunteer interest button (separate from donation) */}
        <button onClick={handleVolunteerInterest} className="btn-secondary w-full">
          I’m Interested to Volunteer
        </button>

        {/* Donation Form (unchanged logic) */}
        <div className="mt-6 space-y-4">
          <label className="label">Donation Amount (USD)</label>
          <input
            type="number"
            min="1"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            className="input w-full"
            placeholder="Enter amount"
          />

          <label className="label">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="input w-full"
          >
            <option value="mbook">Bank of Khartoum (M‑BOK)</option>
            <option value="fawry">Fawry</option>
            <option value="cash">Cash / Collection Point</option>
          </select>

          {renderBankDetails()}

          <label className="label mt-4">Upload Payment Invoice</label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setInvoice(e.target.files[0])}
            className="input w-full"
          />

          <button onClick={handleDonate} className="btn-primary w-full">
            Submit Donation
          </button>
        </div>
      </div>
    </div>
  );
}
