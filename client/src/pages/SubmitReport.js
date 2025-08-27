import React, { useMemo, useState } from "react";

export default function SubmitReport() {
  // ── original state (unchanged)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("corruption");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState(null);
  const [anonymous, setAnonymous] = useState(false);
  const [busy, setBusy] = useState(false);

  // ── original email source (unchanged)
  const email = useMemo(() => localStorage.getItem("userEmail") || "", []);

  // ── original submit logic (unchanged)
  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Please enter a title and description.");
      return;
    }
    const payload = {
      id: Math.random().toString(36).slice(2, 6),
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      anonymous,
      userEmail: anonymous ? "Anonymous" : email || "Anonymous",
      status: "in_review",
      createdAt: new Date().toISOString(),
    };
    if (file) payload.attachment = file.name; // metadata only (demo)

    try {
      setBusy(true);
      await fetch("http://localhost:5000/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      alert("Report submitted successfully.");
      // reset form (unchanged)
      setTitle("");
      setDescription("");
      setLocation("");
      setFile(null);
      setAnonymous(false);
    } catch (e2) {
      console.error(e2);
      alert("Failed to submit report.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* brand hero (visual only) */}
      <section className="bg-brandNavy text-white">
        <div className="max-w-3xl mx-auto px-6 py-8 flex items-center gap-3">
          <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
          <h1 className="text-3xl md:text-4xl font-extrabold">Submit a Civic Report</h1>
        </div>
        <div className="h-1 w-full bg-brandGold" />
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form card (logic unchanged) */}
          <div className="lg:col-span-2">
            <div className="bg-white/95 rounded-2xl shadow-soft border-l-4 border-brandGold p-8">
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="label">Report Title</label>
                  <input
                    className="input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    className="textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Category</label>
                    <select
                      className="input"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="corruption">Corruption</option>
                      <option value="security">Security</option>
                      <option value="medical">Medical</option>
                      <option value="infrastructure">Infrastructure</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Location (optional)</label>
                    <input
                      className="input"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Attach Evidence (image or PDF)</label>
                  <input
                    type="file"
                    className="input"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>

                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                  />
                  <span className="text-sm text-gray-700">Submit anonymously</span>
                </label>

                <button className="btn-primary w-full" disabled={busy}>
                  {busy ? "Submitting…" : "Submit Report"}
                </button>
              </form>
            </div>
          </div>

          {/* Helpful notes (visual only, no logic change) */}
          <aside className="space-y-4">
            <div className="bg-white/90 rounded-2xl shadow-soft border p-5">
              <h3 className="font-semibold text-brandNavy">Tips</h3>
              <ul className="mt-2 text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>Share facts you directly observed.</li>
                <li>Blur names/faces in photos for privacy.</li>
                <li>Location is optional; use “Undisclosed” if unsure.</li>
              </ul>
            </div>
            <div className="bg-brandNavy text-white rounded-2xl shadow-soft p-5">
              <p className="text-sm text-white/90">
                This is an academic prototype. Evidence files are not uploaded; only
                filenames are stored for demo purposes.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
